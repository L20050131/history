import { ADVISOR_ABILITY_MAP } from './content'
import type {
  AchievementState,
  AdvisorAbilityId,
  AdvisorStats,
  ArchiveEntry,
  EndingAchievement,
  EndingKind,
  LibraryState,
  Session,
} from './types'

const SESSION_KEY = 'shanhe-reign-session-v1'
const LIBRARY_KEY = 'shanhe-reign-library-v1'
const ACHIEVEMENT_KEY = 'shanhe-reign-achievements-v1'
const MAX_ARCHIVE_ENTRIES = 48

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage)
  } catch {
    return false
  }
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<Session>
  return (
    candidate.version === 1 &&
    typeof candidate.id === 'string' &&
    typeof candidate.eraName === 'string' &&
    typeof candidate.stage === 'string' &&
    typeof candidate.reignYears === 'number' &&
    typeof candidate.currentYear === 'number' &&
    typeof candidate.resources === 'object' &&
    candidate.resources !== null
  )
}

function normalizeEventOptions(options: unknown): void {
  if (!Array.isArray(options)) return
  for (const option of options) {
    if (!option || typeof option !== 'object') continue
    const record = option as Record<string, unknown>
    if (typeof record.weight !== 'number') {
      const legacy = typeof record.merit === 'number' ? record.merit : 0
      const legacyWeight: Record<number, number> = { [-1]: -2, 0: 0, 1: 1, 2: 3 }
      record.weight = legacyWeight[legacy] ?? legacy
    }
    delete record.merit
  }
}

function deriveAbilityIdFromStats(stats: AdvisorStats | undefined): AdvisorAbilityId {
  if (stats) {
    const focus = Math.max(stats.statecraft, stats.martial, stats.prestige, stats.intrigue)
    if (focus === stats.martial) return 'binglue'
    if (focus === stats.prestige) return 'qingwang'
    if (focus === stats.intrigue) return 'quanshu'
    return 'jingshi'
  }
  return 'jingshi'
}

/** 旧版本以「四维」纪辅臣，迁入时折算为特殊能力；并补上官职与留任标记。 */
function migrateAdvisor(advisor: unknown): void {
  if (!advisor || typeof advisor !== 'object') return
  const record = advisor as Record<string, unknown>
  if (!record.ability) {
    const ability =
      ADVISOR_ABILITY_MAP[deriveAbilityIdFromStats(record.stats as AdvisorStats | undefined)]
    record.ability = ability
    record.epithet = ability.name
  }
  if (record.office === undefined) record.office = null
  if (record.legacy === undefined) record.legacy = false
}

export function loadSession(): Session | null {
  if (!canUseStorage()) return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isSession(parsed)) return null
    if (!Array.isArray(parsed.specialSeen)) parsed.specialSeen = []
    if (typeof parsed.actionPoints !== 'number') parsed.actionPoints = 3
    if (Array.isArray(parsed.advisorCandidates)) {
      parsed.advisorCandidates.forEach(migrateAdvisor)
    }
    const legacySession = parsed as unknown as {
      advisors?: unknown
      selectedAdvisor?: unknown
      office?: unknown
      bondYear?: unknown
      bondSeen?: unknown
      funeralSeen?: unknown
    }
    if (!Array.isArray(legacySession.advisors)) {
      legacySession.advisors = legacySession.selectedAdvisor
        ? [
            {
              ...(legacySession.selectedAdvisor as Record<string, unknown>),
              office: legacySession.office ?? null,
            },
          ]
        : []
    }
    ;(legacySession.advisors as unknown[]).forEach(migrateAdvisor)
    delete legacySession.selectedAdvisor
    delete legacySession.office
    if (legacySession.bondYear === undefined) legacySession.bondYear = null
    if (typeof legacySession.bondSeen !== 'boolean') legacySession.bondSeen = false
    // 旧卷多已在位多年，不应再补一场即位葬仪；新朝由 createSession 单独置为 false。
    if (typeof legacySession.funeralSeen !== 'boolean') legacySession.funeralSeen = true
    if (parsed.currentEvent) {
      normalizeEventOptions(parsed.currentEvent.options)
      if (!Array.isArray(parsed.currentEvent.voices)) parsed.currentEvent.voices = []
    }
    if (parsed.outcome) {
      if (parsed.outcome.endingCause === undefined) parsed.outcome.endingCause = null
      if (parsed.outcome.choiceWeight === undefined) parsed.outcome.choiceWeight = null
      if (parsed.outcome.choiceIsAdvisor === undefined) parsed.outcome.choiceIsAdvisor = false
      if (parsed.outcome.twist === undefined) parsed.outcome.twist = null
    }
    if (parsed.yearSummary) {
      if (typeof parsed.yearSummary.score !== 'number') parsed.yearSummary.score = 0
      for (const entry of parsed.yearSummary.events ?? []) {
        if (entry.weight === undefined) entry.weight = null
      }
    }
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: Session): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return true
  } catch {
    return false
  }
}

export function clearSession(): void {
  if (!canUseStorage()) return
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore storage failures; the in-memory game remains playable.
  }
}

function emptyLibrary(): LibraryState {
  return { version: 1, entries: [] }
}

export function loadLibrary(): LibraryState {
  if (!canUseStorage()) return emptyLibrary()
  try {
    const raw = window.localStorage.getItem(LIBRARY_KEY)
    if (!raw) return emptyLibrary()
    const parsed = JSON.parse(raw) as Partial<LibraryState>
    if (!Array.isArray(parsed.entries)) return emptyLibrary()
    return { version: 1, entries: parsed.entries.filter(Boolean) as ArchiveEntry[] }
  } catch {
    return emptyLibrary()
  }
}

export function saveLibrary(library: LibraryState): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(library))
    return true
  } catch {
    return false
  }
}

export function appendArchive(entry: ArchiveEntry): LibraryState {
  const library = loadLibrary()
  if (library.entries.some((item) => item.sessionId === entry.sessionId)) return library
  library.entries = [entry, ...library.entries].slice(0, MAX_ARCHIVE_ENTRIES)
  saveLibrary(library)
  return library
}

export function clearLibrary(): LibraryState {
  const library = emptyLibrary()
  saveLibrary(library)
  return library
}

function emptyAchievements(): AchievementState {
  return { version: 1, endings: {} }
}

export function loadAchievements(): AchievementState {
  if (!canUseStorage()) return emptyAchievements()
  try {
    const raw = window.localStorage.getItem(ACHIEVEMENT_KEY)
    if (!raw) return emptyAchievements()
    const parsed = JSON.parse(raw) as Partial<AchievementState>
    if (!parsed.endings || typeof parsed.endings !== 'object') return emptyAchievements()
    const endings: Partial<Record<EndingKind, EndingAchievement>> = {}
    for (const [kind, record] of Object.entries(parsed.endings)) {
      if (!record || typeof record !== 'object') continue
      const entry = record as Partial<EndingAchievement>
      if (typeof entry.count !== 'number' || typeof entry.unlockedAt !== 'string') continue
      const latestEpithet =
        typeof entry.latestEpithet === 'string' ? entry.latestEpithet : ''
      const epithets = Array.isArray(entry.epithets)
        ? entry.epithets.filter((item): item is string => typeof item === 'string')
        : latestEpithet
          ? [latestEpithet]
          : []
      endings[kind as EndingKind] = {
        kind: kind as EndingKind,
        unlockedAt: entry.unlockedAt,
        count: entry.count,
        bestYears: typeof entry.bestYears === 'number' ? entry.bestYears : 0,
        latestEraName: typeof entry.latestEraName === 'string' ? entry.latestEraName : '',
        latestEpithet,
        latestYears: typeof entry.latestYears === 'number' ? entry.latestYears : 0,
        epithets: [...new Set(epithets)],
      }
    }
    return { version: 1, endings }
  } catch {
    return emptyAchievements()
  }
}

export function saveAchievements(state: AchievementState): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export interface EndingAchievementInput {
  kind: EndingKind
  eraName: string
  epithet: string
  years: number
  at: string
}

export function recordEndingAchievement(input: EndingAchievementInput): AchievementState {
  const state = loadAchievements()
  const previous = state.endings[input.kind]
  state.endings[input.kind] = {
    kind: input.kind,
    unlockedAt: previous?.unlockedAt ?? input.at,
    count: (previous?.count ?? 0) + 1,
    bestYears: Math.max(previous?.bestYears ?? 0, input.years),
    latestEraName: input.eraName,
    latestEpithet: input.epithet,
    latestYears: input.years,
    epithets: [...new Set([...(previous?.epithets ?? []), input.epithet])],
  }
  saveAchievements(state)
  return state
}

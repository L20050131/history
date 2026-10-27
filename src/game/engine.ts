import {
  ADVISOR_ABILITIES,
  ADVISOR_GIVEN_NAMES,
  ADVISOR_ORIGINS,
  ADVISOR_SURNAMES,
  ADVISOR_TRAITS,
  ANNUAL_MARK_META,
  BASE_RESOURCES,
  CATEGORY_META,
  ENDING_FIXED_EPITHET,
  ENDING_META,
  EPITHETS,
  FORTUNE_BANES,
  FORTUNE_BOONS,
  OFFICES,
  RESOURCE_META,
  RESOURCE_ORDER,
} from './content'
import { CHAINS } from './chains'
import { EVENT_SCENES } from './event-scenes'
import { DAILY_EVENTS } from './events'
import { SPECIAL_EVENTS } from './special-events'
import type {
  Advisor,
  AnnualMark,
  ArchiveEntry,
  ChainScheduleEntry,
  EndingKind,
  EventCategory,
  EventOption,
  EventTemplate,
  EventVariant,
  EventVoice,
  FortuneEffect,
  GameDate,
  GameEvent,
  OfficeId,
  Omen,
  OptionTone,
  OutcomeRecord,
  QuarterFortune,
  ResourceDelta,
  ResourceKey,
  Resources,
  Session,
  YearSummary,
} from './types'

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const MONTH_NAMES = [
  '孟春',
  '仲春',
  '季春',
  '孟夏',
  '仲夏',
  '季夏',
  '孟秋',
  '仲秋',
  '季秋',
  '孟冬',
  '仲冬',
  '季冬',
]
const CATEGORY_KEYS: EventCategory[] = ['governance', 'military', 'economy', 'ritual', 'culture']
const CHAIN_CATEGORIES: Record<string, EventCategory> = {
  'qin-reform': 'economy',
  fanyang: 'military',
  'salt-debate': 'economy',
  'western-road': 'military',
  'imperial-exam': 'culture',
}

/** 每岁行动点：一年四时，只可亲理三桩事务，其余须搁置。 */
const ACTION_POINTS_PER_YEAR = 3

const COURT_MURMURS: Record<EventCategory, string[]> = {
  governance: [
    '殿角的老臣把笏板攥得发白，终究没有出列。',
    '廊下当值的小黄门听见御案上的朱笔搁下又提起，来回三次。',
    '中书舍人低声提醒：“此诏一出，明日台谏必有章疏。”',
    '阶前铜鹤吐出的香烟被穿堂风吹散，满殿无人先开口。',
  ],
  military: [
    '兵部尚书的靴底沾着未干的泥，像是刚从城外大营赶来。',
    '殿外甲叶轻响，宿卫换班时多看了御座一眼。',
    '一封边报被反复展开，纸角已磨得起了毛。',
    '老将抱拳立于丹墀之下，须发间还带着北地的风霜。',
  ],
  economy: [
    '度支郎中袖中露出半截账册，墨迹被汗浸得发花。',
    '殿上的算盘声忽然停了，众人都等着御座上的那一声。',
    '有臣子低声嘀咕：“再这样支下去，下月连百官俸禄也难了。”',
    '内库送来的样品摆在案头，金玉其外，账目却无人敢翻。',
  ],
  ritual: [
    '太常卿的礼服一丝不乱，额角却沁出细汗。',
    '殿外钟磬余音未绝，香灰落满了青铜祭器。',
    '礼官捧着旧仪注，手指停在某一页，许久没有翻动。',
    '宗正卿垂着眼，仿佛在数地砖上的裂纹。',
  ],
  culture: [
    '翰林学士的袖口沾着墨，奏疏边角写满了小字。',
    '太学方向传来隐约的诵书声，很快又被宫墙隔断。',
    '一名年轻词臣欲言又止，最终只把策论往前推了推。',
    '书页翻动的声音在殿中格外清晰，像有人在暗处发问。',
  ],
}

const SEASON_MURMURS: Record<number, string[]> = {
  1: [
    '阶前杏花开到一半，内侍说是吉兆；钦天监却只报了今日风向。',
    '春雨落在琉璃瓦上，声音细密，听久了竟像无数人在低语。',
  ],
  2: [
    '殿中冰鉴已经换上第三回，暑气仍从地砖缝里往上冒。',
    '蝉声越过宫墙，吵得奏对的人不自觉提高了嗓门。',
  ],
  3: [
    '一片枯叶落在丹墀上，被风卷着转了两圈，停在御座之前。',
    '秋风从北边来，带着一点若有若无的烽烟气味。',
  ],
  4: [
    '殿外铜壶滴漏声格外清楚，炭火把每个人的影子拉得很长。',
    '雪压宫檐，宿卫跺脚取暖的声音一下一下传进殿来。',
  ],
}

function buildStateVoice(session: Session): EventVoice | null {
  const { regent, treasury, unrest, army } = session.resources
  if (regent >= 72) {
    return {
      label: '权臣之影',
      text: '那位权臣的席位明明低于御座三级，今日却无人敢先抬头看他。',
    }
  }
  if (treasury <= 28) {
    return {
      label: '计相之色',
      text: '户部尚书垂手不语，袖中账册已翻到最后一页，边角尽是朱批。',
    }
  }
  if (unrest >= 62) {
    return {
      label: '禁军之语',
      text: '殿外隐约传来市井鼓噪，宿卫按刀而立，谁也没有回头。',
    }
  }
  if (army <= 34) {
    return {
      label: '兵部之报',
      text: '兵部侍郎的奏报只有半页，剩下的部分据说已在途中被火烧去。',
    }
  }
  const advisor = session.advisors[0]
  if (advisor) {
    const office = advisor.office
    return {
      label: advisor.legacy ? '旧臣私语' : '辅臣私语',
      text: office === 'chancellor'
        ? '“钱粮尚有腾挪，只怕人心不肯再等。”'
        : office === 'marshal'
          ? '“边军可战，然不可久疲。”'
          : office === 'censor'
            ? '“台谏已在门外候着，陛下今日须给一句话。”'
            : office === 'steward'
              ? '“账目能做平，日子做不平。”'
              : '“臣以为，此事宜缓一步。”',
    }
  }
  return null
}

function buildEventVoices(session: Session, category: EventCategory): EventVoice[] {
  const voices: EventVoice[] = [
    { label: '殿上侧闻', text: pickOne(COURT_MURMURS[category]) },
  ]
  const stateVoice = buildStateVoice(session)
  if (stateVoice) {
    voices.push(stateVoice)
  } else {
    voices.push({
      label: '四时风物',
      text: pickOne(SEASON_MURMURS[session.quarter] ?? SEASON_MURMURS[1] ?? []),
    })
  }
  return voices
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function pickOne<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)] as T
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i)
    const current = copy[i]
    copy[i] = copy[j] as T
    copy[j] = current as T
  }
  return copy
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function cloneResources(resources: Resources): Resources {
  return { ...resources }
}

function uniqueId(prefix = 'id'): string {
  const random = Math.random().toString(36).slice(2, 9)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}

function gaussian(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function rollReignYears(): number {
  for (let guard = 0; guard < 1000; guard += 1) {
    const value = 25 + gaussian() * 6.6
    if (value >= 10 && value <= 40) return Math.round(value)
  }
  return 25
}

export function validateEraName(value: string): boolean {
  return /^\p{Script=Han}{2}$/u.test(value.trim())
}

export function formatEraYear(session: Pick<Session, 'eraName' | 'currentYear'>): string {
  if (session.currentYear === 1) return `${session.eraName}元年`
  return `${session.eraName}${toChineseNumber(session.currentYear)}年`
}

export function toChineseNumber(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '零'
  if (value < 10) return ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][value] ?? String(value)
  if (value === 10) return '十'
  if (value < 20) return `十${toChineseNumber(value - 10)}`
  if (value < 100) {
    const tens = Math.floor(value / 10)
    const ones = value % 10
    return `${toChineseNumber(tens)}十${ones ? toChineseNumber(ones) : ''}`
  }
  return String(value)
}

function ganzhi(index: number): string {
  const stem = STEMS[((index % 10) + 10) % 10] ?? '甲'
  const branch = BRANCHES[((index % 12) + 12) % 12] ?? '子'
  return `${stem}${branch}`
}

export function yearGanzhi(session: Pick<Session, 'startYearGanzhi' | 'currentYear'>): string {
  return ganzhi(session.startYearGanzhi + session.currentYear - 1)
}

function formatDateLabel(session: Session, date: GameDate): string {
  return `${formatEraYear(session)}·${date.monthName}`
}

export function formatFullDate(session: Session, date: GameDate): string {
  return `岁次${yearGanzhi(session)} · ${date.monthName}${date.monthGanzhi}月 · ${date.dayGanzhi}日`
}

function createDate(session: Session, quarter: number): GameDate {
  const monthIndex = (quarter - 1) * 3 + randomInt(0, 2)
  const yearIndex = session.startYearGanzhi + session.currentYear - 1
  const yearStem = ((yearIndex % 10) + 10) % 10
  const firstMonthStem = ((yearStem % 5) * 2 + 2) % 10
  const monthStem = (firstMonthStem + monthIndex) % 10
  const monthBranch = (2 + monthIndex) % 12
  session.dayIndex = (session.dayIndex + randomInt(24, 46)) % 60
  return {
    yearGanzhi: ganzhi(yearIndex),
    monthName: MONTH_NAMES[monthIndex] ?? '孟春',
    monthGanzhi: `${STEMS[monthStem] ?? '甲'}${BRANCHES[monthBranch] ?? '寅'}`,
    dayGanzhi: ganzhi(session.dayIndex),
  }
}

export function createAdvisorCandidates(count = 3): Advisor[] {
  const candidates: Advisor[] = []
  const usedNames = new Set<string>()
  const usedAbilities = new Set<string>()
  let guard = 0
  while (candidates.length < count && guard < 300) {
    guard += 1
    const surname = pickOne(ADVISOR_SURNAMES)
    const given = pickOne(ADVISOR_GIVEN_NAMES)
    const name = `${surname}${given}`
    if (usedNames.has(name)) continue
    usedNames.add(name)
    const available = ADVISOR_ABILITIES.filter((ability) => !usedAbilities.has(ability.id))
    const ability = pickOne(available.length > 0 ? available : ADVISOR_ABILITIES)
    usedAbilities.add(ability.id)
    candidates.push({
      id: uniqueId('advisor'),
      name,
      courtesy: `字${pickOne(['景', '文', '子', '伯', '仲', '叔', '季', '元'])}${pickOne([
        '安',
        '远',
        '衡',
        '度',
        '谦',
        '晦',
        '瑜',
        '直',
      ])}`,
      origin: pickOne(ADVISOR_ORIGINS),
      avatar: surname.slice(0, 1),
      epithet: ability.name,
      trait: pickOne(ADVISOR_TRAITS),
      ability,
      office: null,
    })
  }
  return candidates
}

function buildChainSchedule(reignYears: number): ChainScheduleEntry[] {
  const chains = shuffle(CHAINS).slice(0, 3)
  const ratios = [0.12, 0.45, 0.72]
  const used = new Set<number>()
  const totalQuarters = reignYears * 4
  const entries: ChainScheduleEntry[] = []

  chains.forEach((chain, chainIndex) => {
    const ratio = ratios[chainIndex] ?? 0.5
    const targetYear = clamp(Math.round(2 + (reignYears - 4) * ratio + randomInt(-1, 1)), 2, Math.max(2, reignYears - 1))
    let desired = (targetYear - 1) * 4 + randomInt(0, 3)

    chain.steps.forEach((_step, stepIndex) => {
      while (used.has(desired) && desired < totalQuarters) desired += 1
      if (desired >= totalQuarters) return
      used.add(desired)
      entries.push({
        chainId: chain.id,
        chainName: chain.name,
        stepIndex,
        year: Math.floor(desired / 4) + 1,
        quarter: (desired % 4) + 1,
        canceled: false,
      })
      desired += 4
    })
  })

  return entries
}

export interface CreateSessionOptions {
  eraName: string
  generation: number
  inherited: boolean
  inheritedFrom: string | null
  resources: Resources
  /** 前朝留任之臣，最多一人；即位后即入新朝辅臣之列。 */
  inheritedAdvisors?: Advisor[]
}

export function createSession(options: CreateSessionOptions): Session {
  const now = new Date().toISOString()
  const reignYears = rollReignYears()
  const resources = {} as Resources
  RESOURCE_ORDER.forEach((key) => {
    resources[key] = clamp(Math.round(options.resources[key]), 0, 100)
  })
  // 前朝首辅留任，新朝再补一位，两代同堂。
  const inheritedAdvisors = (options.inheritedAdvisors ?? [])
    .slice(0, 1)
    .map((advisor) => ({ ...advisor, legacy: true, office: advisor.office ?? null }))
  return {
    version: 1,
    id: uniqueId('reign'),
    stage: 'advisors',
    eraName: options.eraName.trim(),
    generation: options.generation,
    inherited: options.inherited,
    inheritedFrom: options.inheritedFrom,
    createdAt: now,
    updatedAt: now,
    reignYears,
    startYearGanzhi: randomInt(0, 59),
    startDayIndex: randomInt(0, 59),
    currentYear: 1,
    quarter: 1,
    dayIndex: randomInt(0, 59),
    actionPoints: ACTION_POINTS_PER_YEAR,
    resources,
    advisorCandidates: createAdvisorCandidates(3),
    advisors: inheritedAdvisors,
    bondYear: null,
    bondSeen: false,
    funeralSeen: !options.inherited,
    currentEvent: null,
    outcome: null,
    reignPage: 'event',
    annual: { total: 0, skipped: 0, score: 0 },
    yearStartResources: cloneResources(resources),
    yearLog: [],
    yearSummary: null,
    chainSchedule: buildChainSchedule(reignYears),
    specialSeen: [],
    recentEventIds: [],
    chronicle: [],
    evaluations: { 顺: 0, 厄: 0, 平: 0, 庸: 0 },
    categoryTally: { governance: 0, military: 0, economy: 0, ritual: 0, culture: 0 },
    pendingEnding: null,
    ending: null,
    archived: false,
  }
}

/** 新旧两代辅臣并立时，安排一朝一次的交章之年。 */
function scheduleBondYear(session: Session): void {
  const hasLegacy = session.advisors.some((advisor) => advisor.legacy)
  const hasNew = session.advisors.some((advisor) => !advisor.legacy)
  session.bondSeen = false
  session.bondYear =
    hasLegacy && hasNew
      ? clamp(randomInt(2, 6), 2, Math.max(2, session.reignYears - 1))
      : null
}

export function beginReign(session: Session): void {
  session.stage = 'reign'
  session.currentYear = 1
  session.quarter = 1
  session.actionPoints = ACTION_POINTS_PER_YEAR
  session.annual = { total: 0, skipped: 0, score: 0 }
  scheduleBondYear(session)
  session.yearStartResources = cloneResources(session.resources)
  session.yearLog = []
  session.yearSummary = null
  session.outcome = null
  session.pendingEnding = null
  session.reignPage = 'event'
  session.currentEvent = createQuarterEvent(session)
  touch(session)
}

/** 事池尽竭之后，至少隔开最近这些事，免得同一桩朝政接连重演。 */
const RECENT_COOLDOWN = 10

function chooseDailyTemplate(session: Session): EventTemplate {
  // 一朝之内尽量不重演同一事件：先从本朝未见者中抽取；事池尽竭后，
  // 再避开最近演过的十余事，使旧事重提时也有足够的间隔。
  const seen = new Set(session.recentEventIds)
  const fresh = DAILY_EVENTS.filter((event) => !seen.has(event.id))
  if (fresh.length > 0) return pickOne(fresh)
  const cooled = new Set(session.recentEventIds.slice(-RECENT_COOLDOWN))
  const rest = DAILY_EVENTS.filter((event) => !cooled.has(event.id))
  return pickOne(rest.length > 0 ? rest : DAILY_EVENTS)
}

/** 承继之朝，积弊会在部分日常朝政上发作。 */
const DECLINE_BASE_CHANCE = 45

function hashTemplateId(id: string): number {
  let hash = 0
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0
  }
  return hash
}

function declineChance(generation: number): number {
  return Math.min(80, DECLINE_BASE_CHANCE + Math.max(0, generation - 1) * 10)
}

function shouldDeclineEvent(session: Session, templateId: string): boolean {
  if (!session.inherited) return false
  return hashTemplateId(templateId) % 100 < declineChance(session.generation)
}

function declineFactor(generation: number): number {
  return Math.min(1.8, 1 + Math.max(0, generation - 1) * 0.2)
}

/** 只加重有害方向的效果：府库、军势之损，民变、权臣之增。 */
function amplifyHarm(
  effects: ResourceDelta,
  factor: number,
): { effects: ResourceDelta; applied: boolean } {
  const out: ResourceDelta = {}
  let applied = false
  RESOURCE_ORDER.forEach((key) => {
    const value = effects[key]
    if (value === undefined) return
    const harmful =
      (RESOURCE_META[key].danger === 'high' && value > 0) ||
      (RESOURCE_META[key].danger === 'low' && value < 0)
    if (!harmful) {
      out[key] = value
      return
    }
    const scaled = value > 0 ? Math.ceil(value * factor) : Math.floor(value * factor)
    out[key] = scaled
    if (scaled !== value) applied = true
  })
  return { effects: out, applied }
}

interface ResolvedEventContent {
  title: string
  subtitle: string
  narrative: string
  options: EventOption[]
}

function resolveEventContent(template: EventTemplate, session: Session): ResolvedEventContent {
  const variants: EventVariant[] = (template.variants ?? []).filter(
    (variant) => !variant.quarters || variant.quarters.includes(session.quarter),
  )
  const scene = EVENT_SCENES[template.id]
  const base: ResolvedEventContent = {
    title: template.title,
    subtitle: template.subtitle,
    narrative: scene ? `${template.narrative}\n\n${scene}` : template.narrative,
    options: template.options,
  }
  if (variants.length === 0) return base

  const pool = [
    { content: base, weight: 1 },
    ...variants.map((variant) => ({
      content: {
        title: variant.title,
        subtitle: variant.subtitle,
        narrative: variant.narrative,
        options: variant.options,
      },
      weight: Math.max(0.1, variant.weight ?? 1),
    })),
  ]
  const total = pool.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * total
  for (const item of pool) {
    roll -= item.weight
    if (roll <= 0) return item.content
  }
  return base
}

function selectOptions(options: EventOption[]): EventOption[] {
  const max = Math.min(4, options.length)
  const count = randomInt(2, max)
  const radicals = options.filter((option) => option.tone === 'radical')
  const cautious = options.filter((option) => option.tone === 'cautious')
  const first = pickOne(radicals.length > 0 ? radicals : options)
  const second = pickOne(cautious.length > 0 ? cautious : options)
  const chosen: EventOption[] = []
  const ids = new Set<string>()
  for (const option of [first, second]) {
    if (!ids.has(option.id)) {
      ids.add(option.id)
      chosen.push(option)
    }
  }
  const rest = shuffle(options.filter((option) => !ids.has(option.id)))
  for (const option of rest) {
    if (chosen.length >= count) break
    chosen.push(option)
  }
  return shuffle(chosen)
}

function adjustEffectsForOmen(option: EventOption, omen: Omen): EventOption {
  const effects: ResourceDelta = { ...option.effects }
  if (omen === '吉' && option.tone === 'radical') {
    RESOURCE_ORDER.forEach((key) => {
      const value = effects[key]
      if (value !== undefined && value > 0) effects[key] = Math.ceil(value * 1.5)
    })
  }
  if (omen === '凶' && option.tone === 'cautious') {
    RESOURCE_ORDER.forEach((key) => {
      const value = effects[key]
      if (value !== undefined && value < 0) effects[key] = Math.ceil(value * 0.5)
    })
  }
  return { ...option, effects }
}

/** 辅臣进言：利于国势之变增半，不利于国势之变减半，政绩更优。 */
function boostEffects(effects: ResourceDelta): ResourceDelta {
  const out: ResourceDelta = {}
  RESOURCE_ORDER.forEach((key) => {
    const value = effects[key]
    if (value === undefined) return
    const positiveIsGood = RESOURCE_META[key].danger === 'low'
    const goodForPlayer = value > 0 ? positiveIsGood : !positiveIsGood
    out[key] = goodForPlayer
      ? value > 0
        ? Math.ceil(value * 1.5)
        : Math.floor(value * 1.5)
      : value > 0
        ? Math.floor(value * 0.5)
        : Math.ceil(value * 0.5)
  })
  return out
}

function buildAdvisorCounsel(advisor: Advisor, source: EventOption): EventOption {
  return {
    id: uniqueId('counsel'),
    label: `${advisor.name}曰：${source.label}`,
    description: `${source.description} ${advisor.name}力主此策，愿总领其事，务求其成。`,
    tone: source.tone,
    effects: boostEffects(source.effects),
    weight: Math.max(3, source.weight + 1),
    outcome: `${source.outcome}（此事由${advisor.name}亲加督办，上下用命，成效尤著。）`,
    isAdvisor: true,
    advisorName: advisor.name,
  }
}

/** 在相关日常事件中，具备相应特殊能力的辅臣有概率进言，献上更优之策。 */
function maybeAddAdvisorCounsel(event: GameEvent, session: Session): void {
  const willing = session.advisors.filter(
    (advisor) =>
      advisor.ability.categories.includes(event.category) &&
      Math.random() <= advisor.ability.counselChance,
  )
  if (willing.length === 0) return
  const advisor = pickOne(willing)
  const best = [...event.options].sort((a, b) => b.weight - a.weight)[0]
  if (!best) return
  event.options.push(buildAdvisorCounsel(advisor, best))
}

function rollOmen(): Omen {
  const value = Math.random()
  if (value < 0.28) return '吉'
  if (value < 0.56) return '凶'
  return '平'
}

function pickFortune(pool: FortuneEffect[], excludeId?: string): FortuneEffect {
  const available = excludeId ? pool.filter((effect) => effect.id !== excludeId) : pool
  const chosen = pickOne(available.length > 0 ? available : pool)
  return { ...chosen, effects: { ...chosen.effects } }
}

function rollFortune(): QuarterFortune {
  // A quarter may pass quietly, bring only adversity, or bring a boon that is
  // always paired with a bane. Mixed quarters are the most common, so a reign
  // remains playable across the full 10–40 year range.
  const value = Math.random()
  if (value < 0.22) return { mood: 'calm', boon: null, bane: null }
  if (value < 0.52) {
    return { mood: 'adverse', boon: null, bane: pickFortune(FORTUNE_BANES) }
  }
  const bane = pickFortune(FORTUNE_BANES)
  return { mood: 'mixed', boon: pickFortune(FORTUNE_BOONS, bane.id), bane }
}

function findScheduledChain(session: Session): ChainScheduleEntry | null {
  return (
    session.chainSchedule.find(
      (entry) =>
        !entry.canceled && entry.year === session.currentYear && entry.quarter === session.quarter,
    ) ?? null
  )
}

function createDailyEvent(session: Session): GameEvent {
  const template = chooseDailyTemplate(session)
  const content = resolveEventContent(template, session)
  const omen = rollOmen()
  const options = selectOptions(content.options).map((option) =>
    adjustEffectsForOmen(option, omen),
  )
  const date = createDate(session, session.quarter)
  // 只记最近一次，既保本朝「未见」之判，又不让旧卷无限增长。
  session.recentEventIds = [
    ...session.recentEventIds.filter((id) => id !== template.id),
    template.id,
  ]

  const event: GameEvent = {
    occurrenceId: uniqueId('event'),
    templateId: template.id,
    category: template.category,
    categoryLabel: CATEGORY_META[template.category].label,
    title: content.title,
    subtitle: content.subtitle,
    narrative: content.narrative,
    source: 'daily',
    chain: null,
    options,
    voices: buildEventVoices(session, template.category),
    omen,
    date,
    fortune: rollFortune(),
    decline: shouldDeclineEvent(session, template.id),
  }
  maybeAddAdvisorCounsel(event, session)
  return event
}

/** 承继新朝的首季：先皇葬仪。 */
function createFuneralEvent(session: Session): GameEvent {
  session.funeralSeen = true
  const date = createDate(session, session.quarter)
  const options: EventOption[] = [
    {
      id: 'funeral-frugal',
      label: '遵诏薄葬',
      description: '依先帝遗诏，山陵从简，省下的钱粮转补边饷与赈济。',
      tone: 'radical',
      effects: { treasury: 4, regent: -2, unrest: -1 },
      weight: 3,
      outcome:
        '诏依遗诏，山陵从简，省下的钱粮尽数拨去补边饷、赈灾民。宗室在背后骂新君刻薄，京畿百姓却在灵前多烧了一炷香。',
    },
    {
      id: 'funeral-customary',
      label: '山陵如制',
      description: '葬仪悉依旧礼，仪仗、陪葬、哭临一毫不减。',
      tone: 'balanced',
      effects: { treasury: -3, regent: 1, unrest: -1 },
      weight: 1,
      outcome:
        '葬仪悉依旧制，百官素服哭临，仪仗绵延十里。礼成之日，府库的账册也薄了一截，度支官捧着空匣子，半天没说话。',
    },
    {
      id: 'funeral-lavish',
      label: '大起陵寝',
      description: '广征民夫，增修明楼石兽，以彰新君孝道。',
      tone: 'radical',
      effects: { treasury: -8, regent: 3, unrest: 3 },
      weight: -2,
      outcome:
        '陵工征发数万人，石兽、明楼、神道一一如制，连陪葬的陶俑都换了三彩。工未毕而府库先竭，沿途州县又添了一轮加派。',
    },
    {
      id: 'funeral-supervise',
      label: '宗室共督',
      description: '命宗正卿与宰相共督山陵，裁去浮费，仍存大体。',
      tone: 'balanced',
      effects: { treasury: -2, regent: -1, unrest: -1 },
      weight: 1,
      outcome:
        '命宗正卿与宰相共督山陵，裁去浮费，仍存大体。诸王虽有怨言，见宗室亦在督工之列，倒也不好再说什么。',
    },
  ]
  return {
    occurrenceId: uniqueId('funeral-event'),
    templateId: 'royal-funeral',
    category: 'ritual',
    categoryLabel: '国丧',
    title: '先皇葬仪',
    subtitle: '梓宫未闭，新君初立',
    narrative:
      '大行皇帝的梓宫停于太极殿，白幡从宫门一直垂到御街。新君尚未改元，先要办的是葬仪：山陵用度、陪葬仪仗、宗室哭临，桩桩件件都压在新朝的第一道诏书上。\n\n' +
      '礼部呈上的旧例足有半尺厚，最上面一页写着“依先帝遗诏，山陵从简”；宗正卿却在阶下低声提醒，诸王已连夜入京，若葬仪失了体面，恐寒了宗室之心。灵前的长明灯被穿堂风吹得一晃，满殿人影也跟着摇了摇。',
    source: 'special',
    chain: null,
    options,
    voices: [
      {
        label: '山陵使',
        text: '“陛下，陵工一日不启，梓宫便一日不能奉安。只是这银子……户部说，实在拿不出第二份了。”',
      },
      {
        label: '宗室私语',
        text: '“先帝尸骨未寒，新君便想着省钱。这话传出去，天下人怎么看咱们这一家子？”',
      },
    ],
    omen: '平',
    date,
    fortune: { mood: 'calm', boon: null, bane: null },
    funeral: true,
  }
}

const SPECIAL_EVENT_CHANCE = 0.09

function shouldOfferSpecialEvent(session: Session): boolean {
  if (session.currentYear < 2) return false
  const seen = session.specialSeen ?? []
  if (seen.length >= SPECIAL_EVENTS.length) return false
  return Math.random() < SPECIAL_EVENT_CHANCE
}

function chooseSpecialTemplate(session: Session): EventTemplate | null {
  const seen = new Set(session.specialSeen ?? [])
  const available = SPECIAL_EVENTS.filter((event) => !seen.has(event.id))
  return available.length > 0 ? pickOne(available) : null
}

function createSpecialEvent(session: Session, template: EventTemplate): GameEvent {
  session.specialSeen = [...(session.specialSeen ?? []), template.id]
  const date = createDate(session, session.quarter)
  return {
    occurrenceId: uniqueId('special-event'),
    templateId: template.id,
    category: template.category,
    categoryLabel: CATEGORY_META[template.category].label,
    title: template.title,
    subtitle: template.subtitle,
    narrative: template.narrative,
    source: 'special',
    chain: null,
    options: template.options.map((option) => ({
      ...option,
      effects: { ...option.effects },
    })),
    voices: buildEventVoices(session, template.category),
    omen: '平',
    date,
    fortune: rollFortune(),
  }
}

/** 两代辅臣同朝：或联章共奏，或互上弹章。一朝仅此一次。 */
function createBondEvent(session: Session): GameEvent | null {
  const legacy = session.advisors.find((advisor) => advisor.legacy)
  const current = session.advisors.find((advisor) => !advisor.legacy)
  if (!legacy || !current) return null
  session.bondSeen = true
  const date = createDate(session, session.quarter)
  const category: EventCategory = 'governance'
  const voices: EventVoice[] = [
    {
      label: '殿上侧闻',
      text: `${legacy.name}的旧笏与${current.name}的新章，一左一右摆在御案上，墨色一新一旧。`,
    },
    {
      label: '两代之间',
      text: '老臣的靴底沾着多年积下的尘土，新臣的袖口却还带着馆阁里的墨香。',
    },
  ]

  if (Math.random() < 0.5) {
    const options: EventOption[] = [
      {
        id: 'bond-joint-radical',
        label: '准其联章',
        description: `尽从${legacy.name}、${current.name}所请，清田、裁冗、减役三事并行。`,
        tone: 'radical',
        effects: { treasury: -4, unrest: -3, regent: -2 },
        weight: 3,
        outcome: `诏下，三事并行。${legacy.name}谙练旧例，${current.name}锐意任事，二人分领其责，豪右为之敛手，国用亦见宽纾。`,
      },
      {
        id: 'bond-joint-balanced',
        label: '择要准行',
        description: '只取清田一事先行，裁冗、减役留待来岁再议。',
        tone: 'balanced',
        effects: { treasury: 2, unrest: -1 },
        weight: 1,
        outcome: '清田之令先下，余则缓议。两臣虽未尽如意，也知圣意不可强争，各回衙署办事。',
      },
      {
        id: 'bond-joint-cautious',
        label: '留中待议',
        description: '以事体重大为由，将联章留中，命二臣各具条陈。',
        tone: 'cautious',
        effects: { regent: 2, unrest: 1 },
        weight: 0,
        outcome: '联章留中，两臣各回衙署。此事再无人提起，然朝野都看出二相自此生了嫌隙。',
      },
    ]
    return {
      occurrenceId: uniqueId('bond-event'),
      templateId: 'bond-joint',
      category,
      categoryLabel: '朝局',
      title: '新旧联章',
      subtitle: '两代辅臣，并立朝堂',
      narrative:
        `${legacy.name}历事两朝，鬓发皆白；${current.name}新擢大位，锐气正盛。二人平日政见多有龃龉，今日却联名上章，请行清田、裁冗、减役三事。\n\n` +
        '奏章写得极长，前半是旧臣的手笔，引据典章，字字稳当；后半是新臣的墨迹，条陈利害，锋芒毕露。两份笔迹接在一处，竟看不出谁主谁次。',
      source: 'special',
      chain: null,
      options,
      voices,
      omen: '平',
      date,
      fortune: rollFortune(),
      bond: true,
    }
  }

  const impeachment: EventOption[] = [
    {
      id: 'bond-impeach-elder',
      label: '老当益壮',
      description: `留${legacy.name}继续总领部务，令${current.name}出知外郡。`,
      tone: 'balanced',
      effects: { regent: 4, unrest: -1 },
      weight: 1,
      outcome: `诏留${legacy.name}，令${current.name}出知外郡。老臣感激涕零，处事愈发谨慎；新进之士却自此噤声，朝堂上少了几分锐气。`,
    },
    {
      id: 'bond-impeach-newcomer',
      label: '后来居上',
      description: `罢${legacy.name}，以${current.name}代其位，新政尽付新臣。`,
      tone: 'radical',
      effects: { regent: -4, treasury: 2, unrest: 1 },
      weight: 3,
      outcome: `诏罢${legacy.name}，以${current.name}代之。新政自此少了掣肘，度支亦见起色；老臣门下却愤愤不平，物议渐起。`,
    },
    {
      id: 'bond-impeach-both',
      label: '同朝为臣',
      description: '帝亲为调停，命二人同列朝班，各掌其事，不得再相攻讦。',
      tone: 'cautious',
      effects: { unrest: -3, regent: -1, treasury: -2 },
      weight: 0,
      outcome: `帝亲为调停，命二人同列朝班，各掌其事。一场风波暂息，只是安抚两家、各赐第宅，所费不赀。`,
    },
  ]

  return {
    occurrenceId: uniqueId('bond-event'),
    templateId: 'bond-impeach',
    category,
    categoryLabel: '朝局',
    title: '弹章互上',
    subtitle: '一殿之上，两代相攻',
    narrative:
      `${current.name}忽上弹章，劾${legacy.name}“倚老卖老、阻遏新政”；${legacy.name}亦不甘示弱，反劾${current.name}“结党邀名、动摇老成”。两章同日下到御前，朝堂为之分裂。\n\n` +
      '科道官各自站队，衙署里连递茶的小吏都放轻了脚步。御案上两份弹章并排摆着，墨迹未干，像两道不肯相让的刀痕。',
    source: 'special',
    chain: null,
    options: shuffle(impeachment).slice(0, 2),
    voices,
    omen: '平',
    date,
    fortune: rollFortune(),
    bond: true,
  }
}

function createChainEvent(session: Session, scheduled: ChainScheduleEntry): GameEvent | null {
  const chain = CHAINS.find((item) => item.id === scheduled.chainId)
  const step = chain?.steps[scheduled.stepIndex]
  if (!chain || !step) return null
  const date = createDate(session, session.quarter)
  const category = CHAIN_CATEGORIES[chain.id] ?? 'governance'
  return {
    occurrenceId: uniqueId('chain-event'),
    templateId: `${chain.id}-${scheduled.stepIndex}`,
    category,
    categoryLabel: CATEGORY_META[category].label,
    title: step.title,
    subtitle: `史鉴 · ${chain.inspiration}`,
    narrative: step.narrative,
    source: 'chain',
    chain: {
      id: chain.id,
      name: chain.name,
      inspiration: chain.inspiration,
      step: scheduled.stepIndex + 1,
      steps: chain.steps.length,
    },
    options: step.options.map((option) => ({ ...option, effects: { ...option.effects } })),
    voices: buildEventVoices(session, category),
    omen: '平',
    date,
    fortune: rollFortune(),
  }
}

export function createQuarterEvent(session: Session): GameEvent {
  if (session.inherited && !session.funeralSeen && session.currentYear === 1 && session.quarter === 1) {
    return createFuneralEvent(session)
  }
  const scheduled = findScheduledChain(session)
  if (scheduled) {
    const chainEvent = createChainEvent(session, scheduled)
    if (chainEvent) return chainEvent
  }
  if (session.bondYear !== null && !session.bondSeen && session.currentYear >= session.bondYear) {
    const bondEvent = createBondEvent(session)
    if (bondEvent) return bondEvent
  }
  if (shouldOfferSpecialEvent(session)) {
    const template = chooseSpecialTemplate(session)
    if (template) return createSpecialEvent(session, template)
  }
  return createDailyEvent(session)
}

const OFFICE_BASE_EFFECT: Record<OfficeId, ResourceDelta> = {
  chancellor: { treasury: 3, regent: 2 },
  marshal: { army: 3, treasury: -1 },
  censor: { unrest: -3, regent: -1 },
  steward: { treasury: 4, unrest: 1 },
}

/** 前朝留任旧臣历练既深，岁末实效增半。 */
const LEGACY_ABILITY_BOOST = 1.5

function amplifyYearEnd(effects: ResourceDelta): ResourceDelta {
  const out: ResourceDelta = {}
  RESOURCE_ORDER.forEach((key) => {
    const value = effects[key]
    if (value === undefined) return
    out[key] = value > 0
      ? Math.ceil(value * LEGACY_ABILITY_BOOST)
      : Math.floor(value * LEGACY_ABILITY_BOOST)
  })
  return out
}

function abilityYearEnd(advisor: Advisor): ResourceDelta {
  return advisor.legacy ? amplifyYearEnd(advisor.ability.yearEnd) : advisor.ability.yearEnd
}

/** 一位辅臣岁末带来的全部增减：官职常例 + 特殊能力（旧臣能力增半）。 */
export function getAdvisorYearEndEffect(advisor: Advisor): ResourceDelta {
  return advisor.office
    ? mergeDeltas(OFFICE_BASE_EFFECT[advisor.office], abilityYearEnd(advisor))
    : { ...abilityYearEnd(advisor) }
}

export function getOfficeEffect(office: OfficeId | null, advisor: Advisor | null): ResourceDelta | null {
  if (!office || !advisor) return null
  return mergeDeltas(OFFICE_BASE_EFFECT[office], abilityYearEnd(advisor))
}

export function officeLabel(office: OfficeId | null): string {
  return OFFICES.find((item) => item.id === office)?.office ?? '无'
}

function mergeDeltas(...deltas: (ResourceDelta | null | undefined)[]): ResourceDelta {
  const result: ResourceDelta = {}
  for (const delta of deltas) {
    if (!delta) continue
    RESOURCE_ORDER.forEach((key) => {
      const value = delta[key]
      if (!value) return
      result[key] = (result[key] ?? 0) + value
    })
  }
  return result
}

function applyResources(resources: Resources, delta: ResourceDelta): Resources {
  const after = cloneResources(resources)
  RESOURCE_ORDER.forEach((key) => {
    const value = delta[key]
    if (value !== undefined) after[key] = clamp(after[key] + value, 0, 100)
  })
  return after
}

export function detectEnding(resources: Resources): Session['pendingEnding'] {
  if (resources.treasury <= 0) return 'mutiny'
  if (resources.army <= 0) return 'conquest'
  if (resources.unrest >= 100) return 'rebellion'
  if (resources.regent >= 100) return 'abdication'
  return null
}

export function cancelFutureChainSteps(session: Session, chainId: string, stepIndex: number): void {
  session.chainSchedule = session.chainSchedule.map((entry) =>
    entry.chainId === chainId && entry.stepIndex > stepIndex
      ? { ...entry, canceled: true }
      : entry,
  )
}

/** 顺逆之数：六成顺、四成逆。顺则利于国势之变增，逆则反之。 */
function applyTwist(effects: ResourceDelta, twist: 'good' | 'bad'): ResourceDelta {
  const out: ResourceDelta = {}
  RESOURCE_ORDER.forEach((key) => {
    const value = effects[key]
    if (value === undefined) return
    const positiveIsGood = RESOURCE_META[key].danger === 'low'
    const goodForPlayer = value > 0 ? positiveIsGood : !positiveIsGood
    if (twist === 'good') {
      out[key] = goodForPlayer
        ? value > 0
          ? Math.ceil(value * 1.2)
          : Math.floor(value * 1.2)
        : value > 0
          ? Math.floor(value * 0.8)
          : Math.ceil(value * 0.8)
    } else {
      out[key] = goodForPlayer
        ? value > 0
          ? Math.floor(value * 0.8)
          : Math.ceil(value * 0.8)
        : value > 0
          ? Math.ceil(value * 1.2)
          : Math.floor(value * 1.2)
    }
  })
  return out
}

const TWIST_GOOD_TEXT = [
  '事后钩校，诸司奉行之力比廷议所料更足，许多周折未及成形便已按下。',
  '这一番调度，钱粮与人力都来得齐整，事情办得比预想要顺手。',
  '地方接到札子，少有推诿，该办的差事大多如期到了位。',
  '所费比预估省下不少，所用的人手也比预估精干。',
]

const TWIST_BAD_TEXT = [
  '只是钱粮调拨迟了一程，地方又各有盘算，该办的差事拖了不少时日。',
  '文书辗转数道，等落到州县手里，最好的时机已经过去。',
  '其间多少有些推诿与走样，所图十成，落地总差着一截。',
  '底下人各有心思，诏令虽行，到底打了些折扣。',
]

export function resolveEvent(session: Session, optionId: string | null): void {
  if (session.stage !== 'reign' || !session.currentEvent || session.outcome) return
  const event = session.currentEvent
  const skipped = optionId === null
  const option = skipped ? null : event.options.find((item) => item.id === optionId)
  if (!skipped && !option) return
  if (!skipped && session.actionPoints <= 0) return

  if (!skipped) {
    session.actionPoints = Math.max(0, session.actionPoints - 1)
  }

  const twist: OutcomeRecord['twist'] =
    !skipped && event.source === 'daily' ? (Math.random() < 0.6 ? 'good' : 'bad') : null
  const twistEffects = option
    ? twist
      ? applyTwist(option.effects, twist)
      : { ...option.effects }
    : {}
  const declineResult =
    option && event.decline
      ? amplifyHarm(twistEffects, declineFactor(session.generation))
      : null
  // 国丧不可久悬：搁置葬仪虽不耗行动点，却要承受朝野非议。
  const optionEffects = skipped
    ? event.funeral
      ? { regent: 2, unrest: 2 }
      : {}
    : (declineResult?.effects ?? twistEffects)

  const advisorEffect =
    session.quarter === 4 && session.advisors.length > 0
      ? mergeDeltas(...session.advisors.map((advisor) => getAdvisorYearEndEffect(advisor)))
      : null
  const totalEffect = mergeDeltas(
    optionEffects,
    event.fortune.boon?.effects,
    event.fortune.bane?.effects,
    advisorEffect,
  )
  const before = cloneResources(session.resources)
  session.resources = applyResources(session.resources, totalEffect)

  if (event.source === 'daily') {
    session.annual.total += 1
    if (skipped) {
      session.annual.skipped += 1
    } else if (option) {
      session.annual.score += option.weight
      session.categoryTally[event.category] += 1
    }
  }

  let chainContinues = false
  if (event.chain) {
    if (skipped) {
      cancelFutureChainSteps(session, event.chain.id, event.chain.step - 1)
    } else {
      chainContinues = session.chainSchedule.some(
        (entry) =>
          entry.chainId === event.chain?.id &&
          entry.stepIndex >= event.chain.step &&
          !entry.canceled,
      )
    }
  }

  const resourceEnding = detectEnding(session.resources)
  const eventEnding = option?.endsReign ?? null
  const pendingEnding = eventEnding ?? resourceEnding
  const endingCause: OutcomeRecord['endingCause'] = eventEnding
    ? 'event'
    : resourceEnding
      ? 'resources'
      : null
  const skipNarrative = event.funeral
    ? '御笔朱批：葬仪暂缓。山陵未启，梓宫未安，新朝的第一道诏令竟悬而未决。朝野侧目，宗室尤寒。'
    : event.bond
      ? '御笔朱批：两臣之隙，暂且按下不表。朝堂上看似无事，暗流却未肯就此停歇。'
      : event.source === 'chain'
        ? '御笔朱批：此事暂且搁置。史鉴之事本不系岁评，然天下大势，未必因一纸留中而停步。'
        : event.source === 'special'
          ? '御笔朱批：异闻暂且搁置。奇事一过便不再来，御案上只余一页空白。'
          : '御笔朱批：此事暂置不议。政务或有耽搁，至少此刻不必仓促落子。'
  const declineText = declineResult?.applied
    ? '\n\n承继以来，积弊未除，此策的害处较前朝更重。'
    : ''
  const narrative = skipped
    ? skipNarrative
    : `${option?.outcome ?? ''}${
        twist
          ? `\n\n${pickOne(twist === 'good' ? TWIST_GOOD_TEXT : TWIST_BAD_TEXT)}`
          : ''
      }${declineText}`

  session.outcome = {
    title: event.title,
    source: event.source,
    skipped,
    choiceLabel: skipped ? '搁置不议' : (option?.label ?? ''),
    choiceTone: option?.tone ?? null,
    choiceWeight: option?.weight ?? null,
    narrative,
    effect: optionEffects,
    fortune: event.fortune,
    advisorEffect,
    advisorName:
      session.advisors.length > 0
        ? session.advisors.map((advisor) => advisor.name).join('、')
        : null,
    totalEffect,
    before,
    after: cloneResources(session.resources),
    pendingEnding,
    endingCause,
    chainContinues,
    choiceIsAdvisor: option?.isAdvisor ?? false,
    twist,
    bond: event.bond ?? false,
    funeral: event.funeral ?? false,
    decline: declineResult?.applied ?? false,
  }
  session.pendingEnding = pendingEnding
  session.yearLog.push({
    title: event.title,
    categoryLabel: event.categoryLabel,
    source: event.source,
    decision: skipped ? '搁置' : (option?.label ?? ''),
    tone: option?.tone ?? null,
    weight: option?.weight ?? null,
    skipped,
    date: formatDateLabel(session, event.date),
    funeral: event.funeral ?? false,
    decline: declineResult?.applied ?? false,
  })
  session.chronicle.push({
    year: session.currentYear,
    quarter: session.quarter,
    dateLabel: formatDateLabel(session, event.date),
    title: event.title,
    categoryLabel: event.source === 'chain' ? `史鉴·${event.chain?.name ?? ''}` : event.categoryLabel,
    source: event.source,
    decision: skipped ? '搁置' : (option?.label ?? ''),
    summary: narrative,
    skipped,
  })
  session.reignPage = 'outcome'
  touch(session)
}

function determineAnnualMark(session: Session): AnnualMark {
  const { total, skipped, score } = session.annual
  if (total > 0 && skipped === total) return '庸'
  if (total === 0) return '平'
  // 政绩满六为顺，三至五为平，不足三为厄。
  if (score >= 6) return '顺'
  if (score < 3) return '厄'
  return '平'
}

function buildYearSummary(session: Session): YearSummary {
  const mark = determineAnnualMark(session)
  const meta = ANNUAL_MARK_META[mark]
  const deltas: ResourceDelta = {}
  RESOURCE_ORDER.forEach((key) => {
    const difference = session.resources[key] - session.yearStartResources[key]
    if (difference !== 0) deltas[key] = difference
  })
  const advisorEffect = session.outcome?.advisorEffect ?? null
  const advisorNote =
    advisorEffect && session.advisors.length > 0
      ? `${session.advisors
          .map(
            (advisor) =>
              `${advisor.name}${advisor.office ? `以${officeLabel(advisor.office)}之位` : ''}${
                advisor.legacy ? '（前朝旧臣，历练尤深）' : ''
              }`,
          )
          .join('、')}岁末考成，其效已计入国势。`
      : null
  const summary: YearSummary = {
    year: session.currentYear,
    mark,
    title: meta.label,
    remark: meta.remark,
    deltas,
    dailyTotal: session.annual.total,
    skipped: session.annual.skipped,
    score: session.annual.score,
    advisorNote,
    events: [...session.yearLog],
  }
  session.evaluations[mark] += 1
  session.chronicle.push({
    year: session.currentYear,
    quarter: 4,
    dateLabel: `${formatEraYear(session)}·岁末`,
    title: `岁评为「${mark}」`,
    categoryLabel: '史评',
    source: 'evaluation',
    decision: mark,
    summary: meta.remark,
    skipped: false,
  })
  return summary
}

export function proceedFromOutcome(session: Session): void {
  if (session.stage !== 'reign' || session.reignPage !== 'outcome') return
  if (session.pendingEnding) {
    finalizeEnding(session, session.pendingEnding)
    return
  }
  if (session.quarter < 4) {
    session.quarter += 1
    session.currentEvent = createQuarterEvent(session)
    session.outcome = null
    session.reignPage = 'event'
    touch(session)
    return
  }
  session.yearSummary = buildYearSummary(session)
  if (session.evaluations.庸 > session.reignYears / 2) {
    session.pendingEnding = 'mediocrity'
  }
  session.currentEvent = null
  session.outcome = null
  session.reignPage = 'yearEnd'
  touch(session)
}

export function proceedFromYearEnd(session: Session): void {
  if (session.stage !== 'reign' || session.reignPage !== 'yearEnd') return
  if (session.pendingEnding) {
    finalizeEnding(session, session.pendingEnding)
    return
  }
  if (session.currentYear >= session.reignYears) {
    finalizeEnding(session, 'natural')
    return
  }
  session.currentYear += 1
  session.quarter = 1
  session.actionPoints = ACTION_POINTS_PER_YEAR
  session.annual = { total: 0, skipped: 0, score: 0 }
  session.yearStartResources = cloneResources(session.resources)
  session.yearLog = []
  session.yearSummary = null
  session.outcome = null
  session.pendingEnding = null
  session.reignPage = 'event'
  session.currentEvent = createQuarterEvent(session)
  touch(session)
}

function selectEpithet(session: Session, kind: EndingKind): string {
  const fixed = ENDING_FIXED_EPITHET[kind]
  if (fixed) return fixed
  const good = session.evaluations.顺
  const bad = session.evaluations.厄
  const calm = session.evaluations.平
  const vulgar = session.evaluations.庸
  const { treasury, unrest, army, regent } = session.resources
  const stability = (treasury + army + (100 - unrest) + (100 - regent)) / 4

  if (kind === 'conquest') return session.currentYear <= 12 ? '殇' : '哀'
  if (kind === 'rebellion') return unrest >= 85 || bad > good ? '炀' : '厉'
  if (kind === 'mutiny') return treasury <= 2 || bad >= good ? '灵' : '厉'
  if (kind === 'abdication') return '恭'

  if (regent >= 80) return '幽'
  if (unrest >= 70 || (bad >= good + 2 && treasury < 40)) return '厉'
  if (army >= 88 && (session.categoryTally.military >= 3 || good >= 3)) return '武'
  if (treasury >= 65 && unrest <= 35) return '文'
  if (unrest <= 20 && treasury >= 45) return '仁'
  if (good > bad && stability >= 55) return '明'
  if (session.currentYear >= 30 && stability >= 50) return '景'
  if (vulgar >= 2 && calm >= vulgar) return '成'
  if (good >= bad && stability >= 60) return '宣'
  if (unrest <= 35) return '康'
  return '成'
}

function ordinalCount(value: number): string {
  return value === 0 ? '无' : toChineseNumber(value)
}

const ENDING_CHRONICLE: Record<EndingKind, string> = {
  natural: '及帝崩，山陵既成，史臣追述其政。',
  abdication: '及权臣逼宫，帝逊位于别宫，社稷易主。',
  mutiny: '及府库告罄，禁军叩阙，宫城陷于兵火。',
  rebellion: '及民变四起，义军破城，宗庙遂墟。',
  conquest: '及武备尽丧，强敌长驱，国祚由此而绝。',
  fengshan: '及登岱宗封禅，告成功于天地，礼成之日，群臣山呼。',
  ascension: '及丹成，帝白日飞升，宫人但见云气绕殿，玉座遂空。',
  retirement: '及帝挂冠而去，让国于贤，自隐于白云深处，朝廷不复见其车驾。',
  partition: '及诏裂土分封，诸镇各专其国，天子号令不出京畿，山河遂分。',
  martyr: '及城破，帝不去社稷，自焚于宗庙，烈焰照彻宫城。',
  mediocrity: '及庸年逾半，朝政尽废，史臣合卷，题曰庸政。',
}

const ENDING_VERDICTS: Partial<Record<EndingKind, string>> = {
  fengshan: '论曰：承累世之业，成封禅之礼，功名之盛，可谓极矣。',
  ascension: '论曰：弃万乘如敝屣，求长生而不返。其志可怪，其决可惊，后世莫能测也。',
  retirement: '论曰：知足而退，让国于贤，虽非人主之常，亦可谓达矣。',
  partition: '论曰：畏难而分土，避祸而裂国。宗庙虽存，天下已非一家之天下。',
  martyr: '论曰：国势已去，独守死节。社稷虽亡，其志可哀，其节可敬。',
  mediocrity:
    '论曰：非无岁月，而无政可纪；非无百官，而无一事可书。国祚之亡，不亡于兵火，而亡于日日搁笔。',
}

function buildHistorian(session: Session, kind: NonNullable<Session['pendingEnding']>): string {
  const { treasury, unrest, army, regent } = session.resources
  const good = session.evaluations.顺
  const bad = session.evaluations.厄
  const calm = session.evaluations.平
  const vulgar = session.evaluations.庸
  const years = session.currentYear
  const stability = (treasury + army + (100 - unrest) + (100 - regent)) / 4

  const treasuryLine =
    treasury >= 75
      ? '府库充盈，仓廪有余'
      : treasury >= 50
        ? '度支粗安，府库尚可支撑'
        : treasury >= 25
          ? '国用匮乏，常苦于调度'
          : '府库空虚，度支几不能给'
  const unrestLine =
    unrest <= 20
      ? '黎庶安堵，闾里无惊'
      : unrest <= 45
        ? '民间粗安，偶有怨咨'
        : unrest <= 70
          ? '赋役繁兴，民力渐疲'
          : '民怨沸腾，道路以目'
  const armyLine =
    army >= 80
      ? '武备修明，四夷有所惮'
      : army >= 55
        ? '军势尚可，边备未废'
        : army >= 30
          ? '兵甲不整，边患时闻'
          : '武备废弛，几无可用之兵'
  const regentLine =
    regent <= 30
      ? '乾纲独断，朝无掣肘'
      : regent <= 55
        ? '朝局粗安，相权未至大盛'
        : regent <= 75
          ? '权臣渐重，朝纲已有牵制'
          : '主威旁落，权臣之势已成'

  const endingLine = ENDING_CHRONICLE[kind]

  let verdict: string
  const fixedVerdict = ENDING_VERDICTS[kind]
  if (fixedVerdict) {
    verdict = fixedVerdict
  } else if (kind === 'conquest' || kind === 'rebellion' || kind === 'mutiny') {
    verdict =
      stability >= 55
        ? '论曰：非无善政，而积弊已深；非无良臣，而天命不佑。后之览者，可为太息。'
        : '论曰：政烦民困，武备不修，及其败也，非一日之故。'
  } else if (kind === 'abdication') {
    verdict = '论曰：柔仁有余，刚断不足。权柄既去，虽欲守文，亦不可得矣。'
  } else if (stability >= 70) {
    verdict = '论曰：有守成之资，亦有振衰之志，可谓一时之令主。'
  } else if (stability >= 55) {
    verdict = '论曰：中人之资，能守成而不能尽除积弊，可为平世之君。'
  } else if (stability >= 40) {
    verdict = '论曰：志大而略疏，政繁而民困，后世惜之。'
  } else {
    verdict = '论曰：承积弱之世，无拨乱之才，社稷之倾，非偶然也。'
  }

  const focusLabel =
    CATEGORY_KEYS.map((key) => ({ key, count: session.categoryTally[key] }))
      .sort((a, b) => b.count - a.count)
      .find((item) => item.count > 0)?.key ?? null
  const focusLine = focusLabel
    ? `其所措意者，多见于${CATEGORY_META[focusLabel].label}之事。`
    : '其在位也，罕有所决，朝政多委于有司。'

  return [
    `太史公曰：帝以「${session.eraName}」纪元，御极${toChineseNumber(years)}年。岁顺者${ordinalCount(good)}，岁厄者${ordinalCount(bad)}，平者${ordinalCount(calm)}，庸者${ordinalCount(vulgar)}。`,
    `观其国势，${treasuryLine}；${unrestLine}；${armyLine}；${regentLine}。${focusLine}`,
    endingLine,
    verdict,
  ].join('\n\n')
}

/** 承继国祚：新君初立，朝局动荡，四值各向危处偏移十。 */
export const INHERITANCE_TURMOIL: ResourceDelta = {
  treasury: -10,
  army: -10,
  unrest: 10,
  regent: 10,
}

export function makeInheritedResources(resources: Resources): Resources {
  const shifted = applyResources(resources, INHERITANCE_TURMOIL)
  return {
    regent: clamp(Math.round(shifted.regent), 5, 95),
    treasury: clamp(Math.round(shifted.treasury), 5, 95),
    unrest: clamp(Math.round(shifted.unrest), 5, 95),
    army: clamp(Math.round(shifted.army), 5, 95),
  }
}

export function finalizeEnding(session: Session, kind: NonNullable<Session['pendingEnding']>): void {
  if (session.stage === 'ending' || session.ending) return
  const epithetKey = selectEpithet(session, kind)
  const epithet = EPITHETS[epithetKey] ?? EPITHETS['成']
  if (!epithet) return
  const meta = ENDING_META[kind]
  const historian = buildHistorian(session, kind)
  const verdict = historian.split('\n\n').at(-1) ?? ''
  const years = session.currentYear
  session.ending = {
    kind,
    label: meta.label,
    headline: meta.headline,
    narrative: `${meta.narrative}\n\n${session.eraName}朝至此而终，享国${toChineseNumber(years)}年。`,
    epithet,
    historian,
    verdict,
    finalResources: cloneResources(session.resources),
    yearsPlayed: years,
    evaluations: { ...session.evaluations },
    completedAt: new Date().toISOString(),
  }
  session.stage = 'ending'
  session.pendingEnding = null
  session.currentEvent = null
  session.outcome = null
  touch(session)
}

export function buildArchiveEntry(session: Session): ArchiveEntry | null {
  if (!session.ending) return null
  return {
    id: uniqueId('archive'),
    sessionId: session.id,
    eraName: session.eraName,
    generation: session.generation,
    years: session.ending.yearsPlayed,
    endingLabel: session.ending.label,
    epithetChar: session.ending.epithet.char,
    epithetName: session.ending.epithet.name,
    resources: { ...session.ending.finalResources },
    evaluations: { ...session.ending.evaluations },
    historian: session.ending.historian,
    completedAt: session.ending.completedAt,
  }
}

export function makeBaseSessionResources(): Resources {
  return cloneResources(BASE_RESOURCES)
}

export function describeDelta(delta: ResourceDelta): Array<{ key: ResourceKey; value: number }> {
  const result: Array<{ key: ResourceKey; value: number }> = []
  RESOURCE_ORDER.forEach((key) => {
    const value = delta[key]
    if (value !== undefined && value !== 0) result.push({ key, value })
  })
  return result
}

export function toneLabel(tone: OptionTone | null): string {
  if (tone === 'radical') return '激进';
  if (tone === 'balanced') return '持中';
  if (tone === 'cautious') return '保守';
  return '未决'
}

export function touch(session: Session): void {
  session.updatedAt = new Date().toISOString()
}

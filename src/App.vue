<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import AchievementPanel from './components/AchievementPanel.vue'
import AdvisorSelection from './components/AdvisorSelection.vue'
import ArchivePanel from './components/ArchivePanel.vue'
import EndingScreen from './components/EndingScreen.vue'
import GameScreen from './components/GameScreen.vue'
import ModalShell from './components/ModalShell.vue'
import OfficeSelection from './components/OfficeSelection.vue'
import RulesPanel from './components/RulesPanel.vue'
import TitleScreen from './components/TitleScreen.vue'
import { ENDING_ORDER, canInheritEpithet, epithetKind } from './game/content'
import {
  beginReign,
  buildArchiveEntry,
  createSession,
  formatEraYear,
  makeBaseSessionResources,
  makeInheritedResources,
  proceedFromOutcome,
  proceedFromYearEnd,
  resolveEvent,
} from './game/engine'
import {
  appendArchive,
  clearLibrary,
  clearSession,
  loadAchievements,
  loadLibrary,
  loadSession,
  recordEndingAchievement,
  saveSession,
} from './game/storage'
import type { AchievementState, Advisor, LibraryState, OfficeId, Session } from './game/types'

const initialSession = loadSession()
const session = ref<Session | null>(initialSession)
const library = ref<LibraryState>(loadLibrary())
const achievements = ref<AchievementState>(loadAchievements())
const entered = ref(false)

if (initialSession?.stage === 'ending' && initialSession.ending && !initialSession.archived) {
  archiveEnded()
  saveSession(initialSession)
}
const rulesOpen = ref(false)
const archiveOpen = ref(false)
const achievementsOpen = ref(false)
const flashMessage = ref('')
const pendingEra = ref('')

interface ConfirmState {
  title: string
  subtitle: string
  message: string
  confirmLabel: string
  danger: boolean
  action: () => void
}

const confirmation = ref<ConfirmState | null>(null)
let flashTimer: ReturnType<typeof setTimeout> | undefined

const view = computed<'title' | 'advisors' | 'appoint' | 'reign' | 'ending'>(() => {
  if (!entered.value || !session.value) return 'title'
  if (session.value.stage === 'ending') return 'ending'
  if (session.value.stage === 'advisors') return 'advisors'
  if (session.value.stage === 'appoint') return 'appoint'
  return 'reign'
})

const hasSaved = computed(() => Boolean(session.value))
const savedEnded = computed(() => session.value?.stage === 'ending')
const archiveCount = computed(() => library.value.entries.length)
const achievementCount = computed(
  () => ENDING_ORDER.filter((kind) => Boolean(achievements.value.endings[kind])).length,
)
const achievementTotal = computed(() => ENDING_ORDER.length)

const savedSummary = computed(() => {
  const current = session.value
  if (!current) return ''
  return `${current.eraName}朝 · 第${current.generation}世`
})

const savedDetail = computed(() => {
  const current = session.value
  if (!current) return ''
  if (current.stage === 'ending' && current.ending) {
    return `${current.ending.label} · 享国${current.ending.yearsPlayed}年 · ${current.ending.epithet.name}`
  }
  if (current.stage === 'advisors') return '新朝初立 · 待择辅臣'
  if (current.stage === 'appoint') {
    return `${current.advisors.map((advisor) => advisor.name).join('、') || '辅臣'} · 待授官职`
  }
  const season = ['春', '夏', '秋', '冬'][current.quarter - 1] ?? '春'
  return `${formatEraYear(current)} · ${season}季朝议 · 在位第${current.currentYear}/${current.reignYears}年`
})

function flash(message: string) {
  flashMessage.value = message
  if (flashTimer) clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    flashMessage.value = ''
  }, 2600)
}

function archiveEnded() {
  const current = session.value
  if (!current?.ending || current.archived) return
  const entry = buildArchiveEntry(current)
  if (!entry) return
  library.value = appendArchive(entry)
  achievements.value = recordEndingAchievement({
    kind: current.ending.kind,
    eraName: current.eraName,
    epithet: current.ending.epithet.name,
    years: current.ending.yearsPlayed,
    at: current.ending.completedAt,
  })
  current.archived = true
}

function commit() {
  archiveEnded()
  if (session.value) saveSession(session.value)
}

function resume() {
  if (!session.value) return
  entered.value = true
  commit()
}

function suspend() {
  commit()
  entered.value = false
  flash('卷页已收，可随时续读')
}

function launchNew(era: string, inherited: boolean) {
  const previous = session.value
  archiveEnded()
  const inheritedFrom =
    inherited && previous?.ending ? `${previous.eraName}朝` : null
  const chiefAdvisor = previous?.advisors[0]
  const inheritedAdvisors: Advisor[] =
    inherited && previous?.ending && chiefAdvisor
      ? [{ ...chiefAdvisor, legacy: true }]
      : []
  session.value = createSession({
    eraName: era,
    generation: inherited && previous ? previous.generation + 1 : 1,
    inherited,
    inheritedFrom,
    inheritedAdvisors,
    resources:
      inherited && previous?.ending
        ? makeInheritedResources(previous.ending.finalResources)
        : makeBaseSessionResources(),
  })
  entered.value = true
  pendingEra.value = ''
  archiveOpen.value = false
  achievementsOpen.value = false
  rulesOpen.value = false
  commit()
  flash(inherited ? '新朝已立，旧史犹存' : '受命于天，新朝伊始')
}

function handleStart(era: string) {
  const current = session.value
  if (current && current.stage !== 'ending') {
    pendingEra.value = era
    confirmation.value = {
      title: '另开新朝',
      subtitle: '旧朝未终',
      message: `当前「${current.eraName}朝」尚在延续。若此刻另开新朝，旧卷将被覆盖，且不会收入历代本纪。`,
      confirmLabel: '覆盖旧卷，另开新朝',
      danger: true,
      action: () => launchNew(pendingEra.value, false),
    }
    return
  }
  launchNew(era, false)
}

function chooseAdvisors(chosen: Advisor[]) {
  const current = session.value
  if (!current) return
  const known = new Set(current.advisors.map((advisor) => advisor.id))
  current.advisors = [
    ...current.advisors,
    ...chosen.filter((advisor) => !known.has(advisor.id)),
  ]
  if (current.advisors.length === 0) return
  if (current.advisors.every((advisor) => advisor.office)) {
    beginReign(current)
  } else {
    current.stage = 'appoint'
  }
  commit()
}

function appointOffices(picks: Record<string, OfficeId>) {
  const current = session.value
  if (!current) return
  current.advisors = current.advisors.map((advisor) =>
    picks[advisor.id] ? { ...advisor, office: picks[advisor.id] ?? advisor.office } : advisor,
  )
  beginReign(current)
  commit()
  flash('辅臣既任，四时朝议自此始')
}

function skipAdvisor() {
  if (!session.value) return
  session.value.advisors = []
  beginReign(session.value)
  commit()
  flash('乾纲独断，四时朝议自此始')
}

function backToAdvisors() {
  if (!session.value) return
  session.value.advisors = session.value.advisors.filter((advisor) => advisor.legacy)
  session.value.stage = 'advisors'
  commit()
}

function handleChoose(optionId: string) {
  if (!session.value) return
  resolveEvent(session.value, optionId)
  commit()
}

function handleSkip() {
  if (!session.value) return
  resolveEvent(session.value, null)
  commit()
}

function handleNextPage() {
  if (!session.value) return
  if (session.value.reignPage === 'outcome') {
    proceedFromOutcome(session.value)
  } else if (session.value.reignPage === 'yearEnd') {
    proceedFromYearEnd(session.value)
  }
  commit()
}

function handleRestart() {
  archiveEnded()
  clearSession()
  session.value = null
  entered.value = false
  archiveOpen.value = false
  achievementsOpen.value = false
  rulesOpen.value = false
  flash('旧卷已藏，可另立新朝')
}

function handleInherit(era: string) {
  const current = session.value
  if (current?.ending && !canInheritEpithet(current.ending.epithet.char)) {
    flash(
      epithetKind(current.ending.epithet.char) === 'bad'
        ? '恶谥在身，国祚已绝，不可传位'
        : '平谥难承宗庙，国祚不可再传',
    )
    return
  }
  launchNew(era, true)
}

function requestClearLibrary() {
  if (!archiveCount.value) return
  archiveOpen.value = false
  confirmation.value = {
    title: '焚毁藏卷',
    subtitle: '不可复得',
    message: `历代本纪中共有 ${archiveCount.value} 卷。焚毁后，史官评语与终局国录将全部自本地移除，无法恢复。`,
    confirmLabel: '确认焚毁',
    danger: true,
    action: () => {
      library.value = clearLibrary()
      archiveOpen.value = false
      flash('藏卷已焚，唯余空匮')
    },
  }
}

function runConfirmation() {
  const action = confirmation.value?.action
  confirmation.value = null
  action?.()
}

onBeforeUnmount(() => {
  if (flashTimer) clearTimeout(flashTimer)
})
</script>

<template>
  <TitleScreen
    v-if="view === 'title'"
    :has-saved="hasSaved"
    :saved-summary="savedSummary"
    :saved-detail="savedDetail"
    :saved-ended="savedEnded"
    :archive-count="archiveCount"
    :achievement-count="achievementCount"
    :achievement-total="achievementTotal"
    @start="handleStart"
    @resume="resume"
    @archive="archiveOpen = true"
    @achievements="achievementsOpen = true"
    @rules="rulesOpen = true"
  />

  <AdvisorSelection
    v-else-if="view === 'advisors' && session"
    :session="session"
    @choose="chooseAdvisors"
    @skip="skipAdvisor"
    @suspend="suspend"
    @rules="rulesOpen = true"
  />

  <OfficeSelection
    v-else-if="view === 'appoint' && session"
    :session="session"
    @appoint="appointOffices"
    @skip="skipAdvisor"
    @back="backToAdvisors"
    @suspend="suspend"
    @rules="rulesOpen = true"
  />

  <GameScreen
    v-else-if="view === 'reign' && session"
    :session="session"
    @choose="handleChoose"
    @skip="handleSkip"
    @next="handleNextPage"
    @suspend="suspend"
    @rules="rulesOpen = true"
  />

  <EndingScreen
    v-else-if="view === 'ending' && session"
    :session="session"
    @restart="handleRestart"
    @inherit="handleInherit"
    @archive="archiveOpen = true"
    @achievements="achievementsOpen = true"
    @rules="rulesOpen = true"
  />

  <ArchivePanel
    v-if="archiveOpen"
    :library="library"
    @close="archiveOpen = false"
    @clear="requestClearLibrary"
  />

  <AchievementPanel
    v-if="achievementsOpen"
    :achievements="achievements"
    @close="achievementsOpen = false"
  />

  <RulesPanel v-if="rulesOpen" @close="rulesOpen = false" />

  <ModalShell
    v-if="confirmation"
    :title="confirmation.title"
    :subtitle="confirmation.subtitle"
    @close="confirmation = null"
  >
    <p class="confirm-copy">{{ confirmation.message }}</p>
    <template #footer>
      <button class="btn btn--ghost" type="button" @click="confirmation = null">暂不</button>
      <button
        class="btn"
        :class="confirmation.danger ? 'confirm-danger' : 'btn--primary'"
        type="button"
        @click="runConfirmation"
      >
        {{ confirmation.confirmLabel }}
      </button>
    </template>
  </ModalShell>

  <Transition name="page-turn">
    <div v-if="flashMessage" class="toast" role="status">
      <span class="toast__mark">录</span>
      {{ flashMessage }}
    </div>
  </Transition>
</template>

<style scoped>
.confirm-copy {
  color: var(--ink-soft);
  font-size: 0.84rem;
  line-height: 1.9;
}

.confirm-danger {
  color: var(--paper-light);
  background: var(--cinnabar);
  border-color: var(--cinnabar);
}

.confirm-danger:hover {
  background: var(--cinnabar-deep);
  border-color: var(--cinnabar-deep);
}

.toast {
  position: fixed;
  z-index: 100;
  right: 1.2rem;
  bottom: calc(1.2rem + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem 0.55rem 0.55rem;
  color: var(--paper-light);
  background: rgba(36, 30, 24, 0.95);
  border: 1px solid rgba(196, 166, 108, 0.35);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.36);
  font-family: var(--font-kai);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}

.toast__mark {
  display: grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-size: 0.62rem;
}

@media (max-width: 640px) {
  .toast {
    right: 0.8rem;
    bottom: calc(0.8rem + env(safe-area-inset-bottom));
    left: 0.8rem;
    justify-content: center;
  }
}
</style>

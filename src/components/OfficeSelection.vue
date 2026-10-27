<script setup lang="ts">
import { computed, ref } from 'vue'
import DeltaList from './DeltaList.vue'
import { OFFICES } from '@/game/content'
import { getOfficeEffect } from '@/game/engine'
import type { Advisor, OfficeId, Session } from '@/game/types'

const props = defineProps<{ session: Session }>()

const emit = defineEmits<{
  appoint: [picks: Record<string, OfficeId>]
  skip: []
  back: []
  suspend: []
  rules: []
}>()

const pending = computed(() => props.session.advisors.filter((advisor) => !advisor.office))
const picks = ref<Record<string, OfficeId>>({})
const activeIndex = ref(0)
const activeAdvisor = computed(
  () => pending.value[Math.min(activeIndex.value, pending.value.length - 1)] ?? null,
)
const allPicked = computed(
  () => pending.value.length > 0 && pending.value.every((advisor) => Boolean(picks.value[advisor.id])),
)

function officeMeta(id: OfficeId | null | undefined) {
  return OFFICES.find((office) => office.id === id) ?? null
}

/** 该官职已被谁占用（含前朝留任旧臣与另一位待授之臣）。 */
function officeOwner(officeId: OfficeId): Advisor | null {
  const active = activeAdvisor.value
  const pickedId = Object.entries(picks.value).find(([, id]) => id === officeId)?.[0]
  if (pickedId && pickedId !== active?.id) {
    return pending.value.find((advisor) => advisor.id === pickedId) ?? null
  }
  if (pickedId === active?.id) return null
  return props.session.advisors.find((advisor) => advisor.office === officeId) ?? null
}

function activeOffice(): OfficeId | null {
  const active = activeAdvisor.value
  return active ? (picks.value[active.id] ?? null) : null
}

function effectFor(officeId: OfficeId) {
  return getOfficeEffect(officeId, activeAdvisor.value)
}

function selectOffice(officeId: OfficeId) {
  const active = activeAdvisor.value
  if (!active || officeOwner(officeId)) return
  picks.value = { ...picks.value, [active.id]: officeId }
  const next = pending.value.findIndex((advisor) => !picks.value[advisor.id])
  if (next >= 0) activeIndex.value = next
}

function confirmNote(): string {
  return pending.value
    .map((advisor) => {
      const office = officeMeta(picks.value[advisor.id])
      return office ? `${advisor.name}为${office.rank}${office.office}` : ''
    })
    .filter(Boolean)
    .join('，')
}

function confirm() {
  if (allPicked.value) emit('appoint', { ...picks.value })
}
</script>

<template>
  <div class="setup-screen">
    <header class="setup-header">
      <div class="setup-header__brand">
        <span class="seal-mark">山</span>
        <div>
          <p class="eyebrow">{{ session.eraName }} · 第{{ session.generation }}世</p>
          <h1>授职</h1>
        </div>
      </div>
      <div class="setup-header__actions">
        <button class="btn btn--quiet" type="button" @click="emit('rules')">要略</button>
        <button class="btn btn--quiet" type="button" @click="emit('suspend')">暂离</button>
      </div>
    </header>

    <main class="setup-main">
      <section class="office-lead">
        <div>
          <p class="eyebrow">辅臣既择 · 各定其位</p>
          <h2>两相辅弼，各授其职</h2>
          <p>
            四职各有所长，也各有所患。每位辅臣各授一职，官职决定其岁末如何改变国势，
            特殊能力则另加一重增减；同朝之职不可重复。
          </p>
        </div>
        <div class="appoint-tabs" aria-label="待授职辅臣">
          <button
            v-for="(advisor, index) in pending"
            :key="advisor.id"
            class="appoint-tab"
            :class="{ 'appoint-tab--active': index === activeIndex }"
            type="button"
            @click="activeIndex = index"
          >
            <span class="appoint-tab__avatar">{{ advisor.avatar }}</span>
            <span class="appoint-tab__body">
              <strong>{{ advisor.name }}</strong>
              <em>{{ advisor.ability.name }}</em>
            </span>
            <span class="appoint-tab__office">
              {{ officeMeta(picks[advisor.id])?.office ?? '待授' }}
            </span>
          </button>
        </div>
      </section>

      <section v-if="activeAdvisor" class="active-advisor">
        <div class="chosen-advisor">
          <span class="chosen-advisor__avatar">{{ activeAdvisor.avatar }}</span>
          <div>
            <p class="chosen-advisor__label">待授之臣</p>
            <h3>{{ activeAdvisor.name }}</h3>
            <p>{{ activeAdvisor.courtesy }} · {{ activeAdvisor.origin }}</p>
            <span>{{ activeAdvisor.ability.name }} · {{ activeAdvisor.ability.description }}</span>
          </div>
        </div>
        <p class="active-advisor__hint">
          {{
            activeOffice()
              ? `已择${officeMeta(activeOffice())?.office ?? ''}，可在下方改授他职。`
              : '请为此臣择一官职。'
          }}
        </p>
      </section>

      <section class="office-grid" aria-label="官职选择">
        <button
          v-for="office in OFFICES"
          :key="office.id"
          class="office-card"
          :class="{
            'office-card--selected': activeOffice() === office.id,
            'office-card--taken': Boolean(officeOwner(office.id)),
          }"
          type="button"
          :disabled="Boolean(officeOwner(office.id))"
          :aria-pressed="activeOffice() === office.id"
          @click="selectOffice(office.id)"
        >
          <div class="office-card__head">
            <span class="office-card__rank">{{ office.rank }}</span>
            <span class="office-card__seal">{{ office.office.slice(0, 1) }}</span>
          </div>
          <h3>{{ office.office }}</h3>
          <p class="office-card__title">{{ office.title }}</p>
          <p class="office-card__summary">{{ office.summary }}</p>
          <div class="office-card__effect">
            <span class="office-card__effect-label">{{ activeAdvisor?.name }}岁末实效</span>
            <DeltaList :delta="effectFor(office.id) || {}" size="sm" empty-label="无增益" />
          </div>
          <p class="office-card__detail">{{ office.detail }}</p>
          <p class="office-card__risk">{{ office.risk }}</p>
          <p v-if="officeOwner(office.id)" class="office-card__taken">
            {{ officeOwner(office.id)?.name }}已领此职
          </p>
          <span class="office-card__check">
            {{
              officeOwner(office.id)
                ? '已授他人'
                : activeOffice() === office.id
                  ? '已择'
                  : '择此职'
            }}
          </span>
        </button>
      </section>

      <section class="office-actions">
        <button class="btn btn--primary" type="button" :disabled="!allPicked" @click="confirm">
          授职开朝
          <span aria-hidden="true">→</span>
        </button>
        <button class="btn btn--ghost" type="button" @click="emit('skip')">尽罢辅臣，独揽朝纲</button>
        <button class="btn btn--quiet" type="button" @click="emit('back')">返回重择</button>
      </section>

      <p v-if="allPicked" class="office-confirm-note">
        将拜{{ confirmNote() }}，岁末各依其才具增益国势。
      </p>
      <p class="setup-footnote">
        辅臣岁末依官职与特殊能力各结算一次，前朝旧臣实效更著；同朝两臣各有其位，不可兼领。
      </p>
    </main>
  </div>
</template>

<style scoped>
.setup-screen {
  min-height: 100svh;
  color: var(--paper-light);
  background:
    radial-gradient(circle at 18% 8%, rgba(158, 48, 39, 0.1), transparent 24rem),
    radial-gradient(circle at 84% 78%, rgba(183, 146, 79, 0.1), transparent 28rem),
    linear-gradient(150deg, #211b15, #17130f 55%, #201811);
}

.setup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100% - 3rem, 1180px);
  margin: 0 auto;
  padding: 1.35rem 0;
  border-bottom: 1px solid rgba(238, 225, 196, 0.11);
}

.setup-header__brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.setup-header__brand .seal-mark {
  width: 2rem;
  height: 2rem;
  font-size: 0.82rem;
}

.setup-header__brand .eyebrow {
  color: rgba(196, 166, 108, 0.65);
  font-size: 0.65rem;
}

.setup-header__brand h1 {
  margin-top: 0.05rem;
  font-family: var(--font-kai);
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.3em;
}

.setup-header__actions {
  display: flex;
  gap: 0.2rem;
}

.setup-header__actions .btn--quiet {
  color: rgba(238, 225, 196, 0.58);
}

.setup-main {
  width: min(100% - 3rem, 1180px);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) 0 4rem;
}

.office-lead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  animation: fade-up 0.6s var(--page-turn-ease) both;
}

.office-lead .eyebrow {
  color: rgba(196, 166, 108, 0.7);
}

.office-lead h2 {
  margin-top: 0.35rem;
  font-family: var(--font-kai);
  font-size: clamp(1.7rem, 4vw, 2.6rem);
  font-weight: 400;
  letter-spacing: 0.08em;
}

.office-lead > div:first-child > p:not(.eyebrow) {
  max-width: 38rem;
  margin-top: 0.85rem;
  color: rgba(238, 225, 196, 0.54);
  font-size: 0.9rem;
  line-height: 1.9;
}

.appoint-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 0 0 auto;
  min-width: 16rem;
}

.appoint-tab {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  color: rgba(238, 225, 196, 0.7);
  text-align: left;
  background: rgba(238, 225, 196, 0.04);
  border: 1px solid rgba(238, 225, 196, 0.12);
  transition:
    border-color 0.25s ease,
    background 0.25s ease;
}

.appoint-tab:hover {
  border-color: rgba(196, 166, 108, 0.45);
}

.appoint-tab--active {
  color: var(--paper-light);
  background: rgba(196, 166, 108, 0.1);
  border-color: rgba(196, 166, 108, 0.55);
}

.appoint-tab__avatar {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--ink);
  background: var(--paper-warm);
  font-family: var(--font-kai);
  font-size: 0.95rem;
}

.appoint-tab__body {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
}

.appoint-tab__body strong {
  font-family: var(--font-kai);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.appoint-tab__body em {
  color: rgba(196, 166, 108, 0.72);
  font-size: 0.63rem;
  font-style: normal;
}

.appoint-tab__office {
  margin-left: auto;
  color: rgba(238, 225, 196, 0.5);
  font-family: var(--font-kai);
  font-size: 0.66rem;
  white-space: nowrap;
}

.appoint-tab--active .appoint-tab__office {
  color: var(--gold);
}

.active-advisor {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  margin-top: 1.4rem;
}

.active-advisor__hint {
  color: rgba(196, 166, 108, 0.66);
  font-family: var(--font-kai);
  font-size: 0.72rem;
}

.chosen-advisor {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 0 0 auto;
  padding: 0.8rem 1rem;
  background: rgba(238, 225, 196, 0.055);
  border: 1px solid rgba(238, 225, 196, 0.13);
}

.chosen-advisor__avatar {
  display: grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  color: var(--ink);
  background: var(--paper-warm);
  font-family: var(--font-kai);
  font-size: 1.35rem;
}

.chosen-advisor__label {
  color: rgba(196, 166, 108, 0.6) !important;
  font-size: 0.62rem !important;
  letter-spacing: 0.16em;
}

.chosen-advisor h3 {
  font-family: var(--font-kai);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.08em;
}

.chosen-advisor p {
  color: rgba(238, 225, 196, 0.5);
  font-size: 0.7rem;
  line-height: 1.55;
}

.chosen-advisor span:not(.chosen-advisor__avatar) {
  color: rgba(196, 166, 108, 0.7);
  font-family: var(--font-kai);
  font-size: 0.67rem;
}

.office-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: clamp(1.8rem, 4vw, 3rem);
}

.office-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 1.25rem 1.1rem 3rem;
  color: var(--ink);
  text-align: left;
  background-color: var(--paper);
  background-image:
    radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.45), transparent 32%),
    repeating-linear-gradient(
      91deg,
      rgba(97, 73, 43, 0.028) 0,
      rgba(97, 73, 43, 0.028) 1px,
      transparent 1px,
      transparent 5px
    );
  border: 1px solid var(--paper-edge);
  transition:
    transform 0.3s var(--page-turn-ease),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  animation: fade-up 0.55s var(--page-turn-ease) both;
}

.office-card:nth-child(2) {
  animation-delay: 0.04s;
}

.office-card:nth-child(3) {
  animation-delay: 0.08s;
}

.office-card:nth-child(4) {
  animation-delay: 0.12s;
}

.office-card::before {
  position: absolute;
  inset: 0.4rem;
  pointer-events: none;
  content: '';
  border: 1px solid rgba(122, 91, 48, 0.1);
}

.office-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold);
}

.office-card--selected {
  border-color: var(--cinnabar);
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.3),
    inset 0 0 0 2px var(--cinnabar);
  transform: translateY(-4px);
}

.office-card--taken {
  cursor: not-allowed;
  opacity: 0.55;
}

.office-card--taken:hover {
  transform: none;
  border-color: var(--paper-edge);
}

.office-card__taken {
  margin-top: 0.5rem;
  color: var(--ink-faint);
  font-size: 0.64rem;
}

.office-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.office-card__rank {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
}

.office-card__seal {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.85rem;
}

.office-card h3 {
  margin-top: 1rem;
  font-family: var(--font-kai);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.office-card__title {
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.74rem;
  letter-spacing: 0.1em;
}

.office-card__summary {
  margin-top: 0.85rem;
  padding-top: 0.7rem;
  color: var(--ink);
  border-top: 1px solid rgba(79, 67, 53, 0.13);
  font-family: var(--font-kai);
  font-size: 0.8rem;
  line-height: 1.7;
}

.office-card__effect {
  margin-top: 0.65rem;
  padding: 0.55rem 0.6rem;
  background: rgba(255, 247, 229, 0.36);
  border: 1px solid rgba(79, 67, 53, 0.11);
}

.office-card__effect-label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
}

.office-card__detail {
  margin-top: 0.75rem;
  color: var(--ink-soft);
  font-size: 0.73rem;
  line-height: 1.75;
}

.office-card__risk {
  margin-top: 0.5rem;
  color: var(--cinnabar);
  font-size: 0.66rem;
  line-height: 1.65;
}

.office-card__check {
  position: absolute;
  right: 1rem;
  bottom: 0.9rem;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

.office-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  margin-top: 2rem;
}

.office-actions .btn--primary {
  min-width: 10rem;
}

.office-actions .btn--ghost {
  --btn-color: rgba(238, 225, 196, 0.58);
  --btn-border: rgba(238, 225, 196, 0.15);
}

.office-actions .btn--quiet {
  color: rgba(238, 225, 196, 0.4);
}

.office-confirm-note {
  margin-top: 1rem;
  color: rgba(196, 166, 108, 0.75);
  font-family: var(--font-kai);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

.setup-footnote {
  max-width: 46rem;
  margin-top: 0.8rem;
  color: rgba(238, 225, 196, 0.34);
  font-size: 0.72rem;
  line-height: 1.75;
}

@media (max-width: 1020px) {
  .office-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .setup-header,
  .setup-main {
    width: calc(100% - 2rem);
  }

  .setup-header {
    padding: 1rem 0;
  }

  .setup-main {
    padding-top: 1.7rem;
  }

  .office-lead {
    flex-direction: column;
    align-items: stretch;
    gap: 1.3rem;
  }

  .office-lead h2 {
    font-size: 1.65rem;
  }

  .chosen-advisor {
    align-self: flex-start;
  }

  .office-grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .office-card {
    padding: 1.1rem 1rem 2.8rem;
  }

  .office-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .office-actions .btn {
    width: 100%;
  }
}
</style>

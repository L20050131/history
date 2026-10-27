<script setup lang="ts">
import { computed, ref } from 'vue'
import ResourceGauge from './ResourceGauge.vue'
import { OFFICES, RESOURCE_ORDER } from '@/game/content'
import type { Advisor, Session } from '@/game/types'

const props = defineProps<{ session: Session }>()

const emit = defineEmits<{
  choose: [advisors: Advisor[]]
  skip: []
  suspend: []
  rules: []
}>()

const selectedIds = ref<string[]>([])
const carried = computed(() => props.session.advisors.filter((advisor) => advisor.legacy))
const slots = computed(() => Math.max(0, 2 - props.session.advisors.length))
const selected = computed(() =>
  props.session.advisorCandidates.filter((advisor) => selectedIds.value.includes(advisor.id)),
)
const canConfirm = computed(() => selected.value.length > 0 || carried.value.length > 0)

const leadTitle = computed(() => {
  if (carried.value.length > 0) return '旧臣留任，再择一相'
  return '三人入对，择二为辅'
})

function officeName(advisor: Advisor): string {
  return OFFICES.find((office) => office.id === advisor.ability.officeHint)?.office ?? ''
}

/** 留任旧臣仍领前朝之职，卡片直书现职。 */
function currentOfficeName(advisor: Advisor): string {
  return OFFICES.find((office) => office.id === advisor.office)?.office ?? officeName(advisor)
}

function isSelected(advisor: Advisor): boolean {
  return selectedIds.value.includes(advisor.id)
}

function select(advisor: Advisor) {
  if (isSelected(advisor)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== advisor.id)
    return
  }
  if (selectedIds.value.length >= slots.value) return
  selectedIds.value = [...selectedIds.value, advisor.id]
}

function confirm() {
  if (canConfirm.value) emit('choose', selected.value)
}
</script>

<template>
  <div class="setup-screen">
    <header class="setup-header">
      <div class="setup-header__brand">
        <span class="seal-mark">山</span>
        <div>
          <p class="eyebrow">{{ session.eraName }} · 第{{ session.generation }}世</p>
          <h1>择辅</h1>
        </div>
      </div>
      <div class="setup-header__actions">
        <button class="btn btn--quiet" type="button" @click="emit('rules')">要略</button>
        <button class="btn btn--quiet" type="button" @click="emit('suspend')">暂离</button>
      </div>
    </header>

    <main class="setup-main">
      <section class="setup-lead">
        <div>
          <p class="eyebrow">新朝初立 · 求贤</p>
          <h2>{{ leadTitle }}</h2>
          <p>
            贤才各有短长，亦各有其位。今设辅臣两位，可择一人或两人入朝，再各授官职；
            若愿乾纲独断，也可尽罢辅臣。
          </p>
        </div>
        <div class="setup-resources" aria-label="当前国势">
          <ResourceGauge
            v-for="key in RESOURCE_ORDER"
            :key="key"
            :resource-key="key"
            :value="session.resources[key]"
            compact
          />
        </div>
      </section>

      <div v-if="session.inherited" class="inheritance-note">
        <span class="inheritance-note__seal">承</span>
        <p>
          承自{{ session.inheritedFrom || '先朝' }}。先帝所遗国势已录入新朝，然新君初立、朝局动荡：
          府库、军势各减十，民变、权臣各增十。
        </p>
      </div>

      <section v-if="carried.length" class="carried-block" aria-label="前朝留任辅臣">
        <p class="eyebrow">前朝旧臣 · 留任</p>
        <div class="carried-grid">
          <div v-for="advisor in carried" :key="advisor.id" class="carried-card">
            <span class="carried-card__avatar">{{ advisor.avatar }}</span>
            <div class="carried-card__body">
              <div class="carried-card__head">
                <h3>{{ advisor.name }}</h3>
                <span class="carried-card__badge">前朝旧臣</span>
              </div>
              <p>{{ advisor.courtesy }} · {{ advisor.origin }}</p>
              <p class="carried-card__ability">
                {{ advisor.ability.name }} · 仍领{{ currentOfficeName(advisor) }}
              </p>
              <p class="carried-card__note">
                老臣历练既深，岁末实效较常人为著；若新臣同朝，两代之间或有交章之事。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="candidate-grid" aria-label="辅臣人选">
        <button
          v-for="(advisor, index) in session.advisorCandidates"
          :key="advisor.id"
          class="candidate-card"
          :class="{ 'candidate-card--selected': isSelected(advisor) }"
          type="button"
          :aria-pressed="isSelected(advisor)"
          :disabled="slots === 0"
          @click="select(advisor)"
        >
          <span class="candidate-card__number">第{{ ['一', '二', '三'][index] }}人</span>
          <div class="candidate-card__head">
            <span class="candidate-card__avatar">{{ advisor.avatar }}</span>
            <div class="candidate-card__identity">
              <h3>{{ advisor.name }}</h3>
              <p>{{ advisor.courtesy }} · {{ advisor.origin }}</p>
            </div>
          </div>

          <div class="candidate-card__ability">
            <span class="candidate-card__ability-seal">{{ advisor.ability.seal }}</span>
            <div>
              <strong>特殊能力 · {{ advisor.ability.name }}</strong>
              <p>{{ advisor.ability.description }}</p>
            </div>
          </div>

          <blockquote class="candidate-card__quote">“{{ advisor.trait }}”</blockquote>

          <div class="candidate-card__foot">
            <span>宜任 · {{ officeName(advisor) }}</span>
            <span class="candidate-card__pick">
              {{ isSelected(advisor) ? '已选中' : '选此人' }}
            </span>
          </div>
        </button>
      </section>

      <section class="setup-actions">
        <button class="btn btn--primary" type="button" :disabled="!canConfirm" @click="confirm">
          {{
            selected.length === 2
              ? '召见二人'
              : selected.length === 1
                ? '召见此人'
                : '仍用旧臣'
          }}
          <span aria-hidden="true">→</span>
        </button>
        <button class="btn btn--ghost" type="button" @click="emit('skip')">尽罢辅臣，独揽朝纲</button>
      </section>

      <p class="setup-footnote">
        每朝设辅臣两位，各授一职。辅臣既在岁末依官职增益国势，又会在相应朝议中进言；
        前朝留任的旧臣，岁末实效更著。两代并立时，一朝之内或有一场联章、弹章之事。
      </p>
    </main>
  </div>
</template>

<style scoped>
.setup-screen {
  min-height: 100svh;
  color: var(--paper-light);
  background:
    radial-gradient(circle at 78% 6%, rgba(181, 129, 74, 0.13), transparent 26rem),
    radial-gradient(circle at 12% 90%, rgba(68, 82, 67, 0.14), transparent 28rem),
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

.setup-header__actions .btn--quiet:hover {
  color: var(--paper-light);
}

.setup-main {
  width: min(100% - 3rem, 1180px);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4.5rem) 0 4rem;
}

.setup-lead {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(22rem, 0.85fr);
  gap: 2.5rem;
  align-items: end;
  animation: fade-up 0.6s var(--page-turn-ease) both;
}

.setup-lead .eyebrow {
  color: rgba(196, 166, 108, 0.7);
}

.setup-lead h2 {
  margin-top: 0.35rem;
  color: var(--paper-light);
  font-family: var(--font-kai);
  font-size: clamp(1.7rem, 4vw, 2.7rem);
  font-weight: 400;
  letter-spacing: 0.08em;
}

.setup-lead p:not(.eyebrow) {
  max-width: 36rem;
  margin-top: 0.85rem;
  color: rgba(238, 225, 196, 0.56);
  font-size: 0.9rem;
  line-height: 1.9;
}

.setup-resources {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
}

.setup-resources :deep(.gauge) {
  background: rgba(238, 225, 196, 0.055);
  border-color: rgba(238, 225, 196, 0.11);
}

.setup-resources :deep(.gauge__label) {
  color: rgba(238, 225, 196, 0.68);
}

.setup-resources :deep(.gauge__value) {
  color: var(--paper-light);
}

.setup-resources :deep(.gauge__track) {
  background: rgba(238, 225, 196, 0.1);
}

.inheritance-note {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.8rem;
  padding: 0.75rem 0.9rem;
  color: rgba(238, 225, 196, 0.68);
  background: rgba(196, 166, 108, 0.06);
  border: 1px solid rgba(196, 166, 108, 0.18);
  font-size: 0.8rem;
  line-height: 1.7;
}

.inheritance-note__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.7rem;
  height: 1.7rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.78rem;
}

.carried-block {
  margin-top: 1.6rem;
  padding: 1rem 1.1rem;
  background: rgba(196, 166, 108, 0.07);
  border: 1px solid rgba(196, 166, 108, 0.22);
}

.carried-block > .eyebrow {
  color: rgba(196, 166, 108, 0.72);
}

.carried-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.6rem;
}

.carried-card {
  display: flex;
  gap: 0.85rem;
}

.carried-card__avatar {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2.7rem;
  height: 2.7rem;
  color: var(--ink);
  background: var(--paper-warm);
  font-family: var(--font-kai);
  font-size: 1.2rem;
}

.carried-card__body {
  min-width: 0;
}

.carried-card__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.carried-card__head h3 {
  font-family: var(--font-kai);
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.08em;
}

.carried-card__badge {
  padding: 0.02rem 0.4rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
}

.carried-card p {
  color: rgba(238, 225, 196, 0.52);
  font-size: 0.7rem;
  line-height: 1.65;
}

.carried-card__ability {
  color: rgba(196, 166, 108, 0.82) !important;
  font-family: var(--font-kai);
}

.carried-card__note {
  color: rgba(238, 225, 196, 0.4) !important;
  font-size: 0.66rem !important;
}

.candidate-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: clamp(1.8rem, 4vw, 3rem);
}

.candidate-card:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.candidate-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  padding: 1.45rem 1.25rem 1.1rem;
  overflow: hidden;
  color: var(--ink);
  text-align: left;
  background-color: var(--paper);
  background-image:
    radial-gradient(circle at 14% 8%, rgba(255, 255, 255, 0.5), transparent 35%),
    repeating-linear-gradient(
      91deg,
      rgba(97, 73, 43, 0.028) 0,
      rgba(97, 73, 43, 0.028) 1px,
      transparent 1px,
      transparent 5px
    );
  border: 1px solid var(--paper-edge);
  border-radius: 1px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.3s var(--page-turn-ease),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  animation: fade-up 0.55s var(--page-turn-ease) both;
}

.candidate-card:nth-child(2) {
  animation-delay: 0.06s;
}

.candidate-card:nth-child(3) {
  animation-delay: 0.12s;
}

.candidate-card::before {
  position: absolute;
  inset: 0.42rem;
  pointer-events: none;
  content: '';
  border: 1px solid rgba(122, 91, 48, 0.1);
}

.candidate-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold);
  box-shadow: 0 24px 55px rgba(0, 0, 0, 0.32);
}

.candidate-card--selected {
  border-color: var(--cinnabar);
  box-shadow:
    0 24px 55px rgba(0, 0, 0, 0.32),
    inset 0 0 0 2px var(--cinnabar);
  transform: translateY(-4px);
}

.candidate-card__number {
  position: absolute;
  top: 0.65rem;
  right: 0.8rem;
  color: rgba(79, 67, 53, 0.4);
  font-family: var(--font-kai);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
}

.candidate-card__head {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.candidate-card__avatar {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 3.6rem;
  height: 3.6rem;
  color: var(--paper-light);
  background: var(--ink);
  box-shadow: inset 0 0 0 3px var(--ink), inset 0 0 0 4px rgba(238, 225, 196, 0.35);
  font-family: var(--font-kai);
  font-size: 1.65rem;
}

.candidate-card__identity {
  min-width: 0;
  padding-right: 1rem;
}

.candidate-card__identity h3 {
  font-family: var(--font-kai);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.25;
}

.candidate-card__identity p {
  margin-top: 0.18rem;
  color: var(--ink-faint);
  font-size: 0.7rem;
  line-height: 1.5;
}

.candidate-card__epithet {
  display: inline-block;
  margin-top: 0.42rem;
  padding: 0.04rem 0.42rem;
  color: var(--cinnabar);
  border: 1px solid rgba(158, 48, 39, 0.24);
  font-family: var(--font-kai);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
}

.candidate-card__ability {
  display: flex;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(79, 67, 53, 0.12);
  border-bottom: 1px solid rgba(79, 67, 53, 0.12);
}

.candidate-card__ability-seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  color: var(--paper-light);
  background: var(--jade-deep);
  font-family: var(--font-kai);
  font-size: 0.9rem;
}

.candidate-card__ability strong {
  font-family: var(--font-kai);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.candidate-card__ability p {
  margin-top: 0.2rem;
  color: var(--ink-soft);
  font-size: 0.7rem;
  line-height: 1.65;
}

.candidate-card__quote {
  min-height: 2.9em;
  margin: 0;
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.82rem;
  line-height: 1.85;
}

.candidate-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.7rem;
  color: var(--ink-faint);
  font-size: 0.68rem;
}

.candidate-card__pick {
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.72rem;
}

.setup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.setup-actions .btn--primary {
  min-width: 10rem;
}

.setup-actions .btn--ghost {
  --btn-color: rgba(238, 225, 196, 0.58);
  --btn-border: rgba(238, 225, 196, 0.15);
}

.setup-actions .btn--ghost:hover {
  --btn-color: var(--paper-light);
  --btn-border: var(--cinnabar-soft);
}

.setup-footnote {
  max-width: 44rem;
  margin-top: 1.2rem;
  color: rgba(238, 225, 196, 0.36);
  font-size: 0.72rem;
  line-height: 1.75;
}

@media (max-width: 900px) {
  .setup-lead {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }

  .candidate-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .candidate-card {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 0.9rem 1.2rem;
    padding: 1.15rem;
  }

  .candidate-card__head {
    grid-column: 1;
  }

  .candidate-card__ability {
    grid-column: 2;
    grid-row: 1 / span 2;
    border: 0;
    border-left: 1px solid rgba(79, 67, 53, 0.12);
    padding: 0 0 0 1rem;
    align-self: center;
  }

  .candidate-card__quote {
    grid-column: 1;
    min-height: 0;
  }

  .candidate-card__foot {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
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

  .setup-lead h2 {
    font-size: 1.65rem;
  }

  .candidate-card {
    display: flex;
    gap: 0.8rem;
    padding: 1.15rem;
  }

  .candidate-card__ability {
    border-left: 0;
    border-top: 1px solid rgba(79, 67, 53, 0.12);
    border-bottom: 1px solid rgba(79, 67, 53, 0.12);
    padding: 0.75rem 0;
  }

  .candidate-card__quote {
    min-height: 0;
  }

  .setup-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .setup-actions .btn {
    width: 100%;
  }
}
</style>

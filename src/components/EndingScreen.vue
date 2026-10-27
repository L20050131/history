<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  ANNUAL_MARK_META,
  RESOURCE_META,
  RESOURCE_ORDER,
  canInheritEpithet,
  epithetKind,
} from '@/game/content'
import { makeInheritedResources, validateEraName } from '@/game/engine'
import type { Session } from '@/game/types'

const props = defineProps<{ session: Session }>()

const emit = defineEmits<{
  restart: []
  inherit: [eraName: string]
  archive: []
  achievements: []
  rules: []
}>()

const ending = computed(() => props.session.ending)
const canInherit = computed(() =>
  ending.value ? canInheritEpithet(ending.value.epithet.char) : false,
)
const epithetKindValue = computed(() =>
  ending.value ? epithetKind(ending.value.epithet.char) : 'bad',
)
const era = ref('')
const error = ref('')
const showInheritance = ref(false)
const inheritancePanel = ref<HTMLElement | null>(null)

const inheritedResources = computed(() =>
  makeInheritedResources(ending.value?.finalResources ?? props.session.resources),
)

const chiefAdvisor = computed(() => props.session.advisors[0] ?? null)
const inheritanceCopy = computed(() => {
  const legacy = chiefAdvisor.value
  return `${
    legacy ? `首席辅臣${legacy.name}将留任新朝，仍领旧职，岁末考成更著。` : ''
  }然新君初立，朝局动荡：府库、军势各减十，民变、权臣各增十；濒危之值止于边界，给后来者一线生机。`
})

const evaluationRows = computed(() => {
  const record = ending.value?.evaluations ?? props.session.evaluations
  return (['顺', '厄', '平', '庸'] as const).map((mark) => ({
    mark,
    meta: ANNUAL_MARK_META[mark],
    count: record[mark],
  }))
})

const chronicleGroups = computed(() => {
  const groups = new Map<number, Session['chronicle']>()
  for (const entry of props.session.chronicle) {
    const list = groups.get(entry.year) ?? []
    list.push(entry)
    groups.set(entry.year, list)
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, entries]) => ({ year, entries }))
})

const isValidEra = computed(() => validateEraName(era.value))

async function toggleInheritance() {
  showInheritance.value = !showInheritance.value
  if (showInheritance.value) {
    await nextTick()
    inheritancePanel.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function submitInheritance() {
  const clean = era.value.trim()
  if (!validateEraName(clean)) {
    error.value = '年号须为两个汉字'
    return
  }
  error.value = ''
  emit('inherit', clean)
}
</script>

<template>
  <div v-if="ending" class="ending-screen">
    <header class="ending-top">
      <div class="ending-top__brand">
        <span class="seal-mark">山</span>
        <div>
          <p class="eyebrow">{{ session.eraName }}朝 · 第{{ session.generation }}世</p>
          <h1>山河纪 · 终卷</h1>
        </div>
      </div>
      <div class="ending-top__actions">
        <button class="btn btn--ghost" type="button" @click="emit('archive')">历代本纪</button>
        <button class="btn btn--ghost" type="button" @click="emit('achievements')">结局图鉴</button>
        <button class="btn btn--ghost" type="button" @click="emit('rules')">治国要略</button>
      </div>
    </header>

    <main class="ending-main">
      <section class="ending-hero">
        <div class="ending-hero__mark">
          <span class="ending-hero__seal">{{ $props.session.ending?.label.slice(0, 1) }}</span>
          <span class="ending-hero__label">{{ ending.label }}</span>
        </div>
        <div class="ending-hero__copy">
          <p class="eyebrow">国祚终局 · {{ ending.yearsPlayed }} 年</p>
          <h2>{{ ending.headline }}</h2>
          <p class="ending-hero__narrative">{{ ending.narrative }}</p>
        </div>
        <div class="epithet-block">
          <span class="epithet-block__label">谥法</span>
          <span class="epithet-block__char">{{ ending.epithet.char }}</span>
          <p class="epithet-block__name">{{ ending.epithet.name }}</p>
          <p class="epithet-block__meaning">{{ ending.epithet.meaning }}</p>
        </div>
      </section>

      <section class="ending-layout">
        <div class="ending-sheet paper-texture">
          <section class="ending-section">
            <div class="section-heading">
              <div>
                <p class="eyebrow">太史公曰</p>
                <h3>史官总评</h3>
              </div>
              <span class="section-heading__seal">史</span>
            </div>
            <div class="historian-copy">
              <p v-for="(paragraph, index) in ending.historian.split('\n\n')" :key="index">
                {{ paragraph }}
              </p>
            </div>
          </section>

          <section class="ending-section">
            <div class="section-heading">
              <div>
                <p class="eyebrow">盖棺定论</p>
                <h3>岁评总录</h3>
              </div>
            </div>
            <div class="evaluation-grid">
              <div
                v-for="row in evaluationRows"
                :key="row.mark"
                class="evaluation-cell"
                :style="{ '--mark-color': row.meta.color }"
              >
                <span class="evaluation-cell__mark">{{ row.mark }}</span>
                <span class="evaluation-cell__count">{{ row.count }} 岁</span>
                <span class="evaluation-cell__remark">{{ row.meta.remark }}</span>
              </div>
            </div>
          </section>

          <section class="ending-section">
            <div class="section-heading">
              <div>
                <p class="eyebrow">山陵既成</p>
                <h3>终局国势</h3>
              </div>
              <span class="section-heading__note">四项国势，随葬史册</span>
            </div>
            <div class="final-resources">
              <div v-for="key in RESOURCE_ORDER" :key="key" class="final-resource">
                <span class="final-resource__seal">{{ RESOURCE_META[key].seal }}</span>
                <span class="final-resource__label">{{ RESOURCE_META[key].label }}</span>
                <strong class="final-resource__value">{{ ending.finalResources[key] }}</strong>
                <span class="final-resource__track">
                  <span
                    class="final-resource__fill"
                    :class="{ 'is-danger': RESOURCE_META[key].danger === 'high' ? ending.finalResources[key] >= 70 : ending.finalResources[key] <= 30 }"
                    :style="{ width: `${ending.finalResources[key]}%` }"
                  ></span>
                </span>
              </div>
            </div>
          </section>

          <section class="ending-section">
            <details class="chronicle" open>
              <summary>
                <span>
                  <span class="eyebrow">一朝实录</span>
                  <strong>起居注 · 全卷</strong>
                </span>
                <span class="chronicle__count">{{ session.chronicle.length }} 条</span>
              </summary>
              <div class="chronicle__scroll">
                <section
                  v-for="group in chronicleGroups"
                  :key="group.year"
                  class="chronicle-year"
                >
                  <h4>第{{ group.year }}年</h4>
                  <ul>
                    <li
                      v-for="(entry, index) in group.entries"
                      :key="`${group.year}-${index}`"
                      :class="{ 'is-skipped': entry.skipped, 'is-evaluation': entry.source === 'evaluation' }"
                    >
                      <span class="chronicle__tag">
                        {{
                          entry.source === 'evaluation'
                            ? '岁评'
                            : entry.source === 'chain'
                              ? '史鉴'
                              : entry.source === 'special'
                                ? entry.categoryLabel === '朝局' || entry.categoryLabel === '国丧'
                                  ? entry.categoryLabel
                                  : '异闻'
                                : entry.categoryLabel
                        }}
                      </span>
                      <span class="chronicle__title">{{ entry.title }}</span>
                      <span class="chronicle__decision">{{ entry.decision }}</span>
                    </li>
                  </ul>
                </section>
              </div>
            </details>
          </section>

          <section class="ending-section ending-section--verdict">
            <p class="eyebrow">史臣断语</p>
            <blockquote>{{ ending.verdict }}</blockquote>
          </section>
        </div>

        <aside class="ending-aside">
          <section class="aside-card">
            <h3>本朝纪略</h3>
            <dl>
              <div>
                <dt>年号</dt>
                <dd>{{ session.eraName }}</dd>
              </div>
              <div>
                <dt>世次</dt>
                <dd>第{{ session.generation }}世</dd>
              </div>
              <div>
                <dt>享国</dt>
                <dd>{{ ending.yearsPlayed }} 年</dd>
              </div>
              <div>
                <dt>辅臣</dt>
                <dd>{{ session.advisors.length ? session.advisors.map((advisor) => advisor.name).join('、') : '未设' }}</dd>
              </div>
              <div>
                <dt>结局</dt>
                <dd>{{ ending.label }}</dd>
              </div>
              <div>
                <dt>谥号</dt>
                <dd>{{ ending.epithet.name }}</dd>
              </div>
            </dl>
          </section>

          <section
            ref="inheritancePanel"
            class="aside-card inheritance-card"
            :class="{ 'inheritance-card--barred': !canInherit }"
          >
            <template v-if="canInherit">
              <template v-if="!showInheritance">
                <p class="eyebrow">国祚不绝</p>
                <h3>传于下一世</h3>
                <p class="aside-card__copy">
                  继承本朝终局四项国势，另取新年号，再开一世。{{ inheritanceCopy }}
                </p>
                <button class="btn btn--ink btn--wide" type="button" @click="toggleInheritance">
                  承继国祚
                  <span aria-hidden="true">→</span>
                </button>
              </template>
              <template v-else>
                <p class="eyebrow">第{{ session.generation + 1 }}世</p>
                <h3>另取新年号</h3>
                <div class="inherited-preview">
                  <div v-for="key in RESOURCE_ORDER" :key="key">
                    <span>{{ RESOURCE_META[key].seal }}</span>
                    <em>{{ RESOURCE_META[key].label }}</em>
                    <strong>{{ inheritedResources[key] }}</strong>
                  </div>
                </div>
                <form class="inherit-form" @submit.prevent="submitInheritance">
                  <label for="inherit-era">新年号</label>
                  <input
                    id="inherit-era"
                    v-model="era"
                    type="text"
                    maxlength="2"
                    autocomplete="off"
                    placeholder="如：永熙"
                    @input="error = ''"
                  />
                  <p v-if="error" class="inherit-form__error">{{ error }}</p>
                  <button class="btn btn--primary btn--wide" type="submit" :disabled="!isValidEra">
                    继统开朝
                    <span aria-hidden="true">→</span>
                  </button>
                </form>
                <button class="text-link inheritance-cancel" type="button" @click="toggleInheritance">
                  暂不承继
                </button>
              </template>
            </template>
            <template v-else>
              <p class="eyebrow">{{ epithetKindValue === 'neutral' ? '平谥在身' : '恶谥在身' }}</p>
              <h3>{{ epithetKindValue === 'neutral' ? '国祚止于此世' : '国祚自此而绝' }}</h3>
              <p class="aside-card__copy">
                「{{ ending.epithet.char }}」之为谥，{{
                  epithetKindValue === 'neutral'
                    ? '虽无恶名，然非善谥，不足以承宗庙之重'
                    : '恶名难洗，史笔不肯再书继承'
                }}。此局唯可另开新朝，不复传位。
              </p>
            </template>
          </section>

          <section class="aside-card aside-card--quiet">
            <p class="eyebrow">卷终</p>
            <p class="aside-card__copy">
              此卷已自动录入历代本纪，可随时重读。若另开新朝，本纪仍会留存。
            </p>
            <button class="btn btn--ghost btn--wide" type="button" @click="emit('restart')">
              另开一朝
            </button>
          </section>
        </aside>
      </section>

      <p class="ending-colophon">
        {{ session.eraName }}朝 · 史臣谨录 · 藏于石室金匮
      </p>
    </main>
  </div>
</template>

<style scoped>
.ending-screen {
  min-height: 100svh;
  color: var(--paper-light);
  background:
    radial-gradient(circle at 50% -10%, rgba(158, 48, 39, 0.2), transparent 35rem),
    radial-gradient(circle at 88% 32%, rgba(190, 150, 82, 0.09), transparent 26rem),
    linear-gradient(155deg, #1e1812, #14100d 55%, #1c150f);
}

.ending-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(100% - 3rem, 1160px);
  margin: 0 auto;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(238, 225, 196, 0.1);
}

.ending-top__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ending-top__brand .seal-mark {
  width: 2rem;
  height: 2rem;
  font-size: 0.82rem;
}

.ending-top__brand .eyebrow {
  color: rgba(196, 166, 108, 0.62);
  font-size: 0.62rem;
}

.ending-top__brand h1 {
  margin-top: 0.06rem;
  font-family: var(--font-kai);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.22em;
}

.ending-top__actions {
  display: flex;
  gap: 0.4rem;
}

.ending-top__actions .btn--ghost {
  --btn-color: rgba(238, 225, 196, 0.55);
  --btn-border: rgba(238, 225, 196, 0.14);
}

.ending-main {
  width: min(100% - 3rem, 1160px);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) 0 3rem;
}

.ending-hero {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(15rem, 0.58fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  animation: fade-up 0.7s var(--page-turn-ease) both;
}

.ending-hero__mark {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.ending-hero__seal {
  display: grid;
  place-items: center;
  width: clamp(4.5rem, 9vw, 6.5rem);
  height: clamp(4.5rem, 9vw, 6.5rem);
  color: var(--paper-light);
  background: var(--cinnabar);
  box-shadow:
    inset 0 0 0 4px var(--cinnabar),
    inset 0 0 0 5px rgba(255, 246, 223, 0.45),
    0 18px 40px rgba(0, 0, 0, 0.32);
  font-family: var(--font-kai);
  font-size: clamp(2.1rem, 4.5vw, 3.2rem);
  transform: rotate(-2deg);
}

.ending-hero__label {
  color: rgba(238, 225, 196, 0.55);
  font-family: var(--font-kai);
  font-size: 0.72rem;
  letter-spacing: 0.4em;
  text-indent: 0.4em;
}

.ending-hero__copy .eyebrow {
  color: rgba(196, 166, 108, 0.68);
}

.ending-hero__copy h2 {
  margin-top: 0.35rem;
  font-family: var(--font-kai);
  font-size: clamp(1.9rem, 4.4vw, 3rem);
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0.1em;
}

.ending-hero__narrative {
  max-width: 34rem;
  margin-top: 1rem;
  color: rgba(238, 225, 196, 0.56);
  font-size: 0.88rem;
  line-height: 2;
  white-space: pre-line;
}

.epithet-block {
  position: relative;
  padding: 1.2rem 1.3rem;
  text-align: center;
  background: rgba(238, 225, 196, 0.055);
  border: 1px solid rgba(196, 166, 108, 0.24);
}

.epithet-block::before {
  position: absolute;
  inset: 0.35rem;
  pointer-events: none;
  content: '';
  border: 1px solid rgba(196, 166, 108, 0.1);
}

.epithet-block__label {
  display: block;
  color: rgba(196, 166, 108, 0.65);
  font-family: var(--font-kai);
  font-size: 0.62rem;
  letter-spacing: 0.25em;
}

.epithet-block__char {
  display: block;
  margin-top: 0.15rem;
  color: var(--gold);
  font-family: var(--font-kai);
  font-size: clamp(3.8rem, 8vw, 5.3rem);
  line-height: 1.15;
}

.epithet-block__name {
  color: var(--paper-light);
  font-family: var(--font-kai);
  font-size: 1rem;
  letter-spacing: 0.18em;
}

.epithet-block__meaning {
  margin-top: 0.45rem;
  padding-top: 0.45rem;
  color: rgba(238, 225, 196, 0.42);
  border-top: 1px solid rgba(238, 225, 196, 0.1);
  font-size: 0.66rem;
  line-height: 1.7;
}

.ending-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 19rem;
  gap: 1.2rem;
  align-items: start;
  margin-top: clamp(2rem, 5vw, 3.5rem);
  animation: fade-up 0.7s 0.1s var(--page-turn-ease) both;
}

.ending-sheet {
  padding: clamp(1.2rem, 3vw, 2.2rem);
  color: var(--ink);
  border: 1px solid var(--paper-edge);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.34),
    inset 0 0 70px rgba(112, 78, 39, 0.09);
}

.ending-section + .ending-section {
  margin-top: 2rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(79, 67, 53, 0.14);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading h3 {
  margin-top: 0.08rem;
  font-family: var(--font-kai);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.section-heading__seal {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.8rem;
}

.section-heading__note {
  color: var(--ink-faint);
  font-size: 0.65rem;
}

.historian-copy {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(158, 48, 39, 0.45);
  font-family: var(--font-kai);
  font-size: 0.94rem;
  line-height: 2.05;
  text-align: justify;
}

.historian-copy p:first-child {
  color: var(--ink);
  font-size: 1rem;
}

.historian-copy p {
  color: var(--ink-soft);
}

.evaluation-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.evaluation-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.7rem 0.4rem;
  text-align: center;
  background: rgba(255, 247, 230, 0.36);
  border-top: 2px solid var(--mark-color);
}

.evaluation-cell__mark {
  color: var(--mark-color);
  font-family: var(--font-kai);
  font-size: 1.7rem;
  line-height: 1.1;
}

.evaluation-cell__count {
  color: var(--ink);
  font-size: 0.74rem;
  font-variant-numeric: tabular-nums;
}

.evaluation-cell__remark {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.6rem;
  line-height: 1.55;
}

.final-resources {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.final-resource {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15rem 0.4rem;
  align-items: center;
  padding: 0.6rem;
  background: rgba(255, 247, 230, 0.34);
  border: 1px solid rgba(79, 67, 53, 0.1);
}

.final-resource__seal {
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.66rem;
}

.final-resource__label {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.7rem;
}

.final-resource__value {
  grid-column: span 2;
  margin-top: 0.1rem;
  font-size: 1.5rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.final-resource__track {
  grid-column: span 2;
  height: 3px;
  margin-top: 0.25rem;
  overflow: hidden;
  background: rgba(79, 67, 53, 0.12);
}

.final-resource__fill {
  display: block;
  height: 100%;
  background: var(--jade);
}

.final-resource__fill.is-danger {
  background: var(--cinnabar);
}

.chronicle {
  margin-top: 0.8rem;
  border: 1px solid rgba(79, 67, 53, 0.14);
}

.chronicle summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 0.8rem;
  background: rgba(255, 247, 230, 0.38);
  cursor: pointer;
  list-style: none;
}

.chronicle summary::-webkit-details-marker {
  display: none;
}

.chronicle summary .eyebrow {
  display: block;
  font-size: 0.58rem;
}

.chronicle summary strong {
  font-family: var(--font-kai);
  font-size: 0.82rem;
  font-weight: 500;
}

.chronicle__count {
  color: var(--ink-faint);
  font-size: 0.64rem;
}

.chronicle__scroll {
  max-height: 24rem;
  padding: 0.7rem 0.8rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.chronicle-year + .chronicle-year {
  margin-top: 0.85rem;
}

.chronicle-year h4 {
  margin-bottom: 0.3rem;
  color: var(--gold);
  font-family: var(--font-kai);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.chronicle-year ul {
  border-top: 1px dashed rgba(79, 67, 53, 0.12);
}

.chronicle-year li {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.32rem 0;
  border-bottom: 1px dashed rgba(79, 67, 53, 0.08);
  font-size: 0.68rem;
}

.chronicle-year li.is-skipped {
  opacity: 0.55;
}

.chronicle-year li.is-evaluation {
  color: var(--jade-deep);
  background: rgba(80, 103, 86, 0.04);
}

.chronicle__tag {
  flex: 0 0 3.2rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.6rem;
}

.chronicle__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-family: var(--font-kai);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chronicle__decision {
  flex: 0 0 auto;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.64rem;
}

.ending-section--verdict {
  text-align: center;
}

.ending-section--verdict .eyebrow {
  font-size: 0.6rem;
}

.ending-section--verdict blockquote {
  max-width: 36rem;
  margin: 0.7rem auto 0;
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 1rem;
  line-height: 2;
}

.ending-aside {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: sticky;
  top: 1rem;
}

.aside-card {
  padding: 1.1rem;
  color: var(--ink);
  background-color: var(--paper);
  background-image:
    radial-gradient(circle at 88% 6%, rgba(255, 255, 255, 0.4), transparent 35%),
    repeating-linear-gradient(
      91deg,
      rgba(97, 73, 43, 0.025) 0,
      rgba(97, 73, 43, 0.025) 1px,
      transparent 1px,
      transparent 5px
    );
  border: 1px solid var(--paper-edge);
}

.aside-card .eyebrow {
  font-size: 0.58rem;
}

.aside-card h3 {
  margin-top: 0.12rem;
  font-family: var(--font-kai);
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.aside-card dl {
  margin-top: 0.75rem;
  border-top: 1px solid rgba(79, 67, 53, 0.12);
}

.aside-card dl div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.32rem 0;
  border-bottom: 1px dashed rgba(79, 67, 53, 0.1);
}

.aside-card dt {
  color: var(--ink-faint);
  font-size: 0.66rem;
}

.aside-card dd {
  color: var(--ink);
  font-family: var(--font-kai);
  font-size: 0.76rem;
}

.aside-card__copy {
  margin-top: 0.5rem;
  color: var(--ink-soft);
  font-size: 0.7rem;
  line-height: 1.75;
}

.aside-card .btn {
  margin-top: 0.75rem;
}

.inheritance-card {
  border-top: 2px solid var(--cinnabar);
}

.inheritance-card--barred {
  border-top-color: var(--ink-faint);
}

.inheritance-card--barred h3 {
  color: var(--cinnabar);
}

.inherited-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  margin-top: 0.65rem;
}

.inherited-preview div {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.35rem;
  background: rgba(255, 247, 230, 0.5);
  border: 1px solid rgba(79, 67, 53, 0.1);
}

.inherited-preview span {
  display: grid;
  place-items: center;
  width: 1.05rem;
  height: 1.05rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.54rem;
}

.inherited-preview em {
  color: var(--ink-faint);
  font-size: 0.62rem;
  font-style: normal;
}

.inherited-preview strong {
  margin-left: auto;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.inherit-form {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.7rem;
}

.inherit-form label {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
}

.inherit-form input {
  width: 100%;
  padding: 0.45rem 0.6rem;
  color: var(--ink);
  background: rgba(255, 247, 230, 0.4);
  border: 1px solid rgba(79, 67, 53, 0.22);
  font-family: var(--font-kai);
  font-size: 1.05rem;
  letter-spacing: 0.2em;
  text-align: center;
}

.inherit-form input:focus {
  border-color: var(--cinnabar);
  outline: none;
}

.inherit-form__error {
  color: var(--cinnabar);
  font-size: 0.64rem;
}

.inherit-form .btn {
  margin-top: 0.35rem;
}

.inheritance-cancel {
  margin-top: 0.5rem;
  color: var(--ink-faint);
  font-size: 0.66rem;
}

.aside-card--quiet {
  background-color: rgba(238, 225, 196, 0.9);
}

.ending-colophon {
  margin-top: 2rem;
  color: rgba(238, 225, 196, 0.26);
  font-family: var(--font-kai);
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-align: center;
}

@media (max-width: 960px) {
  .ending-hero {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .epithet-block {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 0.2rem 0.75rem;
    text-align: left;
  }

  .epithet-block__label {
    grid-column: 1;
  }

  .epithet-block__char {
    grid-row: span 2;
    margin: 0;
  }

  .epithet-block__name,
  .epithet-block__meaning {
    grid-column: 3;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .ending-layout {
    grid-template-columns: 1fr;
  }

  .ending-aside {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 700px) {
  .ending-top,
  .ending-main {
    width: calc(100% - 1.8rem);
  }

  .ending-top {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.55rem;
    padding: 0.9rem 0;
  }

  .ending-top__brand {
    flex: 1 1 100%;
  }

  .ending-top__brand h1 {
    font-size: 0.95rem;
  }

  .ending-top__actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.3rem;
    width: 100%;
  }

  .ending-top__actions .btn--ghost {
    min-height: 1.9rem;
    padding: 0.2rem 0.2rem;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .ending-main {
    padding-top: 1.8rem;
  }

  .ending-hero {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .ending-hero__mark {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.8rem;
  }

  .ending-hero__seal {
    width: 4rem;
    height: 4rem;
    font-size: 1.9rem;
  }

  .ending-hero__label {
    letter-spacing: 0.3em;
  }

  .ending-hero__copy h2 {
    font-size: 1.8rem;
  }

  .epithet-block {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.7rem;
  }

  .epithet-block__char {
    font-size: 3.1rem;
  }

  .epithet-block__meaning {
    flex-basis: 100%;
    padding-top: 0.4rem;
    border-top: 1px solid rgba(238, 225, 196, 0.1);
  }

  .ending-sheet {
    padding: 1.1rem 1rem;
  }

  .evaluation-grid,
  .final-resources {
    grid-template-columns: 1fr 1fr;
  }

  .ending-aside {
    grid-template-columns: 1fr;
  }

  .historian-copy {
    font-size: 0.86rem;
    line-height: 1.95;
  }
}
</style>

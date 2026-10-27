<script setup lang="ts">
import { computed } from 'vue'
import ModalShell from './ModalShell.vue'
import {
  ENDING_META,
  ENDING_ORDER,
  LOCKED_ENDING_HINT,
  LOCKED_ENDING_TITLE,
} from '@/game/content'
import type { AchievementState } from '@/game/types'

const props = defineProps<{ achievements: AchievementState }>()

const emit = defineEmits<{ close: [] }>()

const records = computed(() =>
  ENDING_ORDER.map((kind, index) => ({
    kind,
    index,
    meta: ENDING_META[kind],
    record: props.achievements.endings[kind] ?? null,
  })),
)

const unlockedCount = computed(
  () => records.value.filter((item) => Boolean(item.record)).length,
)

const totalReigns = computed(() =>
  records.value.reduce((sum, item) => sum + (item.record?.count ?? 0), 0),
)

const totalEpithets = computed(() => {
  const collected = new Set<string>()
  for (const item of records.value) {
    for (const epithet of item.record?.epithets ?? []) collected.add(epithet)
  }
  return collected.size
})

const SLOT_NAMES = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
]

function slotName(index: number): string {
  return SLOT_NAMES[index] ?? String(index + 1)
}

function dateText(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function epithetChar(record: { latestEpithet: string }): string {
  return record.latestEpithet.slice(0, 1) || '谥'
}
</script>

<template>
  <ModalShell
    title="结局图鉴"
    subtitle="国祚诸终 · 以谥为记"
    size="lg"
    @close="emit('close')"
  >
    <div class="codex">
      <div class="codex__intro">
        <p>
          已亲历 <strong>{{ unlockedCount }}</strong> / {{ records.length }} 种国祚终局，
          累计 <strong>{{ totalReigns }}</strong> 朝，得谥 <strong>{{ totalEpithets }}</strong> 种。
          每一终局以其所得谥号为记；未亲历者，卷中只书「{{ LOCKED_ENDING_TITLE }}」。
        </p>
        <span class="codex__mark">鉴</span>
      </div>

      <div class="codex-grid">
        <article
          v-for="item in records"
          :key="item.kind"
          class="codex-card"
          :class="{ 'codex-card--locked': !item.record }"
        >
          <div class="codex-card__head">
            <span class="codex-card__seal">
              {{ item.record ? epithetChar(item.record) : '未' }}
            </span>
            <div>
              <p class="eyebrow">
                {{ item.record ? `已亲历 · ${item.meta.label}` : `第${slotName(item.index)}卷` }}
              </p>
              <h3>
                {{ item.record ? item.record.latestEpithet || item.meta.label : LOCKED_ENDING_TITLE }}
              </h3>
            </div>
            <span v-if="item.record" class="codex-card__count">第 {{ item.record.count }} 次</span>
          </div>

          <template v-if="item.record">
            <p class="codex-card__headline">{{ item.meta.headline }}</p>
            <p class="codex-card__narrative">{{ item.meta.narrative }}</p>
            <dl class="codex-card__stats">
              <div>
                <dt>终局</dt>
                <dd>{{ item.meta.label }}</dd>
              </div>
              <div>
                <dt>最近一朝</dt>
                <dd>{{ item.record.latestEraName }}朝 · 在位{{ item.record.latestYears }}年</dd>
              </div>
              <div v-if="item.record.epithets.length > 1">
                <dt>历代谥号</dt>
                <dd>{{ item.record.epithets.join('、') }}</dd>
              </div>
              <div>
                <dt>最长在位</dt>
                <dd>{{ item.record.bestYears }} 年</dd>
              </div>
              <div>
                <dt>初次留印</dt>
                <dd>{{ dateText(item.record.unlockedAt) }}</dd>
              </div>
            </dl>
          </template>

          <p v-else class="codex-card__condition">
            <span>达成条件</span>
            {{ LOCKED_ENDING_HINT }}
          </p>
        </article>
      </div>

      <p class="codex__note">
        图鉴与历代本纪各自存档。焚毁本纪不会抹去此处已亲历的结局。
      </p>
    </div>

    <template #footer>
      <button class="btn btn--ink" type="button" @click="emit('close')">合卷</button>
    </template>
  </ModalShell>
</template>

<style scoped>
.codex {
  padding-top: 0.1rem;
}

.codex__intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(79, 67, 53, 0.14);
}

.codex__intro p {
  color: var(--ink-soft);
  font-size: 0.82rem;
  line-height: 1.8;
}

.codex__intro strong {
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 1.05rem;
}

.codex__mark {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--cinnabar);
  border: 1px solid rgba(158, 48, 39, 0.3);
  font-family: var(--font-kai);
  font-size: 0.8rem;
}

.codex-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
  margin-top: 0.9rem;
}

.codex-card {
  position: relative;
  padding: 0.9rem 0.9rem 0.8rem;
  background: rgba(255, 247, 230, 0.42);
  border: 1px solid rgba(79, 67, 53, 0.14);
}

.codex-card--locked {
  background: rgba(255, 247, 230, 0.2);
  border-style: dashed;
}

.codex-card__head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.codex-card__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 1.15rem;
  box-shadow: inset 0 0 0 3px var(--cinnabar), inset 0 0 0 4px rgba(255, 246, 223, 0.35);
}

.codex-card--locked .codex-card__seal {
  color: var(--ink-faint);
  background: transparent;
  border: 1px solid rgba(79, 67, 53, 0.26);
  box-shadow: none;
}

.codex-card__head h3 {
  font-family: var(--font-kai);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.codex-card__head .eyebrow {
  font-size: 0.58rem;
}

.codex-card__count {
  margin-left: auto;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.66rem;
  white-space: nowrap;
}

.codex-card__headline {
  margin-top: 0.65rem;
  color: var(--ink);
  font-family: var(--font-kai);
  font-size: 0.86rem;
  letter-spacing: 0.03em;
}

.codex-card--locked .codex-card__headline {
  color: var(--ink-faint);
}

.codex-card__narrative {
  margin-top: 0.35rem;
  color: var(--ink-soft);
  font-size: 0.7rem;
  line-height: 1.75;
  text-align: justify;
}

.codex-card__stats {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.65rem;
  padding-top: 0.55rem;
  border-top: 1px dashed rgba(79, 67, 53, 0.16);
}

.codex-card__stats div {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.codex-card__stats dt {
  flex: 0 0 auto;
  color: var(--ink-faint);
  font-size: 0.6rem;
}

.codex-card__stats dd {
  margin: 0;
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.68rem;
}

.codex-card__stats div:first-child dd {
  color: var(--cinnabar);
}

.codex-card__condition {
  margin-top: 0.75rem;
  padding-top: 0.6rem;
  color: var(--ink-faint);
  border-top: 1px dashed rgba(79, 67, 53, 0.16);
  font-family: var(--font-kai);
  font-size: 0.72rem;
  line-height: 1.75;
}

.codex-card__condition span {
  display: block;
  margin-bottom: 0.18rem;
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  opacity: 0.8;
}

.codex__note {
  margin-top: 0.85rem;
  padding: 0.5rem 0.65rem;
  color: var(--ink-faint);
  background: rgba(80, 103, 86, 0.06);
  border-left: 2px solid rgba(80, 103, 86, 0.35);
  font-size: 0.66rem;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .codex-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ModalShell from './ModalShell.vue'
import { ANNUAL_MARK_META, RESOURCE_META, RESOURCE_ORDER } from '@/game/content'
import type { LibraryState } from '@/game/types'

const props = defineProps<{ library: LibraryState }>()

const emit = defineEmits<{
  close: []
  clear: []
}>()

const expandedId = ref<string | null>(null)
const entries = computed(() => props.library.entries)

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function evaluationText(record: (typeof props.library.entries)[number]['evaluations']): string {
  return (['顺', '厄', '平', '庸'] as const)
    .filter((mark) => record[mark] > 0)
    .map((mark) => `${mark}${record[mark]}`)
    .join(' · ')
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
</script>

<template>
  <ModalShell
    title="历代本纪"
    subtitle="石室金匮 · 藏卷"
    size="lg"
    @close="emit('close')"
  >
    <div class="archive">
      <div v-if="entries.length" class="archive__intro">
        <p>
          凡已终局之朝，皆录于此，共 <strong>{{ entries.length }}</strong> 卷。史官评语与终局国势一并留存。
        </p>
        <span class="archive__mark">藏</span>
      </div>

      <div v-if="entries.length" class="archive-list">
        <article
          v-for="entry in entries"
          :key="entry.id"
          class="archive-entry"
          :class="{ 'archive-entry--open': expandedId === entry.id }"
        >
          <div class="archive-entry__top">
            <span class="archive-entry__seal">{{ entry.epithetChar }}</span>
            <div class="archive-entry__identity">
              <p class="eyebrow">第{{ entry.generation }}世 · {{ entry.endingLabel }}</p>
              <h3>{{ entry.eraName }}朝</h3>
              <p class="archive-entry__epithet">{{ entry.epithetName }} · 享国{{ entry.years }}年</p>
            </div>
            <span class="archive-entry__date">{{ dateText(entry.completedAt) }}</span>
          </div>

          <div class="archive-entry__evaluations">
            <span v-for="mark in ['顺', '厄', '平', '庸'] as const" :key="mark" class="eval-chip">
              <em :style="{ color: ANNUAL_MARK_META[mark].color }">{{ mark }}</em>
              {{ entry.evaluations[mark] }}
            </span>
            <span class="archive-entry__eval-text">{{ evaluationText(entry.evaluations) }}</span>
          </div>

          <div class="archive-entry__resources">
            <div v-for="key in RESOURCE_ORDER" :key="key">
              <span class="archive-entry__res-seal">{{ RESOURCE_META[key].seal }}</span>
              <span>{{ RESOURCE_META[key].label }}</span>
              <strong>{{ entry.resources[key] }}</strong>
            </div>
          </div>

          <button class="archive-entry__toggle" type="button" @click="toggle(entry.id)">
            {{ expandedId === entry.id ? '收起史评' : '展读史官评语' }}
            <span aria-hidden="true">{{ expandedId === entry.id ? '↑' : '↓' }}</span>
          </button>

          <Transition name="page-turn">
            <blockquote v-if="expandedId === entry.id" class="archive-entry__historian">
              <p v-for="(paragraph, index) in entry.historian.split('\n\n')" :key="index">
                {{ paragraph }}
              </p>
            </blockquote>
          </Transition>
        </article>
      </div>

      <div v-else class="archive-empty">
        <span class="archive-empty__seal">空</span>
        <h3>金匮尚无藏卷</h3>
        <p>一朝终局之后，本纪将自动录入此处。可随时回来重读旧史。</p>
      </div>
    </div>

    <template #footer>
      <button
        v-if="entries.length"
        class="btn btn--quiet archive__clear"
        type="button"
        @click="emit('clear')"
      >
        焚毁全部藏卷
      </button>
      <button class="btn btn--ink" type="button" @click="emit('close')">合卷</button>
    </template>
  </ModalShell>
</template>

<style scoped>
.archive__intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(79, 67, 53, 0.14);
}

.archive__intro p {
  color: var(--ink-soft);
  font-size: 0.78rem;
  line-height: 1.7;
}

.archive__intro strong {
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 1rem;
}

.archive__mark {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--cinnabar);
  border: 1px solid rgba(158, 48, 39, 0.3);
  font-family: var(--font-kai);
  font-size: 0.8rem;
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 0.9rem;
}

.archive-entry {
  padding: 0.85rem;
  background: rgba(255, 247, 230, 0.34);
  border: 1px solid rgba(79, 67, 53, 0.12);
  transition: border-color 0.2s ease;
}

.archive-entry--open {
  border-color: rgba(158, 48, 39, 0.3);
}

.archive-entry__top {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.archive-entry__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 1.25rem;
  box-shadow: inset 0 0 0 3px var(--cinnabar), inset 0 0 0 4px rgba(255, 246, 223, 0.35);
}

.archive-entry__identity {
  flex: 1;
  min-width: 0;
}

.archive-entry__identity .eyebrow {
  font-size: 0.56rem;
}

.archive-entry__identity h3 {
  font-family: var(--font-kai);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.archive-entry__epithet {
  color: var(--ink-faint);
  font-size: 0.66rem;
}

.archive-entry__date {
  flex: 0 0 auto;
  color: var(--ink-faint);
  font-size: 0.6rem;
}

.archive-entry__evaluations {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.65rem;
  padding-top: 0.55rem;
  border-top: 1px dashed rgba(79, 67, 53, 0.12);
}

.eval-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.04rem 0.32rem;
  color: var(--ink-soft);
  border: 1px solid rgba(79, 67, 53, 0.12);
  font-size: 0.62rem;
}

.eval-chip em {
  font-family: var(--font-kai);
  font-style: normal;
}

.archive-entry__eval-text {
  margin-left: auto;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.62rem;
}

.archive-entry__resources {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.35rem;
  margin-top: 0.5rem;
}

.archive-entry__resources div {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--ink-faint);
  font-size: 0.62rem;
}

.archive-entry__res-seal {
  display: grid;
  place-items: center;
  width: 1.05rem;
  height: 1.05rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.54rem;
}

.archive-entry__resources strong {
  margin-left: auto;
  color: var(--ink);
  font-size: 0.76rem;
  font-variant-numeric: tabular-nums;
}

.archive-entry__toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.55rem;
  padding: 0;
  color: var(--cinnabar);
  background: none;
  border: 0;
  font-family: var(--font-kai);
  font-size: 0.66rem;
  letter-spacing: 0.04em;
}

.archive-entry__toggle:hover {
  color: var(--cinnabar-deep);
}

.archive-entry__historian {
  margin-top: 0.6rem;
  padding: 0.7rem 0.8rem;
  background: rgba(248, 239, 220, 0.62);
  border-left: 2px solid rgba(158, 48, 39, 0.4);
}

.archive-entry__historian p {
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.76rem;
  line-height: 1.9;
  text-align: justify;
}

.archive-entry__historian p + p {
  margin-top: 0.4rem;
}

.archive-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  text-align: center;
}

.archive-empty__seal {
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  color: var(--ink-faint);
  border: 1px solid rgba(79, 67, 53, 0.24);
  font-family: var(--font-kai);
  font-size: 1.2rem;
}

.archive-empty h3 {
  margin-top: 0.9rem;
  font-family: var(--font-kai);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.archive-empty p {
  max-width: 22rem;
  margin-top: 0.35rem;
  color: var(--ink-faint);
  font-size: 0.72rem;
  line-height: 1.75;
}

.archive__clear {
  margin-right: auto;
  color: var(--cinnabar);
}

@media (max-width: 640px) {
  .archive-entry__date {
    display: none;
  }

  .archive-entry__resources {
    grid-template-columns: 1fr 1fr;
  }

  .archive-entry__eval-text {
    display: none;
  }

  .archive__clear {
    width: 100%;
    margin-right: 0;
  }
}
</style>

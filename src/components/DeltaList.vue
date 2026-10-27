<script setup lang="ts">
import { computed } from 'vue'
import { RESOURCE_META, RESOURCE_ORDER } from '@/game/content'
import type { ResourceDelta } from '@/game/types'

const props = withDefaults(
  defineProps<{
    delta: ResourceDelta
    emptyLabel?: string
    size?: 'sm' | 'md'
  }>(),
  {
    emptyLabel: '无增减',
    size: 'md',
  },
)

const items = computed(() => {
  return RESOURCE_ORDER.flatMap((key) => {
    const value = props.delta[key]
    if (!value) return []
    const meta = RESOURCE_META[key]
    const positiveIsGood = meta.danger === 'low'
    const isGood = value > 0 ? positiveIsGood : !positiveIsGood
    return [
      {
        key,
        label: meta.label,
        seal: meta.seal,
        value,
        sign: value > 0 ? '+' : '−',
        absolute: Math.abs(value),
        tone: isGood ? 'good' : 'bad',
      },
    ]
  })
})
</script>

<template>
  <ul v-if="items.length" class="delta-list" :class="`delta-list--${size}`" aria-label="国势变化">
    <li v-for="item in items" :key="item.key" class="delta-chip" :class="`delta-chip--${item.tone}`">
      <span class="delta-chip__seal">{{ item.seal }}</span>
      <span class="delta-chip__label">{{ item.label }}</span>
      <strong class="delta-chip__value">{{ item.sign }}{{ item.absolute }}</strong>
    </li>
  </ul>
  <span v-else class="delta-empty">{{ emptyLabel }}</span>
</template>

<style scoped>
.delta-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}

.delta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.5rem 0.18rem 0.28rem;
  border: 1px solid rgba(79, 67, 53, 0.22);
  border-radius: 2px;
  background: rgba(248, 239, 220, 0.5);
  font-size: 0.8rem;
  line-height: 1.5;
  white-space: nowrap;
}

.delta-chip__seal {
  display: inline-grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.68rem;
  line-height: 1;
}

.delta-chip__label {
  color: var(--ink-faint);
  font-family: var(--font-kai);
}

.delta-chip__value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.delta-chip--good {
  border-color: rgba(80, 103, 86, 0.35);
  background: rgba(80, 103, 86, 0.09);
}

.delta-chip--good .delta-chip__seal {
  background: var(--jade);
}

.delta-chip--good .delta-chip__value {
  color: var(--jade-deep);
}

.delta-chip--bad {
  border-color: rgba(158, 48, 39, 0.32);
  background: rgba(158, 48, 39, 0.07);
}

.delta-chip--bad .delta-chip__seal {
  background: var(--cinnabar);
}

.delta-chip--bad .delta-chip__value {
  color: var(--cinnabar-deep);
}

.delta-list--sm .delta-chip {
  gap: 0.25rem;
  padding: 0.06rem 0.4rem 0.06rem 0.2rem;
  font-size: 0.74rem;
}

.delta-list--sm .delta-chip__seal {
  width: 1.05rem;
  height: 1.05rem;
  font-size: 0.6rem;
}

.delta-empty {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.84rem;
}
</style>

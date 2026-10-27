<script setup lang="ts">
import { computed } from 'vue'
import { RESOURCE_META } from '@/game/content'
import type { ResourceKey } from '@/game/types'

const props = withDefaults(
  defineProps<{
    resourceKey: ResourceKey
    value: number
    compact?: boolean
  }>(),
  { compact: false },
)

const meta = computed(() => RESOURCE_META[props.resourceKey])
const status = computed(() => {
  if (meta.value.danger === 'high') {
    if (props.value >= 85) return 'danger'
    if (props.value >= 70) return 'warn'
    return 'safe'
  }
  if (props.value <= 15) return 'danger'
  if (props.value <= 30) return 'warn'
  return 'safe'
})
const statusLabel = computed(() => {
  if (status.value === 'danger') return '危'
  if (status.value === 'warn') return '警'
  return '安'
})
const barStyle = computed(() => ({
  width: `${Math.max(0, Math.min(100, props.value))}%`,
}))
</script>

<template>
  <div
    class="gauge"
    :class="[`gauge--${status}`, { 'gauge--compact': compact }]"
    :title="`${meta.label}：${meta.description} ${meta.threshold}`"
  >
    <div class="gauge__head">
      <span class="gauge__seal">{{ meta.seal }}</span>
      <span class="gauge__label">{{ meta.label }}</span>
      <strong class="gauge__value">{{ value }}</strong>
      <span class="gauge__status">{{ statusLabel }}</span>
    </div>
    <div class="gauge__track" role="meter" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100" :aria-label="meta.label">
      <span class="gauge__fill" :style="barStyle"></span>
      <span class="gauge__threshold gauge__threshold--lo"></span>
    </div>
    <p v-if="!compact" class="gauge__hint">{{ meta.ending }} · {{ meta.threshold }}</p>
  </div>
</template>

<style scoped>
.gauge {
  --gauge-color: var(--jade);
  min-width: 0;
  padding: 0.65rem 0.7rem 0.55rem;
  border: 1px solid rgba(79, 67, 53, 0.16);
  border-radius: 2px;
  background: rgba(248, 239, 220, 0.42);
}

.gauge--warn {
  --gauge-color: var(--gold);
}

.gauge--danger {
  --gauge-color: var(--cinnabar);
  border-color: rgba(158, 48, 39, 0.34);
  background: rgba(158, 48, 39, 0.055);
}

.gauge__head {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 1.4rem;
}

.gauge__seal {
  display: inline-grid;
  place-items: center;
  width: 1.3rem;
  height: 1.3rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.68rem;
  line-height: 1;
}

.gauge__label {
  flex: 1;
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.86rem;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.gauge__value {
  color: var(--ink);
  font-size: 1.06rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.gauge__status {
  color: var(--gauge-color);
  font-family: var(--font-kai);
  font-size: 0.68rem;
  line-height: 1;
}

.gauge__track {
  position: relative;
  height: 4px;
  margin-top: 0.55rem;
  overflow: hidden;
  background: rgba(79, 67, 53, 0.12);
  border-radius: 1px;
}

.gauge__fill {
  display: block;
  height: 100%;
  background: var(--gauge-color);
  transition: width 0.55s var(--page-turn-ease);
}

.gauge__threshold {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(36, 30, 24, 0.22);
}

.gauge__threshold--lo {
  left: 25%;
}

.gauge__hint {
  margin-top: 0.32rem;
  overflow: hidden;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.67rem;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gauge--compact {
  padding: 0.45rem 0.5rem 0.4rem;
}

.gauge--compact .gauge__seal {
  width: 1.1rem;
  height: 1.1rem;
  font-size: 0.6rem;
}

.gauge--compact .gauge__label {
  font-size: 0.78rem;
}

.gauge--compact .gauge__value {
  font-size: 0.94rem;
}

.gauge--compact .gauge__status {
  display: none;
}

.gauge--compact .gauge__track {
  margin-top: 0.38rem;
}

@media (max-width: 420px) {
  .gauge:not(.gauge--compact) {
    padding: 0.5rem 0.55rem;
  }

  .gauge__hint {
    display: none;
  }
}
</style>

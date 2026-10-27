<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    size?: 'md' | 'lg'
  }>(),
  { subtitle: '', size: 'md' },
)

const emit = defineEmits<{ close: [] }>()
const closeButton = ref<HTMLButtonElement | null>(null)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.classList.add('has-modal')
  window.addEventListener('keydown', onKeydown)
  void nextTick(() => closeButton.value?.focus())
})

onBeforeUnmount(() => {
  document.body.classList.remove('has-modal')
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('close')">
      <section
        class="modal-card paper-texture"
        :class="`modal-card--${size}`"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <span class="modal-card__corner modal-card__corner--tl" aria-hidden="true"></span>
        <span class="modal-card__corner modal-card__corner--br" aria-hidden="true"></span>
        <header class="modal-card__head">
          <div>
            <p class="eyebrow">{{ subtitle || '山河纪' }}</p>
            <h2>{{ title }}</h2>
          </div>
          <button ref="closeButton" class="modal-card__close" type="button" aria-label="关闭" @click="emit('close')">
            ×
          </button>
        </header>
        <div class="modal-card__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="modal-card__foot">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 80;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  overflow-y: auto;
  background: rgba(15, 12, 9, 0.72);
  backdrop-filter: blur(3px);
  animation: backdrop-in 0.24s ease-out both;
}

.modal-card {
  position: relative;
  width: min(100%, 44rem);
  max-height: min(88vh, 54rem);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--paper-edge);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.52),
    inset 0 0 0 5px rgba(255, 247, 228, 0.28),
    inset 0 0 70px rgba(120, 86, 47, 0.12);
  animation: modal-in 0.35s var(--page-turn-ease) both;
}

.modal-card--lg {
  width: min(100%, 58rem);
}

.modal-card::before {
  position: absolute;
  z-index: 0;
  inset: 0.55rem;
  pointer-events: none;
  content: '';
  border: 1px solid rgba(122, 91, 48, 0.18);
}

.modal-card__head,
.modal-card__body,
.modal-card__foot {
  position: relative;
  z-index: 1;
}

.modal-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.8rem 0.9rem;
}

.modal-card__head h2 {
  margin-top: 0.2rem;
  font-family: var(--font-kai);
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  font-weight: 500;
  letter-spacing: 0.12em;
}

.modal-card__close {
  flex: 0 0 auto;
  width: 2.4rem;
  height: 2.4rem;
  color: var(--ink-faint);
  background: transparent;
  border: 1px solid rgba(79, 67, 53, 0.22);
  font-size: 1.55rem;
  font-weight: 300;
  line-height: 1;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.modal-card__close:hover {
  color: var(--cinnabar);
  border-color: var(--cinnabar);
  transform: rotate(90deg);
}

.modal-card__body {
  padding: 0.35rem 1.8rem 1.8rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.modal-card__foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 0.9rem 1.8rem 1.3rem;
  border-top: 1px solid rgba(79, 67, 53, 0.14);
}

.modal-card__corner {
  position: absolute;
  z-index: 2;
  width: 2.2rem;
  height: 2.2rem;
  pointer-events: none;
  border-color: rgba(158, 48, 39, 0.5);
}

.modal-card__corner--tl {
  top: 0.2rem;
  left: 0.2rem;
  border-top: 1px solid;
  border-left: 1px solid;
}

.modal-card__corner--br {
  right: 0.2rem;
  bottom: 0.2rem;
  border-right: 1px solid;
  border-bottom: 1px solid;
}

@keyframes backdrop-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .modal-backdrop {
    align-items: end;
    padding: 0.5rem;
  }

  .modal-card {
    max-height: 92dvh;
    border-bottom: 0;
  }

  .modal-card__head {
    padding: 1.2rem 1.15rem 0.7rem;
  }

  .modal-card__body {
    padding: 0.25rem 1.15rem 1.3rem;
  }

  .modal-card__foot {
    padding: 0.75rem 1.15rem calc(1rem + env(safe-area-inset-bottom));
  }
}
</style>

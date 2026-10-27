<script setup lang="ts">
import { computed, ref } from 'vue'
import { validateEraName } from '@/game/engine'

const props = defineProps<{
  hasSaved: boolean
  savedSummary: string
  savedDetail: string
  savedEnded: boolean
  archiveCount: number
  achievementCount: number
  achievementTotal: number
}>()

const emit = defineEmits<{
  start: [era: string]
  resume: []
  archive: []
  achievements: []
  rules: []
}>()

const era = ref('')
const error = ref('')
const examples = ['承平', '开元', '靖和']
const isValid = computed(() => validateEraName(era.value))

function submit() {
  const clean = era.value.trim()
  if (!validateEraName(clean)) {
    error.value = '年号须为两个汉字'
    return
  }
  error.value = ''
  emit('start', clean)
}

function useExample(value: string) {
  era.value = value
  error.value = ''
}
</script>

<template>
  <div class="title-screen">
    <div class="title-screen__atmosphere" aria-hidden="true">
      <span class="mist mist--one"></span>
      <span class="mist mist--two"></span>
      <span class="sun-disc"></span>
      <svg class="mountain-range" viewBox="0 0 1440 500" preserveAspectRatio="none">
        <path
          class="mountain-range__back"
          d="M0 390 L90 315 L166 350 L264 212 L330 282 L408 188 L492 278 L568 230 L654 318 L742 200 L830 290 L920 152 L1014 260 L1112 208 L1204 308 L1308 236 L1440 350 L1440 500 L0 500 Z"
        />
        <path
          class="mountain-range__mid"
          d="M0 420 L120 350 L205 382 L310 278 L390 342 L478 248 L574 360 L660 300 L744 370 L862 250 L958 350 L1054 292 L1162 380 L1260 310 L1360 372 L1440 330 L1440 500 L0 500 Z"
        />
        <path
          class="mountain-range__front"
          d="M0 460 L140 394 L250 430 L370 348 L462 414 L580 360 L692 430 L812 372 L930 438 L1050 380 L1180 430 L1290 386 L1440 444 L1440 500 L0 500 Z"
        />
      </svg>
      <span class="grain"></span>
    </div>

    <header class="title-top">
      <div class="title-top__brand">
        <span class="seal-mark title-top__seal">山</span>
        <span>山河纪</span>
      </div>
      <nav class="title-top__nav" aria-label="首页导航">
        <button class="btn btn--ghost" type="button" @click="emit('rules')">治国要略</button>
        <button class="btn btn--ghost" type="button" @click="emit('archive')">
          历代本纪
          <span class="nav-count">{{ archiveCount }}</span>
        </button>
        <button class="btn btn--ghost" type="button" @click="emit('achievements')">
          结局图鉴
          <span class="nav-count">{{ achievementCount }}/{{ achievementTotal }}</span>
        </button>
      </nav>
    </header>

    <main class="title-hero">
      <section class="hero-copy">
        <p class="hero-copy__eyebrow">文字向 · 帝王纪年</p>
        <h1 class="hero-title">
          <span class="hero-title__main">山河</span>
          <span class="hero-title__seal">纪</span>
        </h1>
        <p class="hero-subtitle">一纸江山，千秋功过</p>
        <div class="hero-divider" aria-hidden="true"><span></span></div>
        <p class="hero-lede">
          取年号，御四海。四时各有一事，一岁终有史评。<br />
          你做的每一个决定，都会在国势与史笔之间留下回声。
        </p>
        <dl class="hero-rules">
          <div>
            <dt>四时</dt>
            <dd>每岁四议</dd>
          </div>
          <div>
            <dt>国势</dt>
            <dd>四值定兴亡</dd>
          </div>
          <div>
            <dt>史评</dt>
            <dd>顺 · 厄 · 平 · 庸</dd>
          </div>
        </dl>
      </section>

      <section class="entry-panel" aria-labelledby="entry-title">
        <span class="entry-panel__corner entry-panel__corner--tl"></span>
        <span class="entry-panel__corner entry-panel__corner--br"></span>
        <div class="entry-panel__seal-row">
          <span class="seal-mark entry-panel__seal">受</span>
          <div>
            <p class="eyebrow">新朝伊始</p>
            <h2 id="entry-title">受命于天</h2>
          </div>
        </div>
        <p class="entry-panel__intro">先定年号，再择辅臣。年号将伴随这一朝始终。</p>

        <form class="era-form" @submit.prevent="submit">
          <label class="era-label" for="era-name">御定年号</label>
          <div class="era-input-wrap" :class="{ 'era-input-wrap--error': error }">
            <input
              id="era-name"
              v-model="era"
              class="era-input"
              type="text"
              maxlength="2"
              autocomplete="off"
              spellcheck="false"
              placeholder="承平"
              aria-describedby="era-help"
              @input="error = ''"
            />
            <span class="era-suffix">年</span>
          </div>
          <p id="era-help" class="era-help" :class="{ 'era-help--error': error }">
            {{ error || '限两个汉字。例如：承平、开元、靖和' }}
          </p>
          <div class="era-examples" aria-label="年号示例">
            <button
              v-for="example in examples"
              :key="example"
              class="era-example"
              type="button"
              @click="useExample(example)"
            >
              {{ example }}
            </button>
          </div>
          <button class="btn btn--primary btn--wide entry-panel__start" type="submit" :disabled="!isValid">
            受命于天
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <div v-if="hasSaved" class="save-resume">
          <div class="save-resume__rule">
            <span>{{ savedEnded ? '前朝已终' : '旧卷未封' }}</span>
          </div>
          <div class="save-resume__card">
            <div class="save-resume__copy">
              <p class="save-resume__label">续读前朝</p>
              <p class="save-resume__summary">{{ savedSummary }}</p>
              <p class="save-resume__detail">{{ savedDetail }}</p>
            </div>
            <button class="btn btn--ink save-resume__button" type="button" @click="emit('resume')">
              {{ savedEnded ? '展阅终卷' : '继续理政' }}
            </button>
          </div>
        </div>

        <p class="entry-panel__note">本卷自动录于本地，可随时暂离，日后续读。</p>
      </section>
    </main>

    <aside class="title-vertical" aria-hidden="true">受命于天 · 既寿永昌</aside>

    <footer class="title-foot">
      <span>干支纪年 · 四时朝议</span>
      <span class="title-foot__dot"></span>
      <span>所有存档仅存于此设备</span>
    </footer>
  </div>
</template>

<style scoped>
.title-screen {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  color: var(--paper-light);
  background:
    linear-gradient(180deg, rgba(17, 14, 11, 0.12), rgba(17, 14, 11, 0.72)),
    radial-gradient(circle at 68% 28%, rgba(214, 176, 108, 0.2), transparent 30rem),
    linear-gradient(145deg, #221c16 0%, #17130f 48%, #211a13 100%);
}

.title-screen__atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.mountain-range {
  position: absolute;
  right: -4%;
  bottom: -1px;
  left: -4%;
  width: 108%;
  height: min(62vh, 34rem);
  opacity: 0.9;
  filter: drop-shadow(0 -10px 35px rgba(0, 0, 0, 0.12));
}

.mountain-range__back {
  fill: rgba(105, 89, 68, 0.18);
}

.mountain-range__mid {
  fill: rgba(76, 65, 49, 0.32);
}

.mountain-range__front {
  fill: rgba(35, 29, 22, 0.78);
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.017) 0,
    rgba(255, 255, 255, 0.017) 1px,
    transparent 1px,
    transparent 3px
  );
  mix-blend-mode: screen;
}

.sun-disc {
  position: absolute;
  top: 17%;
  right: 19%;
  width: clamp(5rem, 10vw, 9rem);
  aspect-ratio: 1;
  background: rgba(167, 71, 52, 0.72);
  border-radius: 50%;
  box-shadow:
    0 0 50px rgba(168, 92, 62, 0.24),
    0 0 150px rgba(168, 92, 62, 0.12);
  opacity: 0.72;
}

.mist {
  position: absolute;
  display: block;
  width: 46vw;
  height: 12rem;
  background: radial-gradient(ellipse, rgba(218, 198, 163, 0.1), transparent 70%);
  filter: blur(12px);
  animation: slow-drift 12s ease-in-out infinite;
}

.mist--one {
  top: 42%;
  left: -10%;
}

.mist--two {
  top: 24%;
  right: -8%;
  animation-delay: -5s;
}

.title-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(100% - 3rem, 1280px);
  margin: 0 auto;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(238, 225, 196, 0.12);
}

.title-top__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-kai);
  font-size: 1.05rem;
  letter-spacing: 0.24em;
}

.title-top__seal {
  width: 1.9rem;
  height: 1.9rem;
  font-size: 0.9rem;
}

.title-top__nav {
  display: flex;
  gap: 0.25rem;
}

.title-top .btn--ghost {
  --btn-color: rgba(238, 225, 196, 0.72);
}

.title-top .btn--ghost:hover:not(:disabled) {
  --btn-color: var(--paper-light);
  --btn-border: rgba(238, 225, 196, 0.16);
}

.nav-count {
  display: inline-grid;
  place-items: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.2rem;
  margin-left: 0.1rem;
  border: 1px solid rgba(238, 225, 196, 0.24);
  border-radius: 50%;
  font-size: 0.68rem;
  letter-spacing: 0;
}

.title-hero {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(21rem, 0.9fr);
  gap: clamp(2rem, 8vw, 8rem);
  align-items: center;
  width: min(100% - 3rem, 1180px);
  margin: auto;
  padding: clamp(3.4rem, 9vh, 7rem) 0 clamp(5rem, 12vh, 9rem);
}

.hero-copy {
  animation: fade-up 0.8s var(--page-turn-ease) both;
}

.hero-copy__eyebrow {
  margin-bottom: 1.2rem;
  color: rgba(196, 166, 108, 0.82);
  font-family: var(--font-kai);
  font-size: 0.82rem;
  letter-spacing: 0.4em;
}

.hero-title {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-weight: 400;
  line-height: 1;
}

.hero-title__main {
  font-size: clamp(4.5rem, 11vw, 8.5rem);
  font-family: var(--font-kai);
  letter-spacing: 0.08em;
  text-shadow: 0 12px 38px rgba(0, 0, 0, 0.3);
}

.hero-title__seal {
  display: inline-grid;
  place-items: center;
  width: clamp(2.3rem, 4vw, 3.5rem);
  height: clamp(2.3rem, 4vw, 3.5rem);
  margin-top: 0.65rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  box-shadow:
    inset 0 0 0 2px var(--cinnabar),
    inset 0 0 0 3px rgba(255, 246, 223, 0.46);
  font-family: var(--font-kai);
  font-size: clamp(1.2rem, 2.2vw, 1.8rem);
}

.hero-subtitle {
  margin-top: 1.1rem;
  color: rgba(238, 225, 196, 0.72);
  font-family: var(--font-kai);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  letter-spacing: 0.32em;
}

.hero-divider {
  display: flex;
  align-items: center;
  width: min(22rem, 72%);
  margin: 2rem 0;
}

.hero-divider::before,
.hero-divider::after {
  height: 1px;
  flex: 1;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(196, 166, 108, 0.4));
}

.hero-divider::after {
  background: linear-gradient(90deg, rgba(196, 166, 108, 0.4), transparent);
}

.hero-divider span {
  width: 0.38rem;
  height: 0.38rem;
  margin: 0 0.55rem;
  border: 1px solid rgba(196, 166, 108, 0.7);
  transform: rotate(45deg);
}

.hero-lede {
  max-width: 32rem;
  color: rgba(238, 225, 196, 0.66);
  font-size: clamp(0.92rem, 1.3vw, 1rem);
  line-height: 2.05;
  letter-spacing: 0.04em;
}

.hero-rules {
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  margin-top: 2.5rem;
}

.hero-rules div {
  min-width: 5rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(196, 166, 108, 0.3);
}

.hero-rules dt {
  color: rgba(196, 166, 108, 0.65);
  font-family: var(--font-kai);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
}

.hero-rules dd {
  margin: 0.22rem 0 0;
  color: rgba(238, 225, 196, 0.78);
  font-family: var(--font-kai);
  font-size: 0.9rem;
  letter-spacing: 0.06em;
}

.entry-panel {
  position: relative;
  padding: clamp(1.5rem, 3.5vw, 2.4rem);
  color: var(--ink);
  background-color: var(--paper);
  background-image:
    radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.55), transparent 32%),
    repeating-linear-gradient(
      92deg,
      rgba(97, 73, 43, 0.03) 0,
      rgba(97, 73, 43, 0.03) 1px,
      transparent 1px,
      transparent 5px
    );
  border: 1px solid var(--paper-edge);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.38),
    inset 0 0 0 6px rgba(255, 248, 231, 0.24),
    inset 0 0 50px rgba(112, 80, 42, 0.1);
  animation: fade-up 0.8s 0.12s var(--page-turn-ease) both;
}

.entry-panel::before {
  position: absolute;
  inset: 0.6rem;
  pointer-events: none;
  content: '';
  border: 1px solid rgba(122, 91, 48, 0.2);
}

.entry-panel__corner {
  position: absolute;
  z-index: 1;
  width: 1.8rem;
  height: 1.8rem;
  border-color: rgba(158, 48, 39, 0.48);
}

.entry-panel__corner--tl {
  top: 0.22rem;
  left: 0.22rem;
  border-top: 1px solid;
  border-left: 1px solid;
}

.entry-panel__corner--br {
  right: 0.22rem;
  bottom: 0.22rem;
  border-right: 1px solid;
  border-bottom: 1px solid;
}

.entry-panel__seal-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.entry-panel__seal {
  width: 2.55rem;
  height: 2.55rem;
  font-size: 1.1rem;
}

.entry-panel h2 {
  margin-top: 0.2rem;
  font-family: var(--font-kai);
  font-size: clamp(1.55rem, 3vw, 2rem);
  font-weight: 500;
  letter-spacing: 0.18em;
}

.entry-panel__intro {
  margin-top: 1.2rem;
  color: var(--ink-soft);
  font-size: 0.9rem;
  line-height: 1.8;
}

.era-form {
  margin-top: 1.4rem;
}

.era-label {
  display: block;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
}

.era-input-wrap {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-top: 0.5rem;
  padding: 0.25rem 0 0.55rem;
  border-bottom: 1px solid rgba(79, 67, 53, 0.32);
  transition: border-color 0.2s ease;
}

.era-input-wrap:focus-within {
  border-color: var(--cinnabar);
}

.era-input-wrap--error {
  border-color: var(--cinnabar);
}

.era-input {
  width: 100%;
  min-width: 0;
  padding: 0.2rem 0;
  color: var(--ink);
  background: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-kai);
  font-size: clamp(2rem, 4.3vw, 2.8rem);
  letter-spacing: 0.32em;
}

.era-input::placeholder {
  color: rgba(79, 67, 53, 0.23);
}

.era-suffix {
  flex: 0 0 auto;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.95rem;
}

.era-help {
  min-height: 1.4rem;
  margin-top: 0.45rem;
  color: var(--ink-faint);
  font-size: 0.76rem;
  line-height: 1.6;
}

.era-help--error {
  color: var(--cinnabar);
}

.era-examples {
  display: flex;
  gap: 0.45rem;
  margin: 0.65rem 0 1.2rem;
}

.era-example {
  padding: 0.18rem 0.6rem;
  color: var(--ink-faint);
  background: rgba(248, 239, 220, 0.42);
  border: 1px solid rgba(79, 67, 53, 0.16);
  border-radius: 40px;
  font-family: var(--font-kai);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.era-example:hover {
  color: var(--cinnabar);
  border-color: rgba(158, 48, 39, 0.36);
}

.entry-panel__start {
  min-height: 3.2rem;
  font-size: 1.06rem;
  letter-spacing: 0.24em;
}

.entry-panel__note {
  margin-top: 0.9rem;
  color: var(--ink-faint);
  font-size: 0.7rem;
  text-align: center;
}

.save-resume {
  margin-top: 1.5rem;
  padding-top: 1.15rem;
  border-top: 1px solid rgba(79, 67, 53, 0.16);
}

.save-resume__rule {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

.save-resume__rule::before,
.save-resume__rule::after {
  height: 1px;
  flex: 1;
  content: '';
  background: rgba(79, 67, 53, 0.15);
}

.save-resume__card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 0.9rem;
  background: rgba(255, 248, 231, 0.34);
  border: 1px solid rgba(79, 67, 53, 0.14);
}

.save-resume__copy {
  flex: 1;
  min-width: 0;
}

.save-resume__label {
  color: var(--ink);
  font-family: var(--font-kai);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

.save-resume__summary {
  margin-top: 0.18rem;
  overflow: hidden;
  color: var(--ink-soft);
  font-size: 0.78rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.save-resume__detail {
  margin-top: 0.12rem;
  color: var(--ink-faint);
  font-size: 0.7rem;
}

.save-resume__button {
  flex: 0 0 auto;
  min-height: 2.3rem;
  padding: 0.32rem 0.8rem;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.title-vertical {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: 1.6rem;
  transform: translateY(-50%);
  color: rgba(238, 225, 196, 0.2);
  font-family: var(--font-kai);
  font-size: 0.78rem;
  letter-spacing: 0.5em;
  writing-mode: vertical-rl;
}

.title-foot {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.2rem 1rem calc(1.2rem + env(safe-area-inset-bottom));
  color: rgba(238, 225, 196, 0.32);
  font-family: var(--font-kai);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
}

.title-foot__dot {
  width: 3px;
  height: 3px;
  background: rgba(196, 166, 108, 0.5);
  border-radius: 50%;
}

@media (max-width: 980px) {
  .title-hero {
    grid-template-columns: 1fr;
    gap: 3rem;
    max-width: 40rem;
    padding-top: 3rem;
  }

  .hero-title__main {
    font-size: clamp(4.4rem, 18vw, 7rem);
  }

  .entry-panel {
    max-width: 32rem;
    width: 100%;
    justify-self: center;
  }

  .title-vertical {
    display: none;
  }

  .mountain-range {
    height: 36vh;
  }
}

@media (max-width: 640px) {
  .title-top {
    width: calc(100% - 2rem);
    padding: 1rem 0;
  }

  .title-top__brand {
    font-size: 0.9rem;
    letter-spacing: 0.16em;
  }

  .title-top__seal {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 0.76rem;
  }

  .title-top__nav .btn {
    min-height: 2.2rem;
    padding: 0.25rem 0.35rem;
    font-size: 0.78rem;
  }

  .nav-count {
    min-width: 1.35rem;
    height: 1.35rem;
    font-size: 0.62rem;
  }

  .title-hero {
    width: calc(100% - 2rem);
    padding: 2.3rem 0 3.5rem;
  }

  .hero-lede br {
    display: none;
  }

  .hero-rules {
    gap: 1rem;
    margin-top: 1.8rem;
  }

  .entry-panel {
    padding: 1.5rem 1.25rem;
  }

  .entry-panel h2 {
    font-size: 1.5rem;
  }

  .save-resume__card {
    align-items: stretch;
    flex-direction: column;
    gap: 0.7rem;
  }

  .save-resume__button {
    width: 100%;
  }

  .save-resume__summary {
    white-space: normal;
  }

  .sun-disc {
    top: 10%;
    right: 8%;
  }

  .title-foot {
    font-size: 0.62rem;
  }
}

@media (max-width: 460px) {
  .title-top {
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .title-top__nav {
    width: 100%;
    justify-content: space-between;
  }

  .title-top__nav .btn {
    flex: 1 1 auto;
  }
}
</style>

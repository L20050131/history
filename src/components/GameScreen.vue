<script setup lang="ts">
import { computed } from 'vue'
import DeltaList from './DeltaList.vue'
import ResourceGauge from './ResourceGauge.vue'
import {
  ANNUAL_MARK_META,
  CATEGORY_META,
  ENDING_META,
  OFFICES,
  RESOURCE_META,
  RESOURCE_ORDER,
} from '@/game/content'
import {
  formatEraYear,
  formatFullDate,
  getAdvisorYearEndEffect,
  toneLabel,
  yearGanzhi,
} from '@/game/engine'
import type { Advisor, Session } from '@/game/types'

const props = defineProps<{ session: Session }>()

const emit = defineEmits<{
  choose: [optionId: string]
  skip: []
  next: []
  suspend: []
  rules: []
}>()

const event = computed(() => props.session.currentEvent)
const outcome = computed(() => props.session.outcome)
const summary = computed(() => props.session.yearSummary)
const advisors = computed(() => props.session.advisors)

function advisorOffice(advisor: Advisor) {
  return OFFICES.find((item) => item.id === advisor.office) ?? null
}

function advisorYearEffect(advisor: Advisor) {
  return getAdvisorYearEndEffect(advisor)
}

const courtLine = computed(() =>
  advisors.value.length > 0
    ? advisors.value
        .map((advisor) => `${advisor.name}${advisor.legacy ? '（旧臣）' : ''} · ${advisorOffice(advisor)?.office ?? '待职'}`)
        .join(' ／ ')
    : '乾纲独断 · 未设辅臣',
)
const actionPoints = computed(() => props.session.actionPoints ?? 3)
const canAct = computed(() => actionPoints.value > 0)

const pageKey = computed(() => {
  if (props.session.reignPage === 'yearEnd') return `year-end-${props.session.currentYear}`
  if (props.session.reignPage === 'outcome') {
    return `outcome-${props.session.currentYear}-${props.session.quarter}-${props.session.outcome?.choiceLabel ?? ''}`
  }
  return `event-${props.session.currentYear}-${props.session.quarter}-${props.session.currentEvent?.occurrenceId ?? ''}`
})

const seasonList = computed(() =>
  [
    { label: '春', quarter: 1 },
    { label: '夏', quarter: 2 },
    { label: '秋', quarter: 3 },
    { label: '冬', quarter: 4 },
  ].map((season) => ({
    ...season,
    state:
      props.session.reignPage === 'yearEnd' || props.session.quarter > season.quarter
        ? 'done'
        : props.session.quarter === season.quarter
          ? 'current'
          : 'upcoming',
  })),
)

const dateText = computed(() => {
  if (props.session.reignPage === 'yearEnd') {
    return `岁次${yearGanzhi(props.session)} · 冬尽岁末`
  }
  if (props.session.currentEvent) {
    return formatFullDate(props.session, props.session.currentEvent.date)
  }
  return `${formatEraYear(props.session)}`
})

const omenHint = computed(() => {
  const current = event.value
  if (!current) return ''
  if (current.source === 'chain') return '史鉴之事不系日辰吉凶，选项固定，亦不计入当年岁评。'
  if (current.funeral)
    return '先皇葬仪，国丧之际，不系日辰吉凶，亦不入岁评；此礼一朝仅此一遇。'
  if (current.bond) return '两代辅臣交章，不系日辰吉凶，一朝仅此一遇，亦不入岁评。'
  if (current.source === 'special')
    return '异闻不系日辰吉凶，一朝仅此一遇；其中某些抉择会直接落定国祚。'
  if (current.omen === '吉') return '日辰为吉：选择激进之策，其正面效用增加五成。'
  if (current.omen === '凶') return '日辰为凶：选择保守之策，其负面效用减半。'
  return '日辰平常：诸策效果一如其述，请自行权衡。'
})

const omenClass = computed(() => {
  const current = event.value
  if (!current) return ''
  if (current.source === 'chain') return 'omen-badge--history'
  if (current.funeral) return 'omen-badge--funeral'
  if (current.bond) return 'omen-badge--bond'
  if (current.source === 'special') return 'omen-badge--special'
  if (current.omen === '吉') return 'omen-badge--good'
  if (current.omen === '凶') return 'omen-badge--bad'
  return 'omen-badge--plain'
})

const markMeta = computed(() =>
  summary.value ? ANNUAL_MARK_META[summary.value.mark] : ANNUAL_MARK_META['平'],
)

const pendingLabel = computed(() =>
  props.session.pendingEnding ? ENDING_META[props.session.pendingEnding].label : '',
)

const endingWarningTitle = computed(() =>
  outcome.value?.endingCause === 'event' ? '此择已定国祚' : '国势已越临界',
)

const nextLabel = computed(() => {
  if (props.session.reignPage === 'yearEnd') {
    return props.session.pendingEnding ? '下一页 · 国祚终局' : '翻至下一页'
  }
  if (props.session.pendingEnding) return '下一页 · 国祚终局'
  if (props.session.quarter === 4) return '下一页 · 岁末史评'
  return '下一页'
})

const yearEndingNote = computed(() =>
  props.session.reignPage === 'yearEnd' && props.session.pendingEnding === 'mediocrity'
    ? '庸年已逾在位之半，史官将合本纪。'
    : '',
)

function weightText(value: number | null): string {
  if (value === null) return ''
  return `${value > 0 ? '+' : ''}${value}`
}

function resourceDelta(key: (typeof RESOURCE_ORDER)[number]) {
  const current = outcome.value
  if (!current) return 0
  return (current.after[key] ?? 0) - (current.before[key] ?? 0)
}
</script>

<template>
  <div class="game-screen">
    <header class="court-header">
      <div class="court-header__brand">
        <span class="seal-mark">山</span>
        <div>
          <p class="eyebrow">{{ session.eraName }}朝 · 第{{ session.generation }}世</p>
          <h1>山河纪</h1>
        </div>
      </div>
      <div class="court-header__meta">
        <span>{{ formatEraYear(session) }}</span>
        <span class="court-header__dot"></span>
        <span class="court-header__actions-points" :class="{ 'is-empty': !canAct }">
          行动点 {{ actionPoints }}
        </span>
        <span class="court-header__dot"></span>
        <span>
          {{ advisors.length ? `辅臣 ${advisors.map((item) => item.name).join('、')}` : '乾纲独断' }}
        </span>
      </div>
      <div class="court-header__actions">
        <button class="btn btn--quiet" type="button" @click="emit('rules')">要略</button>
        <button class="btn btn--quiet" type="button" @click="emit('suspend')">暂离</button>
      </div>
    </header>

    <div class="court-strip" aria-label="国势">
      <div class="court-strip__season">
        <p class="eyebrow">四时朝议</p>
        <div class="season-track">
          <span
            v-for="season in seasonList"
            :key="season.quarter"
            class="season-pip"
            :class="`season-pip--${season.state}`"
          >
            {{ season.label }}
          </span>
        </div>
      </div>
      <div class="court-strip__gauges">
        <ResourceGauge
          v-for="key in RESOURCE_ORDER"
          :key="key"
          :resource-key="key"
          :value="session.resources[key]"
          compact
        />
      </div>
    </div>

    <main class="book">
      <aside class="book-left paper-texture" aria-label="朝局概览">
        <div class="book-left__head">
          <p class="eyebrow">国势录</p>
          <h2>本朝纪要</h2>
        </div>

        <div class="book-left__date">
          <span class="book-left__year">{{ formatEraYear(session) }}</span>
          <span>岁次{{ yearGanzhi(session) }}</span>
        </div>

        <div class="book-left__section">
          <h3>四时</h3>
          <div class="season-list">
            <div
              v-for="season in seasonList"
              :key="season.quarter"
              class="season-line"
              :class="`season-line--${season.state}`"
            >
              <span class="season-line__mark"></span>
              <span>{{ ['孟春之议', '孟夏之议', '孟秋之议', '孟冬之议'][season.quarter - 1] }}</span>
              <span class="season-line__state">
                {{ season.state === 'done' ? '已议' : season.state === 'current' ? '当下' : '未至' }}
              </span>
            </div>
          </div>
        </div>

        <div class="book-left__section">
          <h3>辅臣</h3>
          <div v-if="advisors.length" class="minister-list">
            <div v-for="advisor in advisors" :key="advisor.id" class="minister-card">
              <div class="minister-card__top">
                <span class="minister-card__avatar">{{ advisor.avatar }}</span>
                <div>
                  <p class="minister-card__name">
                    {{ advisor.name }}
                    <span v-if="advisor.legacy" class="minister-card__legacy">前朝旧臣</span>
                  </p>
                  <p class="minister-card__office">
                    {{
                      advisorOffice(advisor)
                        ? `${advisorOffice(advisor)?.rank} · ${advisorOffice(advisor)?.office}`
                        : '待职'
                    }}
                  </p>
                </div>
              </div>
              <p class="minister-card__quote">{{ advisor.trait }}</p>
              <div class="minister-card__ability">
                <span class="minister-card__ability-seal">{{ advisor.ability.seal }}</span>
                <div>
                  <strong>{{ advisor.ability.name }}</strong>
                  <p>{{ advisor.ability.description }}</p>
                </div>
              </div>
              <div class="minister-card__effect">
                <span>岁末考成{{ advisor.legacy ? ' · 旧臣加半' : '' }}</span>
                <DeltaList :delta="advisorYearEffect(advisor)" size="sm" empty-label="无" />
              </div>
            </div>
          </div>
          <div v-else class="no-minister">
            <span class="no-minister__seal">独</span>
            <p>未设辅臣。朝政尽决于御笔，亦无岁末考成之增益。</p>
          </div>
        </div>

        <div class="book-left__section book-left__section--log">
          <h3>本岁已议</h3>
          <div v-if="session.yearLog.length" class="mini-log">
            <p v-for="(entry, index) in session.yearLog" :key="`${entry.title}-${index}`">
              <span>{{ entry.decision }}</span>
              <em>{{ entry.title }}</em>
            </p>
          </div>
          <p v-else class="mini-log__empty">尚无决断。</p>
        </div>

        <div class="book-left__foot">
          <span class="book-left__save-dot"></span>
          墨迹自动录入本卷
        </div>
      </aside>

      <section class="book-page paper-texture" aria-live="polite">
        <div class="book-page__binding" aria-hidden="true"></div>
        <header class="folio-head">
          <div>
            <p class="eyebrow">{{ session.reignPage === 'yearEnd' ? '岁末 · 史官录' : '朝议 · 御前' }}</p>
            <p class="folio-head__date">{{ dateText }}</p>
            <p class="folio-head__court">{{ courtLine }}</p>
          </div>
          <div class="folio-head__right">
            <span
              v-if="event"
              class="omen-badge"
              :class="omenClass"
            >
              <template v-if="event.funeral">国丧</template>
              <template v-else-if="event.bond">朝局</template>
              <template v-else-if="event.source === 'chain'">史鉴</template>
              <template v-else-if="event.source === 'special'">异闻</template>
              <template v-else>日辰 · {{ event.omen }}</template>
            </span>
            <span v-else-if="summary" class="mark-mini" :style="{ color: markMeta.color }">{{ summary.mark }}</span>
            <span class="folio-head__page">第{{ session.quarter }}页</span>
          </div>
        </header>

        <Transition name="page-turn" mode="out-in">
          <div :key="pageKey" class="folio-body">
            <!-- 事件 -->
            <article v-if="session.reignPage === 'event' && event" class="event-page">
              <div class="event-kicker">
                <span
                  class="category-seal"
                  :style="{ backgroundColor: CATEGORY_META[event.category].accent }"
                >
                  {{ CATEGORY_META[event.category].seal }}
                </span>
                <span>{{ event.categoryLabel }}</span>
                <span class="kicker-divider"></span>
                <span v-if="event.funeral" class="special-tag special-tag--funeral">国丧 · 山陵大事</span>
                <span v-else-if="event.bond" class="special-tag">朝局 · 两代交章</span>
                <span v-else-if="event.chain" class="history-tag">史鉴 · {{ event.chain.name }}</span>
                <span v-else-if="event.source === 'special'" class="special-tag">异闻 · 仅此一遇</span>
                <span v-else>日常朝政</span>
              </div>

              <h2 class="event-title">{{ event.title }}</h2>
              <p class="event-subtitle">{{ event.subtitle }}</p>

              <div class="event-narrative">
                <p v-for="(paragraph, index) in event.narrative.split(/\n+/)" :key="index">
                  {{ paragraph }}
                </p>
              </div>

              <div v-if="event.voices.length" class="event-voices">
                <p v-for="(voice, index) in event.voices" :key="index">
                  <span>{{ voice.label }}</span>
                  {{ voice.text }}
                </p>
              </div>

              <div
                class="omen-note"
                :class="{
                  'omen-note--history': event.source === 'chain',
                  'omen-note--special': event.source === 'special',
                  'omen-note--bond': event.bond,
                  'omen-note--funeral': event.funeral,
                }"
              >
                <span class="omen-note__mark">
                  {{
                    event.funeral
                      ? '丧'
                      : event.bond
                        ? '朝'
                        : event.source === 'chain'
                        ? '鉴'
                        : event.source === 'special'
                          ? '异'
                          : event.omen
                  }}
                </span>
                <p>{{ omenHint }}</p>
              </div>

              <div v-if="event.source === 'chain'" class="chain-progress">
                <span>事件链 · {{ event.chain?.name }}</span>
                <span>第 {{ event.chain?.step }} / {{ event.chain?.steps }} 节</span>
                <span>改编自{{ event.chain?.inspiration }}</span>
              </div>

              <div class="option-list" role="group" aria-label="事件选项">
                <button
                  v-for="(option, index) in event.options"
                  :key="option.id"
                  class="option-card"
                  :class="{ 'option-card--advisor': option.isAdvisor }"
                  type="button"
                  :disabled="Boolean(outcome) || !canAct"
                  @click="emit('choose', option.id)"
                >
                  <span class="option-card__index">{{ ['甲', '乙', '丙', '丁'][index] ?? '·' }}</span>
                  <span class="option-card__body">
                    <span class="option-card__title-row">
                      <strong>{{ option.label }}</strong>
                      <span v-if="option.isAdvisor" class="option-card__counsel-tag">辅臣进言</span>
                    </span>
                    <span class="option-card__desc">{{ option.description }}</span>
                  </span>
                  <span class="option-card__arrow" aria-hidden="true">→</span>
                </button>
              </div>
              <p class="option-hidden-note">
                诸策利害不预书，择定之后，于本季总变中见之。
                {{ canAct ? `今岁尚有 ${actionPoints} 点行动。` : '行动点已尽，本季只可搁置。' }}
              </p>

              <footer class="event-actions">
                <p>
                  <template v-if="event.funeral">先皇葬仪，一朝仅此一遇；此礼不入岁评，亦不受日辰所扰。</template>
                  <template v-else-if="event.bond">两代辅臣交章，一朝仅此一遇；此议不入岁评。</template>
                  <template v-else-if="event.source === 'chain'">搁置此事，将使此事件链就此中止；不系岁评。</template>
                  <template v-else-if="event.source === 'special'">异闻仅此一遇；若择定其中某条道路，翻页后即入终卷。</template>
                  <template v-else>本季时运仍会结算；若全年诸事尽搁，岁评将为「庸」。</template>
                </p>
                <button class="btn btn--quiet" type="button" @click="emit('skip')">搁置此事</button>
              </footer>
            </article>

            <!-- 结果 -->
            <article v-else-if="session.reignPage === 'outcome' && outcome" class="outcome-page">
              <div class="outcome-heading">
                <span class="outcome-heading__seal">批</span>
                <div>
                  <p class="eyebrow">
                    {{
                      outcome.funeral
                        ? '国丧余响'
                        : outcome.bond
                          ? '朝局回响'
                          : outcome.source === 'chain'
                            ? '史鉴回响'
                            : outcome.source === 'special'
                              ? '异闻回响'
                              : '御笔既下'
                    }}
                  </p>
                  <h2>{{ outcome.skipped ? '此事暂寝' : '诏令已行' }}</h2>
                </div>
                <span v-if="outcome.choiceTone" class="outcome-heading__tone">
                  {{ toneLabel(outcome.choiceTone) }}
                </span>
              </div>

              <div class="outcome-choice">
                <span class="outcome-choice__label">决断</span>
                <strong>{{ outcome.choiceLabel }}</strong>
                <span v-if="outcome.choiceIsAdvisor" class="outcome-choice__advisor">辅臣进言</span>
                <span class="outcome-choice__title">《{{ outcome.title }}》</span>
                <span
                  v-if="outcome.choiceWeight !== null"
                  class="outcome-choice__weight"
                  :class="outcome.choiceWeight >= 0 ? 'is-good' : 'is-bad'"
                >
                  政绩 {{ weightText(outcome.choiceWeight) }}
                </span>
              </div>

              <div v-if="outcome.twist" class="outcome-twist" :class="`outcome-twist--${outcome.twist}`">
                <span class="outcome-twist__mark">{{ outcome.twist === 'good' ? '顺' : '逆' }}</span>
                <p>
                  {{ outcome.twist === 'good' ? '此番施为顺遂，正面效用增、负面效用减。' : '此番施为多生波折，正面效用减、负面效用增。' }}
                </p>
              </div>

              <p class="outcome-narrative">{{ outcome.narrative }}</p>

              <p v-if="outcome.decline" class="outcome-decline">
                <span>积弊</span>
                承继之朝，前朝积弊未除，本策的危害比往昔更重。
              </p>

              <div class="outcome-total">
                <div class="outcome-total__head">
                  <span>本季国势总变</span>
                  <DeltaList :delta="outcome.totalEffect" empty-label="国势未见增减" />
                </div>
                <div class="resource-shift">
                  <div v-for="key in RESOURCE_ORDER" :key="key" class="resource-shift__item">
                    <span class="resource-shift__seal">{{ RESOURCE_META[key].seal }}</span>
                    <span class="resource-shift__label">{{ RESOURCE_META[key].label }}</span>
                    <span class="resource-shift__values">
                      {{ outcome.before[key] }}
                      <span class="resource-shift__arrow">→</span>
                      <strong>{{ outcome.after[key] }}</strong>
                    </span>
                    <span
                      v-if="resourceDelta(key)"
                      class="resource-shift__delta"
                      :class="resourceDelta(key) > 0 ? 'is-up' : 'is-down'"
                    >
                      {{ resourceDelta(key) > 0 ? '+' : '' }}{{ resourceDelta(key) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="breakdown">
                <div v-if="!outcome.skipped || outcome.funeral" class="breakdown__row">
                  <span class="breakdown__label">{{ outcome.skipped ? '搁置' : '决断' }}</span>
                  <DeltaList :delta="outcome.effect" size="sm" empty-label="无" />
                </div>
                <div
                  v-if="outcome.fortune.boon || outcome.fortune.bane"
                  class="breakdown__fortune"
                >
                  <div class="breakdown__fortune-head">
                    <span class="breakdown__label">本季时运</span>
                    <span class="breakdown__mood" :class="`breakdown__mood--${outcome.fortune.mood}`">
                      {{ outcome.fortune.mood === 'mixed' ? '吉凶相随' : '阴霾独至' }}
                    </span>
                  </div>
                  <div v-if="outcome.fortune.boon" class="fortune-line fortune-line--good">
                    <div>
                      <strong>{{ outcome.fortune.boon.label }}</strong>
                      <p>{{ outcome.fortune.boon.text }}</p>
                    </div>
                    <DeltaList :delta="outcome.fortune.boon.effects" size="sm" />
                  </div>
                  <div v-if="outcome.fortune.bane" class="fortune-line fortune-line--bad">
                    <div>
                      <strong>{{ outcome.fortune.bane.label }}</strong>
                      <p>{{ outcome.fortune.bane.text }}</p>
                    </div>
                    <DeltaList :delta="outcome.fortune.bane.effects" size="sm" />
                  </div>
                </div>
                <p v-else class="breakdown__calm">本季天时平顺，未起额外风波。</p>

                <div v-if="outcome.advisorEffect" class="breakdown__row breakdown__row--advisor">
                  <span class="breakdown__label">岁末考成 · {{ outcome.advisorName }}</span>
                  <DeltaList :delta="outcome.advisorEffect" size="sm" empty-label="无" />
                </div>
                <p v-if="outcome.source === 'chain' && outcome.skipped" class="breakdown__chain-end">
                  事件链因搁置而中止。
                </p>
                <p v-if="outcome.source === 'chain' && !outcome.skipped && outcome.chainContinues" class="breakdown__chain-end">
                  史鉴之事尚未落幕，后续将自行展开。
                </p>
              </div>

              <div v-if="outcome.pendingEnding" class="ending-warning">
                <span class="ending-warning__seal">{{ ENDING_META[outcome.pendingEnding].seal }}</span>
                <div>
                  <strong>{{ endingWarningTitle }}</strong>
                  <p>此局将结，国祚终局为「{{ pendingLabel }}」。翻至下一页，听史官落笔。</p>
                </div>
              </div>

              <footer class="folio-actions">
                <span class="folio-actions__hint">{{ formatEraYear(session) }} · {{ ['春', '夏', '秋', '冬'][session.quarter - 1] }}季已决</span>
                <button class="btn btn--primary" type="button" @click="emit('next')">
                  {{ nextLabel }}
                  <span aria-hidden="true">→</span>
                </button>
              </footer>
            </article>

            <!-- 岁评 -->
            <article v-else-if="session.reignPage === 'yearEnd' && summary" class="year-page">
              <div class="year-heading">
                <div>
                  <p class="eyebrow">岁末 · 御前考成</p>
                  <h2>本年史评</h2>
                  <p class="year-heading__sub">本岁朝议 {{ summary.dailyTotal }} 件，搁置 {{ summary.skipped }} 件，史官谨上岁评。</p>
                </div>
                <div class="year-mark" :style="{ '--mark-color': markMeta.color }">
                  <span>{{ summary.mark }}</span>
                  <em>评</em>
                </div>
              </div>

              <div class="year-stats">
                <div>
                  <span>本岁朝议</span>
                  <strong>{{ summary.dailyTotal }} 件</strong>
                </div>
                <div>
                  <span>搁置未决</span>
                  <strong>{{ summary.skipped }} 件</strong>
                </div>
                <div>
                  <span>本岁政绩</span>
                  <strong>{{ weightText(summary.score) }}</strong>
                </div>
                <div>
                  <span>史鉴与异闻</span>
                  <strong>不计岁评</strong>
                </div>
              </div>

              <div class="year-deltas">
                <div class="year-deltas__head">
                  <h3>国势岁变</h3>
                  <DeltaList :delta="summary.deltas" empty-label="本年国势持平" />
                </div>
                <p v-if="summary.advisorNote" class="year-deltas__advisor">{{ summary.advisorNote }}</p>
              </div>

              <div class="year-events">
                <h3>四时纪要</h3>
                <ul>
                  <li
                    v-for="(entry, index) in summary.events"
                    :key="`${entry.title}-${index}`"
                    :class="{ 'is-skipped': entry.skipped }"
                  >
                    <span class="year-event__index">{{ ['壹', '贰', '叁', '肆'][index] }}</span>
                    <span class="year-event__main">
                      <strong>{{ entry.title }}</strong>
                      <em>
                        {{ entry.categoryLabel }} ·
                        {{
                          entry.funeral
                            ? '国丧不计评'
                            : entry.source === 'chain'
                              ? '史鉴不计评'
                              : entry.source === 'special'
                                ? entry.categoryLabel === '朝局'
                                  ? '朝局不计评'
                                  : '异闻不计评'
                                : entry.decline
                                  ? '朝政 · 积弊'
                                  : '朝政'
                        }}
                      </em>
                    </span>
                    <span
                      v-if="entry.weight !== null"
                      class="year-event__weight"
                      :class="entry.weight >= 0 ? 'is-good' : 'is-bad'"
                    >
                      {{ weightText(entry.weight) }}
                    </span>
                    <span class="year-event__decision">{{ entry.decision }}</span>
                  </li>
                </ul>
              </div>

              <div class="year-verdict">
                <span class="year-verdict__label">史官按</span>
                <p>{{ summary.remark }}</p>
              </div>

              <div v-if="yearEndingNote" class="year-ending-warning">
                <span class="year-ending-warning__seal">庸</span>
                <div>
                  <strong>本纪将合</strong>
                  <p>{{ yearEndingNote }}翻至下一页，听史官落笔。</p>
                </div>
              </div>

              <footer class="folio-actions">
                <span class="folio-actions__hint">四时既尽，待启新岁</span>
                <button class="btn btn--primary" type="button" @click="emit('next')">
                  {{ nextLabel }}
                  <span aria-hidden="true">→</span>
                </button>
              </footer>
            </article>

            <p v-else class="fallback-page">卷页暂空。</p>
          </div>
        </Transition>
      </section>
    </main>

    <footer class="game-foot">
      <span>日辰有吉凶，人事有取舍</span>
      <span class="game-foot__dot"></span>
      <span>本卷自动录于本地</span>
    </footer>
  </div>
</template>

<style scoped>
.game-screen {
  min-height: 100svh;
  padding-bottom: 1.2rem;
  color: var(--paper-light);
  background:
    radial-gradient(circle at 78% -6%, rgba(184, 137, 75, 0.13), transparent 30rem),
    radial-gradient(circle at 8% 100%, rgba(74, 86, 69, 0.12), transparent 30rem),
    linear-gradient(150deg, #211b15, #17130f 55%, #1d1711);
}

.court-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(100% - 2.5rem, 1240px);
  margin: 0 auto;
  padding: 1rem 0 0.8rem;
}

.court-header__brand {
  display: flex;
  align-items: center;
  gap: 0.72rem;
}

.court-header__brand .seal-mark {
  width: 2rem;
  height: 2rem;
  font-size: 0.82rem;
}

.court-header__brand .eyebrow {
  color: rgba(196, 166, 108, 0.65);
  font-size: 0.62rem;
}

.court-header__brand h1 {
  margin-top: 0.05rem;
  font-family: var(--font-kai);
  font-size: 1.15rem;
  font-weight: 400;
  letter-spacing: 0.3em;
}

.court-header__meta {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(238, 225, 196, 0.52);
  font-family: var(--font-kai);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.court-header__dot,
.game-foot__dot {
  width: 3px;
  height: 3px;
  background: rgba(196, 166, 108, 0.5);
  border-radius: 50%;
}

.court-header__actions {
  display: flex;
  gap: 0.2rem;
}

.court-header__actions .btn--quiet {
  color: rgba(238, 225, 196, 0.5);
}

.court-header__actions .btn--quiet:hover {
  color: var(--paper-light);
}

.court-strip {
  display: flex;
  align-items: stretch;
  gap: 1rem;
  width: min(100% - 2.5rem, 1240px);
  margin: 0 auto 0.8rem;
  padding: 0.55rem 0.65rem;
  border-top: 1px solid rgba(238, 225, 196, 0.1);
  border-bottom: 1px solid rgba(238, 225, 196, 0.1);
}

.court-strip__season {
  flex: 0 0 8.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.22rem;
  padding-right: 0.9rem;
  border-right: 1px solid rgba(238, 225, 196, 0.1);
}

.court-strip__season .eyebrow {
  color: rgba(196, 166, 108, 0.6);
  font-size: 0.55rem;
  letter-spacing: 0.18em;
}

.season-track {
  display: flex;
  gap: 0.28rem;
}

.season-pip {
  display: grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  color: rgba(238, 225, 196, 0.34);
  border: 1px solid rgba(238, 225, 196, 0.12);
  font-family: var(--font-kai);
  font-size: 0.62rem;
  line-height: 1;
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background-color 0.3s ease;
}

.season-pip--done {
  color: rgba(238, 225, 196, 0.6);
  border-color: rgba(238, 225, 196, 0.2);
}

.season-pip--current {
  color: var(--paper-light);
  background: var(--cinnabar);
  border-color: var(--cinnabar);
}

.season-pip--upcoming {
  opacity: 0.65;
}

.court-strip__gauges {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45rem;
  min-width: 0;
}

.court-strip__gauges :deep(.gauge) {
  background: rgba(238, 225, 196, 0.05);
  border-color: rgba(238, 225, 196, 0.1);
}

.court-strip__gauges :deep(.gauge__label) {
  color: rgba(238, 225, 196, 0.65);
}

.court-strip__gauges :deep(.gauge__value) {
  color: var(--paper-light);
}

.court-strip__gauges :deep(.gauge__track) {
  background: rgba(238, 225, 196, 0.1);
}

.book {
  display: grid;
  grid-template-columns: 17rem minmax(0, 1fr);
  gap: 0;
  width: min(100% - 2.5rem, 1240px);
  min-height: min(70vh, 52rem);
  margin: 0 auto;
  border: 1px solid var(--paper-edge);
  border-radius: 2px;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.42),
    0 2px 0 rgba(255, 247, 228, 0.12);
}

.book-left {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 1.4rem 1.25rem 1.1rem;
  color: var(--ink);
  border-right: 1px solid rgba(122, 91, 48, 0.22);
  box-shadow: inset -18px 0 30px -24px rgba(55, 38, 19, 0.55);
}

.book-left::after {
  position: absolute;
  top: 0;
  right: -1px;
  bottom: 0;
  width: 3px;
  content: '';
  background: linear-gradient(90deg, rgba(83, 57, 27, 0.12), transparent);
}

.book-left__head h2 {
  margin-top: 0.1rem;
  font-family: var(--font-kai);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.book-left__date {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.8rem;
  padding-bottom: 0.8rem;
  color: var(--ink-faint);
  border-bottom: 1px solid rgba(79, 67, 53, 0.14);
  font-family: var(--font-kai);
  font-size: 0.68rem;
}

.book-left__year {
  color: var(--cinnabar);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
}

.book-left__section {
  padding-top: 0.9rem;
}

.book-left__section h3 {
  margin-bottom: 0.55rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.18em;
}

.season-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.season-line {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  color: var(--ink-faint);
  font-size: 0.7rem;
}

.season-line--done {
  color: var(--ink-soft);
}

.season-line--current {
  color: var(--cinnabar);
  font-weight: 600;
}

.season-line__mark {
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.55;
}

.season-line__state {
  margin-left: auto;
  font-size: 0.62rem;
  opacity: 0.75;
}

.minister-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.minister-card {
  padding: 0.65rem;
  background: rgba(255, 247, 230, 0.4);
  border: 1px solid rgba(79, 67, 53, 0.12);
}

.minister-card__legacy {
  margin-left: 0.3rem;
  padding: 0.02rem 0.28rem;
  color: var(--cinnabar);
  border: 1px solid rgba(158, 48, 39, 0.3);
  font-family: var(--font-kai);
  font-size: 0.55rem;
  letter-spacing: 0.04em;
  vertical-align: middle;
}

.minister-card__top {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.minister-card__avatar {
  display: grid;
  place-items: center;
  width: 2.15rem;
  height: 2.15rem;
  color: var(--paper-light);
  background: var(--ink);
  font-family: var(--font-kai);
  font-size: 1rem;
}

.minister-card__name {
  font-family: var(--font-kai);
  font-size: 0.87rem;
  line-height: 1.3;
}

.minister-card__office {
  color: var(--ink-faint);
  font-size: 0.62rem;
}

.minister-card__quote {
  margin-top: 0.45rem;
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.66rem;
  line-height: 1.65;
}

.minister-card__effect {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding-top: 0.45rem;
  border-top: 1px dashed rgba(79, 67, 53, 0.16);
}

.minister-card__effect > span {
  color: var(--ink-faint);
  font-size: 0.6rem;
}

.no-minister {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--ink-faint);
}

.no-minister__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.45rem;
  height: 1.45rem;
  color: var(--cinnabar);
  border: 1px solid rgba(158, 48, 39, 0.3);
  font-family: var(--font-kai);
  font-size: 0.65rem;
}

.no-minister p {
  font-size: 0.66rem;
  line-height: 1.65;
}

.mini-log {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mini-log p {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  color: var(--ink-soft);
  font-size: 0.66rem;
  line-height: 1.45;
}

.mini-log p span {
  flex: 0 0 auto;
  color: var(--cinnabar);
  font-family: var(--font-kai);
}

.mini-log p em {
  overflow: hidden;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-log__empty {
  color: var(--ink-faint);
  font-size: 0.66rem;
}

.book-left__foot {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 1rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.58rem;
}

.book-left__save-dot {
  width: 4px;
  height: 4px;
  background: var(--jade);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(80, 103, 86, 0.1);
}

.book-page {
  position: relative;
  min-width: 0;
  padding: 1.35rem 2rem 1.5rem;
  color: var(--ink);
  box-shadow:
    inset 20px 0 35px -28px rgba(55, 38, 19, 0.5),
    inset 0 0 60px rgba(109, 77, 41, 0.07);
}

.book-page__binding {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 8px;
  background: linear-gradient(90deg, rgba(75, 52, 26, 0.14), transparent);
  pointer-events: none;
}

.folio-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(79, 67, 53, 0.18);
}

.folio-head .eyebrow {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
}

.folio-head__date {
  margin-top: 0.22rem;
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
}

.folio-head__court {
  display: none;
  margin-top: 0.2rem;
  color: var(--ink-faint);
  font-size: 0.63rem;
}

.folio-head__right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.folio-head__page {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.62rem;
}

.omen-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.12rem 0.48rem;
  border: 1px solid rgba(79, 67, 53, 0.22);
  font-family: var(--font-kai);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
}

.omen-badge--good {
  color: var(--jade-deep);
  background: rgba(80, 103, 86, 0.08);
  border-color: rgba(80, 103, 86, 0.32);
}

.omen-badge--bad {
  color: var(--cinnabar-deep);
  background: rgba(158, 48, 39, 0.07);
  border-color: rgba(158, 48, 39, 0.3);
}

.omen-badge--plain {
  color: var(--ink-faint);
  background: rgba(255, 247, 230, 0.3);
}

.omen-badge--history {
  color: var(--gold);
  background: rgba(165, 129, 69, 0.08);
  border-color: rgba(165, 129, 69, 0.32);
}

.omen-badge--special {
  color: var(--cinnabar);
  background: rgba(158, 48, 39, 0.06);
  border-color: rgba(158, 48, 39, 0.3);
}

.omen-badge--bond {
  color: var(--jade-deep);
  background: rgba(80, 103, 86, 0.08);
  border-color: rgba(80, 103, 86, 0.32);
}

.omen-badge--funeral {
  color: var(--paper-light);
  background: var(--ink-soft);
  border-color: var(--ink-soft);
}

.mark-mini {
  display: grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  border: 1px solid currentColor;
  font-family: var(--font-kai);
  font-size: 0.88rem;
  line-height: 1;
}

.folio-body {
  padding-top: 1.1rem;
}

.event-kicker {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}

.category-seal {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--paper-light);
  font-family: var(--font-kai);
  font-size: 0.7rem;
}

.kicker-divider {
  width: 1px;
  height: 0.75rem;
  margin: 0 0.1rem;
  background: rgba(79, 67, 53, 0.26);
}

.history-tag {
  color: var(--gold);
}

.special-tag {
  color: var(--cinnabar);
}

.special-tag--funeral {
  color: var(--ink-soft);
  letter-spacing: 0.12em;
}

.event-title {
  margin-top: 0.75rem;
  font-family: var(--font-kai);
  font-size: clamp(1.8rem, 4vw, 2.55rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.1em;
}

.event-subtitle {
  margin-top: 0.3rem;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.event-narrative {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 1rem;
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 2;
  letter-spacing: 0.015em;
}

.event-narrative p {
  text-align: justify;
}

.event-voices {
  margin-top: 0.85rem;
  padding: 0.5rem 0.7rem;
  background: rgba(80, 103, 86, 0.045);
  border-left: 2px solid rgba(80, 103, 86, 0.35);
}

.event-voices p {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.7rem;
  line-height: 1.8;
  text-align: justify;
}

.event-voices p + p {
  margin-top: 0.15rem;
}

.event-voices span {
  margin-right: 0.35rem;
  color: var(--ink-soft);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
}

.omen-note {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
  padding: 0.55rem 0.7rem;
  background: rgba(255, 247, 230, 0.38);
  border-left: 2px solid var(--ink-faint);
}

.omen-note--history {
  border-left-color: var(--gold);
  background: rgba(165, 129, 69, 0.07);
}

.omen-note--special {
  border-left-color: var(--cinnabar);
  background: rgba(158, 48, 39, 0.05);
}

.omen-note--bond {
  border-left-color: var(--jade-deep);
  background: rgba(80, 103, 86, 0.06);
}

.omen-note--funeral {
  border-left-color: var(--ink-soft);
  background: rgba(79, 67, 53, 0.07);
}

.omen-note__mark {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.45rem;
  height: 1.45rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.64rem;
}

.omen-note p {
  color: var(--ink-faint);
  font-size: 0.7rem;
  line-height: 1.6;
}

.chain-progress {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.75rem;
  margin-top: 0.55rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.62rem;
}

.chain-progress span:first-child {
  color: var(--gold);
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.option-card {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0.7rem;
  width: 100%;
  padding: 0.7rem 0.75rem;
  color: var(--ink);
  text-align: left;
  background: rgba(255, 248, 232, 0.38);
  border: 1px solid rgba(79, 67, 53, 0.16);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease;
}

.option-card:hover:not(:disabled) {
  z-index: 1;
  background: rgba(255, 248, 232, 0.72);
  border-color: var(--cinnabar);
  box-shadow: 0 8px 20px rgba(66, 47, 24, 0.1);
  transform: translateX(3px);
}

.option-card:disabled {
  opacity: 0.55;
}

.option-card__index {
  flex: 0 0 auto;
  align-self: flex-start;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--ink-soft);
  background: rgba(238, 225, 196, 0.55);
  border: 1px solid rgba(79, 67, 53, 0.22);
  font-family: var(--font-kai);
  font-size: 0.76rem;
  line-height: 1;
}

.option-hidden-note {
  margin-top: 0.55rem;
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  text-align: right;
}

.option-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-card__title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.option-card__title-row strong {
  font-family: var(--font-kai);
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.option-card__desc {
  color: var(--ink-faint);
  font-size: 0.73rem;
  line-height: 1.6;
}

.option-card__arrow {
  flex: 0 0 auto;
  align-self: center;
  color: var(--ink-faint);
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.option-card:hover .option-card__arrow {
  color: var(--cinnabar);
  transform: translateX(3px);
}

.event-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.9rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(79, 67, 53, 0.1);
}

.event-actions p {
  color: var(--ink-faint);
  font-size: 0.63rem;
  line-height: 1.6;
}

.event-actions .btn--quiet {
  flex: 0 0 auto;
  color: var(--ink-faint);
}

.event-actions .btn--quiet:hover {
  color: var(--cinnabar);
}

/* 结果页 */
.outcome-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.outcome-heading__seal {
  display: grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  box-shadow:
    inset 0 0 0 2px var(--cinnabar),
    inset 0 0 0 3px rgba(255, 246, 223, 0.4);
  font-family: var(--font-kai);
  font-size: 1.2rem;
}

.outcome-heading h2 {
  margin-top: 0.08rem;
  font-family: var(--font-kai);
  font-size: 1.65rem;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.outcome-heading__tone {
  margin-left: auto;
  padding: 0.1rem 0.5rem;
  color: var(--ink-faint);
  border: 1px solid rgba(79, 67, 53, 0.2);
  font-family: var(--font-kai);
  font-size: 0.64rem;
}

.outcome-choice {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.55rem 0.7rem;
  background: rgba(255, 247, 230, 0.38);
  border-left: 2px solid var(--cinnabar);
}

.outcome-choice__label {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
}

.outcome-choice strong {
  font-family: var(--font-kai);
  font-size: 0.92rem;
  font-weight: 600;
}

.outcome-choice__title {
  color: var(--ink-faint);
  font-size: 0.68rem;
}

.outcome-choice__weight {
  margin-left: auto;
  padding: 0.05rem 0.35rem;
  font-family: var(--font-kai);
  font-size: 0.64rem;
  border: 1px solid currentColor;
}

.outcome-choice__weight.is-good {
  color: var(--moss);
}

.outcome-choice__weight.is-bad {
  color: var(--cinnabar);
}

.outcome-narrative {
  margin-top: 0.9rem;
  color: var(--ink-soft);
  font-size: 0.9rem;
  line-height: 2;
  text-align: justify;
  white-space: pre-line;
}

.outcome-decline {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.7rem;
  padding: 0.35rem 0.55rem;
  color: var(--cinnabar-deep);
  background: rgba(158, 48, 39, 0.05);
  border-left: 2px solid rgba(158, 48, 39, 0.4);
  font-size: 0.72rem;
}

.outcome-decline span {
  padding: 0 0.25rem;
  color: var(--paper-light);
  background: var(--cinnabar-deep);
  font-family: var(--font-kai);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
}

.outcome-total {
  margin-top: 1.1rem;
  padding: 0.75rem;
  background: rgba(255, 247, 230, 0.36);
  border: 1px solid rgba(79, 67, 53, 0.12);
}

.outcome-total__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid rgba(79, 67, 53, 0.1);
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.65rem;
}

.resource-shift {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.4rem;
  margin-top: 0.55rem;
}

.resource-shift__item {
  display: flex;
  align-items: center;
  gap: 0.26rem;
  min-width: 0;
  font-size: 0.64rem;
}

.resource-shift__seal {
  display: grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.54rem;
}

.resource-shift__label {
  color: var(--ink-faint);
  white-space: nowrap;
}

.resource-shift__values {
  margin-left: auto;
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.resource-shift__values strong {
  color: var(--ink);
}

.resource-shift__arrow {
  margin: 0 0.1rem;
  color: var(--ink-faint);
  font-size: 0.55rem;
}

.resource-shift__delta {
  display: none;
}

.breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 0.8rem;
}

.breakdown__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.45rem 0;
  border-bottom: 1px dashed rgba(79, 67, 53, 0.12);
}

.breakdown__row--advisor {
  background: rgba(80, 103, 86, 0.05);
  padding-inline: 0.5rem;
}

.breakdown__label {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.66rem;
  letter-spacing: 0.05em;
}

.breakdown__fortune {
  padding: 0.55rem 0;
}

.breakdown__fortune-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.breakdown__mood {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.6rem;
}

.breakdown__mood--mixed {
  color: var(--gold);
}

.fortune-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.45rem 0.55rem;
  border-left: 2px solid;
}

.fortune-line + .fortune-line {
  margin-top: 0.35rem;
}

.fortune-line--good {
  background: rgba(80, 103, 86, 0.05);
  border-left-color: var(--jade);
}

.fortune-line--bad {
  background: rgba(158, 48, 39, 0.045);
  border-left-color: var(--cinnabar);
}

.fortune-line > div {
  min-width: 0;
}

.fortune-line strong {
  font-family: var(--font-kai);
  font-size: 0.73rem;
  font-weight: 500;
}

.fortune-line p {
  margin-top: 0.12rem;
  color: var(--ink-faint);
  font-size: 0.64rem;
  line-height: 1.6;
}

.fortune-line :deep(.delta-list) {
  flex: 0 0 auto;
  justify-content: flex-end;
}

.breakdown__calm,
.breakdown__chain-end {
  color: var(--ink-faint);
  font-size: 0.66rem;
  line-height: 1.6;
}

.breakdown__chain-end {
  color: var(--gold);
  font-family: var(--font-kai);
}

.ending-warning {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.9rem;
  padding: 0.7rem 0.8rem;
  background: rgba(158, 48, 39, 0.055);
  border: 1px solid rgba(158, 48, 39, 0.26);
}

.ending-warning__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.9rem;
}

.ending-warning strong {
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.ending-warning p {
  margin-top: 0.12rem;
  color: var(--ink-soft);
  font-size: 0.65rem;
  line-height: 1.6;
}

.folio-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.1rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(79, 67, 53, 0.13);
}

.folio-actions__hint {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  font-size: 0.64rem;
}

.folio-actions .btn--primary {
  min-width: 9.5rem;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
}

/* 岁评 */
.year-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.year-heading h2 {
  margin-top: 0.1rem;
  font-family: var(--font-kai);
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.year-heading__sub {
  margin-top: 0.25rem;
  color: var(--ink-faint);
  font-size: 0.74rem;
}

.year-mark {
  position: relative;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  color: var(--mark-color);
  border: 2px solid currentColor;
  transform: rotate(-2deg);
}

.year-mark::before {
  position: absolute;
  inset: 3px;
  content: '';
  border: 1px solid currentColor;
  opacity: 0.55;
}

.year-mark span {
  font-family: var(--font-kai);
  font-size: 2.3rem;
  line-height: 1;
}

.year-mark em {
  position: absolute;
  right: 0.3rem;
  bottom: 0.15rem;
  font-family: var(--font-kai);
  font-size: 0.55rem;
  font-style: normal;
}

.year-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.year-stats div {
  padding: 0.5rem 0.6rem;
  background: rgba(255, 247, 230, 0.36);
  border: 1px solid rgba(79, 67, 53, 0.1);
}

.year-stats span {
  display: block;
  color: var(--ink-faint);
  font-size: 0.6rem;
}

.year-stats strong {
  display: block;
  margin-top: 0.1rem;
  font-family: var(--font-kai);
  font-size: 0.9rem;
  font-weight: 500;
}


.year-deltas {
  margin-top: 0.7rem;
  padding: 0.65rem 0.7rem;
  background: rgba(255, 247, 230, 0.32);
  border-left: 2px solid var(--gold);
}

.year-deltas__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.year-deltas h3,
.year-events h3 {
  color: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.year-deltas__advisor {
  margin-top: 0.35rem;
  color: var(--ink-faint);
  font-size: 0.64rem;
}

.year-events {
  margin-top: 0.9rem;
}

.year-events ul {
  margin-top: 0.45rem;
  border-top: 1px solid rgba(79, 67, 53, 0.1);
}

.year-events li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0;
  border-bottom: 1px dashed rgba(79, 67, 53, 0.1);
}

.year-events li.is-skipped {
  opacity: 0.55;
}

.year-event__index {
  flex: 0 0 auto;
  color: var(--gold);
  font-family: var(--font-kai);
  font-size: 0.68rem;
}

.year-event__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.year-event__main strong {
  font-family: var(--font-kai);
  font-size: 0.76rem;
  font-weight: 500;
}

.year-event__main em {
  color: var(--ink-faint);
  font-size: 0.6rem;
  font-style: normal;
}

.year-event__weight {
  flex: 0 0 auto;
  font-family: var(--font-kai);
  font-size: 0.62rem;
}

.year-event__weight.is-good {
  color: var(--moss);
}

.year-event__weight.is-bad {
  color: var(--cinnabar);
}

.year-event__decision {
  flex: 0 0 auto;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.64rem;
}

.year-ending-warning {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.75rem;
  padding: 0.6rem 0.7rem;
  color: var(--ink-soft);
  background: rgba(158, 48, 39, 0.06);
  border: 1px solid rgba(158, 48, 39, 0.22);
}

.year-ending-warning__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  color: var(--paper-light);
  background: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.8rem;
}

.year-ending-warning strong {
  display: block;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 0.78rem;
  font-weight: 500;
}

.year-ending-warning p {
  margin-top: 0.1rem;
  font-size: 0.66rem;
  line-height: 1.65;
}

.year-verdict {
  display: flex;
  gap: 0.65rem;
  margin-top: 0.9rem;
  padding: 0.6rem 0.7rem;
  background: rgba(80, 103, 86, 0.055);
  border: 1px solid rgba(80, 103, 86, 0.15);
}

.year-verdict__label {
  flex: 0 0 auto;
  color: var(--jade-deep);
  font-family: var(--font-kai);
  font-size: 0.64rem;
}

.year-verdict p {
  color: var(--ink-soft);
  font-size: 0.68rem;
  line-height: 1.65;
}

.fallback-page {
  color: var(--ink-faint);
  font-family: var(--font-kai);
  text-align: center;
}

.game-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  width: min(100% - 2.5rem, 1240px);
  margin: 0 auto;
  padding: 0.8rem 0 calc(0.2rem + env(safe-area-inset-bottom));
  color: rgba(238, 225, 196, 0.28);
  font-family: var(--font-kai);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
}

/* 行动点与辅臣能力 */
.court-header__actions-points {
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}

.court-header__actions-points.is-empty {
  color: var(--cinnabar);
}

.minister-card__ability {
  display: flex;
  gap: 0.45rem;
  margin-top: 0.55rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(79, 67, 53, 0.16);
}

.minister-card__ability-seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  color: var(--paper-light);
  background: var(--jade-deep);
  font-family: var(--font-kai);
  font-size: 0.62rem;
}

.minister-card__ability strong {
  font-family: var(--font-kai);
  font-size: 0.72rem;
  font-weight: 600;
}

.minister-card__ability p {
  margin-top: 0.08rem;
  color: var(--ink-faint);
  font-size: 0.62rem;
  line-height: 1.6;
}

.option-card--advisor {
  background: rgba(80, 103, 86, 0.12);
  border-color: rgba(80, 103, 86, 0.4);
}

.option-card__counsel-tag,
.outcome-choice__advisor {
  flex: 0 0 auto;
  padding: 0.04rem 0.4rem;
  color: var(--paper-light);
  background: var(--jade-deep);
  font-family: var(--font-kai);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
}

.outcome-twist {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.7rem;
  padding: 0.45rem 0.6rem;
  border-left: 2px solid var(--gold);
}

.outcome-twist--good {
  background: rgba(80, 103, 86, 0.06);
  border-left-color: var(--jade);
}

.outcome-twist--bad {
  background: rgba(158, 48, 39, 0.05);
  border-left-color: var(--cinnabar);
}

.outcome-twist__mark {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.62rem;
}

.outcome-twist--good .outcome-twist__mark {
  background: var(--jade-deep);
}

.outcome-twist--bad .outcome-twist__mark {
  background: var(--cinnabar);
}

.outcome-twist p {
  color: var(--ink-faint);
  font-size: 0.66rem;
  line-height: 1.6;
}

@media (max-width: 1080px) {
  .book {
    grid-template-columns: 14.5rem minmax(0, 1fr);
  }

  .book-left {
    padding: 1.2rem 1rem 1rem;
  }

  .book-page {
    padding: 1.2rem 1.4rem 1.3rem;
  }
}

@media (max-width: 900px) {
  .court-header__meta {
    display: none;
  }

  .court-strip__season {
    display: none;
  }

  .book {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .book-left {
    display: none;
  }

  .folio-head__court {
    display: block;
  }

  .book-page {
    padding: 1.1rem 1.2rem 1.25rem;
    box-shadow: none;
  }

  .book-page__binding {
    display: none;
  }
}

@media (max-width: 640px) {
  .game-screen {
    padding-bottom: 0.4rem;
  }

  .court-header,
  .court-strip,
  .book,
  .game-foot {
    width: calc(100% - 1rem);
  }

  .court-header {
    padding: 0.75rem 0 0.55rem;
  }

  .court-header__brand .seal-mark {
    width: 1.7rem;
    height: 1.7rem;
    font-size: 0.72rem;
  }

  .court-header__brand h1 {
    font-size: 1rem;
  }

  .court-header__actions .btn--quiet {
    min-height: 2rem;
    padding: 0.2rem 0.35rem;
    font-size: 0.75rem;
  }

  .court-strip {
    margin-bottom: 0.45rem;
    padding: 0.4rem;
  }

  .court-strip__gauges {
    gap: 0.3rem;
  }

  .court-strip__gauges :deep(.gauge) {
    padding: 0.36rem 0.38rem 0.3rem;
  }

  .court-strip__gauges :deep(.gauge__seal) {
    display: none;
  }

  .court-strip__gauges :deep(.gauge__label) {
    font-size: 0.68rem;
  }

  .court-strip__gauges :deep(.gauge__value) {
    font-size: 0.82rem;
  }

  .book-page {
    padding: 0.9rem 0.8rem 1rem;
  }

  .folio-head {
    padding-bottom: 0.6rem;
  }

  .folio-head__date {
    font-size: 0.68rem;
  }

  .folio-head__page {
    display: none;
  }

  .event-title {
    font-size: clamp(1.6rem, 9vw, 2.1rem);
  }

  .event-narrative {
    font-size: 0.84rem;
    line-height: 1.9;
  }

  .option-card {
    gap: 0.5rem;
    padding: 0.6rem 0.55rem;
  }

  .option-card__tone {
    width: 1.65rem;
    height: 1.85rem;
    font-size: 0.6rem;
  }

  .option-card__title-row strong {
    font-size: 0.88rem;
  }

  .option-card__desc {
    font-size: 0.67rem;
  }

  .event-actions {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.4rem;
  }

  .event-actions .btn--quiet {
    align-self: flex-end;
  }

  .outcome-heading h2,
  .year-heading h2 {
    font-size: 1.45rem;
  }

  .outcome-heading__seal {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1rem;
  }

  .outcome-choice {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;
  }

  .resource-shift {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fortune-line {
    flex-direction: column;
    gap: 0.3rem;
  }

  .year-mark {
    width: 3.5rem;
    height: 3.5rem;
  }

  .year-mark span {
    font-size: 1.8rem;
  }

  .year-stats {
    grid-template-columns: 1fr 1fr;
  }

  .year-heading__sub {
    max-width: 14rem;
  }

  .folio-actions {
    align-items: stretch;
    flex-direction: column;
    gap: 0.5rem;
  }

  .folio-actions__hint {
    text-align: center;
  }

  .folio-actions .btn--primary {
    width: 100%;
  }

  .game-foot {
    padding-top: 0.6rem;
    font-size: 0.55rem;
  }
}
</style>

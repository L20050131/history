export const RESOURCE_KEYS = ['regent', 'treasury', 'unrest', 'army'] as const

export type ResourceKey = (typeof RESOURCE_KEYS)[number]
export type Resources = Record<ResourceKey, number>
export type ResourceDelta = Partial<Resources>

export type EventCategory = 'governance' | 'military' | 'economy' | 'ritual' | 'culture'
export type Omen = '吉' | '凶' | '平'
export type OptionTone = 'radical' | 'balanced' | 'cautious'
export type AnnualMark = '顺' | '厄' | '平' | '庸'
export type EpithetKind = 'good' | 'neutral' | 'bad'
export type OfficeId = 'chancellor' | 'marshal' | 'censor' | 'steward'
export type EndingKind =
  | 'natural'
  | 'abdication'
  | 'mutiny'
  | 'rebellion'
  | 'conquest'
  | 'fengshan'
  | 'ascension'
  | 'retirement'
  | 'partition'
  | 'martyr'
  | 'mediocrity'
export type SessionStage = 'advisors' | 'appoint' | 'reign' | 'ending'
export type ReignPage = 'event' | 'outcome' | 'yearEnd'

/** 旧版本辅臣四维，仅用于旧存档迁移。 */
export interface AdvisorStats {
  statecraft: number
  martial: number
  prestige: number
  intrigue: number
}

export type AdvisorAbilityId =
  | 'jingshi'
  | 'binglue'
  | 'qingwang'
  | 'quanshu'
  | 'licai'
  | 'yujun'
  | 'wenjiao'
  | 'rende'

export interface AdvisorAbility {
  id: AdvisorAbilityId
  name: string
  seal: string
  description: string
  officeHint: OfficeId
  categories: EventCategory[]
  counselChance: number
  yearEnd: ResourceDelta
}

export interface Advisor {
  id: string
  name: string
  courtesy: string
  origin: string
  avatar: string
  epithet: string
  trait: string
  ability: AdvisorAbility
  /** 所授官职；候选或未授职者为 null。 */
  office: OfficeId | null
  /** 前朝留任旧臣：岁末实效更著。 */
  legacy?: boolean
}

export interface OfficeDefinition {
  id: OfficeId
  rank: string
  office: string
  title: string
  summary: string
  detail: string
  risk: string
}

export interface EventOption {
  id: string
  label: string
  description: string
  tone: OptionTone
  effects: ResourceDelta
  /** 政绩权重：岁末合计，用于评定顺、厄、平。 */
  weight: number
  outcome: string
  /** 异闻选项可直接指定国祚终局，择定后于本季结算时进入终卷。 */
  endsReign?: EndingKind
  /** 辅臣进言所献之策，择定后按辅臣才具结算更优。 */
  isAdvisor?: boolean
  advisorName?: string
}

export interface EventVariant {
  id: string
  title: string
  subtitle: string
  narrative: string
  options: EventOption[]
  /** 抽取权重，默认 1。 */
  weight?: number
  /** 仅在指定季节出现；为空则四时皆可。 */
  quarters?: number[]
}

export interface EventVoice {
  label: string
  text: string
}

export interface EventTemplate {
  id: string
  category: EventCategory
  title: string
  subtitle: string
  narrative: string
  options: EventOption[]
  variants?: EventVariant[]
}

export interface ChainStepTemplate {
  title: string
  narrative: string
  options: EventOption[]
}

export interface ChainTemplate {
  id: string
  name: string
  inspiration: string
  summary: string
  steps: ChainStepTemplate[]
}

export interface GameDate {
  yearGanzhi: string
  monthName: string
  monthGanzhi: string
  dayGanzhi: string
}

export interface FortuneEffect {
  id: string
  label: string
  text: string
  effects: ResourceDelta
}

export interface QuarterFortune {
  mood: 'calm' | 'adverse' | 'mixed'
  boon: FortuneEffect | null
  bane: FortuneEffect | null
}

export interface GameEvent {
  occurrenceId: string
  templateId: string
  category: EventCategory
  categoryLabel: string
  title: string
  subtitle: string
  narrative: string
  source: 'daily' | 'chain' | 'special'
  chain: {
    id: string
    name: string
    inspiration: string
    step: number
    steps: number
  } | null
  options: EventOption[]
  voices: EventVoice[]
  omen: Omen
  date: GameDate
  fortune: QuarterFortune
  /** 两代辅臣交章之事：一朝仅一次，不系岁评。 */
  bond?: boolean
  /** 承继新朝的首季国丧：先皇葬仪。 */
  funeral?: boolean
  /** 承继之朝积弊未除，此事的负面效用会加重。 */
  decline?: boolean
}

export interface ChainScheduleEntry {
  chainId: string
  chainName: string
  stepIndex: number
  year: number
  quarter: number
  canceled: boolean
}

export interface YearEventNote {
  title: string
  categoryLabel: string
  source: 'daily' | 'chain' | 'special'
  decision: string
  tone: OptionTone | null
  weight: number | null
  skipped: boolean
  date: string
  funeral?: boolean
  decline?: boolean
}

export interface OutcomeRecord {
  title: string
  source: 'daily' | 'chain' | 'special'
  skipped: boolean
  choiceLabel: string
  choiceTone: OptionTone | null
  choiceWeight: number | null
  narrative: string
  effect: ResourceDelta
  fortune: QuarterFortune
  advisorEffect: ResourceDelta | null
  advisorName: string | null
  totalEffect: ResourceDelta
  before: Resources
  after: Resources
  pendingEnding: EndingKind | null
  /** 终局成因：国势越界，或异闻抉择直接落定。 */
  endingCause: 'resources' | 'event' | null
  chainContinues: boolean
  /** 本决断是否为辅臣进言。 */
  choiceIsAdvisor: boolean
  /** 日常朝政的顺逆之数：六成顺、四成逆。 */
  twist: 'good' | 'bad' | null
  /** 是否为两代辅臣交章之事。 */
  bond?: boolean
  /** 是否为承继新朝的先皇葬仪。 */
  funeral?: boolean
  /** 承继之朝积弊未除，本策的负面效用已加重。 */
  decline?: boolean
}

export interface AnnualState {
  total: number
  skipped: number
  score: number
}

export interface YearSummary {
  year: number
  mark: AnnualMark
  title: string
  remark: string
  deltas: ResourceDelta
  dailyTotal: number
  skipped: number
  score: number
  advisorNote: string | null
  events: YearEventNote[]
}

export interface Epithet {
  char: string
  name: string
  meaning: string
}

export interface EndingRecord {
  kind: EndingKind
  label: string
  headline: string
  narrative: string
  epithet: Epithet
  historian: string
  verdict: string
  finalResources: Resources
  yearsPlayed: number
  evaluations: Record<AnnualMark, number>
  completedAt: string
}

export interface ChronicleEntry {
  year: number
  quarter: number
  dateLabel: string
  title: string
  categoryLabel: string
  source: 'daily' | 'chain' | 'special' | 'evaluation'
  decision: string
  summary: string
  skipped: boolean
}

export interface Session {
  version: 1
  id: string
  stage: SessionStage
  eraName: string
  generation: number
  inherited: boolean
  inheritedFrom: string | null
  createdAt: string
  updatedAt: string
  reignYears: number
  startYearGanzhi: number
  startDayIndex: number
  currentYear: number
  quarter: number
  dayIndex: number
  /** 每岁行动点：三件事务的额度，择一策耗一点，搁置不耗。 */
  actionPoints: number
  resources: Resources
  advisorCandidates: Advisor[]
  /** 在朝辅臣，至多两位；前朝留任者带 legacy 标记。 */
  advisors: Advisor[]
  /** 新旧辅臣交章之年；无两代并立则为 null。 */
  bondYear: number | null
  /** 本朝两代辅臣的交章是否已经发生（一朝仅一次）。 */
  bondSeen: boolean
  /** 承继之朝的首季先皇葬仪是否已经发生。 */
  funeralSeen: boolean
  currentEvent: GameEvent | null
  outcome: OutcomeRecord | null
  reignPage: ReignPage
  annual: AnnualState
  yearStartResources: Resources
  yearLog: YearEventNote[]
  yearSummary: YearSummary | null
  chainSchedule: ChainScheduleEntry[]
  specialSeen: string[]
  recentEventIds: string[]
  chronicle: ChronicleEntry[]
  evaluations: Record<AnnualMark, number>
  categoryTally: Record<EventCategory, number>
  pendingEnding: EndingKind | null
  ending: EndingRecord | null
  archived: boolean
}

export interface ArchiveEntry {
  id: string
  sessionId: string
  eraName: string
  generation: number
  years: number
  endingLabel: string
  epithetChar: string
  epithetName: string
  resources: Resources
  evaluations: Record<AnnualMark, number>
  historian: string
  completedAt: string
}

export interface LibraryState {
  version: 1
  entries: ArchiveEntry[]
}

export interface EndingAchievement {
  kind: EndingKind
  unlockedAt: string
  count: number
  bestYears: number
  latestEraName: string
  latestEpithet: string
  latestYears: number
  /** 该终局下曾得到的全部谥号，旧存档载入时由 latestEpithet 补一。 */
  epithets: string[]
}

export interface AchievementState {
  version: 1
  endings: Partial<Record<EndingKind, EndingAchievement>>
}

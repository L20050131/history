import type {
  AdvisorAbility,
  AdvisorAbilityId,
  AnnualMark,
  EndingKind,
  Epithet,
  EpithetKind,
  EventCategory,
  FortuneEffect,
  OfficeDefinition,
  ResourceKey,
  Resources,
} from './types'

export const RESOURCE_META: Record<
  ResourceKey,
  {
    label: string
    seal: string
    danger: 'high' | 'low'
    ending: string
    threshold: string
    description: string
  }
> = {
  regent: {
    label: '权臣',
    seal: '权',
    danger: 'high',
    ending: '禅让',
    threshold: '至 100 权臣逼宫，改朝换代',
    description: '朝中权柄旁落之势。越高，皇权越危。',
  },
  treasury: {
    label: '府库',
    seal: '库',
    danger: 'low',
    ending: '军变',
    threshold: '降至 0 府库告罄，禁军生变',
    description: '国库盈虚。越低，军饷与赈济越难维系。',
  },
  unrest: {
    label: '民变',
    seal: '民',
    danger: 'high',
    ending: '民变',
    threshold: '至 100 民怨沸腾，天下揭竿',
    description: '民间怨气。越高，流民与义军越多。',
  },
  army: {
    label: '军势',
    seal: '军',
    danger: 'low',
    ending: '灭国',
    threshold: '降至 0 武备尽丧，社稷倾覆',
    description: '朝廷兵威。越低，边患与强敌越近。',
  },
}

export const RESOURCE_ORDER: ResourceKey[] = ['regent', 'treasury', 'unrest', 'army']

export const BASE_RESOURCES: Resources = {
  regent: 50,
  treasury: 40,
  unrest: 20,
  army: 80,
}

export const CATEGORY_META: Record<EventCategory, { label: string; seal: string; accent: string }> = {
  governance: { label: '执政', seal: '朝', accent: '#7f3b2d' },
  military: { label: '军事', seal: '戈', accent: '#5a5f45' },
  economy: { label: '经济', seal: '贝', accent: '#946b2d' },
  ritual: { label: '宗庙', seal: '祀', accent: '#76506b' },
  culture: { label: '文教', seal: '文', accent: '#3d6271' },
}

export const OFFICES: OfficeDefinition[] = [
  {
    id: 'chancellor',
    rank: '正一品',
    office: '丞相',
    title: '总揽朝纲',
    summary: '岁末：府库 +3，权臣 +2；辅臣之能另加',
    detail: '开府治事，总领百官。相府既立，钱粮自有腾挪，然相权日重，亦随之累积。',
    risk: '权臣之患随年岁累积，须时时裁抑。',
  },
  {
    id: 'marshal',
    rank: '正二品',
    office: '太尉',
    title: '掌天下兵马',
    summary: '岁末：军势 +3，府库 -1；辅臣之能另加',
    detail: '典领武事，整饬边备。每岁整军经武，使军势稳固，然粮饷所费不赀。',
    risk: '军费常悬，府库需有余力。',
  },
  {
    id: 'censor',
    rank: '正三品',
    office: '御史大夫',
    title: '纠察百官',
    summary: '岁末：民变 -3，权臣 -1；辅臣之能另加',
    detail: '风闻奏事，肃清吏治。可纾民间积怨，亦可稍稍裁抑权臣气焰。',
    risk: '所得不在开源，府库不会因此充盈。',
  },
  {
    id: 'steward',
    rank: '正四品',
    office: '大司农',
    title: '掌天下钱谷',
    summary: '岁末：府库 +4，民变 +1；辅臣之能另加',
    detail: '均输平准，劝课农桑。最能充实国帑，然催科稍急，民间亦有怨声。',
    risk: '取之于民，民变会缓慢累积。',
  },
]

export const ADVISOR_ABILITIES: AdvisorAbility[] = [
  {
    id: 'jingshi',
    name: '经世之才',
    seal: '经',
    description: '通晓钱谷，善于理财安民。岁末府库益增；遇经济、执政之事，常能进言加码。',
    officeHint: 'steward',
    categories: ['economy', 'governance'],
    counselChance: 0.38,
    yearEnd: { treasury: 3 },
  },
  {
    id: 'binglue',
    name: '兵略之能',
    seal: '兵',
    description: '熟稔兵机，晓畅边务。岁末军势益增；遇军事之事，常能进言加码。',
    officeHint: 'marshal',
    categories: ['military'],
    counselChance: 0.38,
    yearEnd: { army: 3 },
  },
  {
    id: 'qingwang',
    name: '清望之德',
    seal: '望',
    description: '德望素著，士民所附。岁末民变稍纾；遇执政、宗庙之事，常能进言加码。',
    officeHint: 'censor',
    categories: ['governance', 'ritual'],
    counselChance: 0.38,
    yearEnd: { unrest: -3 },
  },
  {
    id: 'quanshu',
    name: '权谋之断',
    seal: '权',
    description: '善察人心，长于制衡。岁末权臣稍抑；遇执政、宗庙之事，常能进言加码。',
    officeHint: 'chancellor',
    categories: ['governance', 'ritual'],
    counselChance: 0.38,
    yearEnd: { regent: -2 },
  },
  {
    id: 'licai',
    name: '理财之能',
    seal: '财',
    description: '锱铢必较，生财有道。岁末府库大益，然催科稍急；遇经济之事，常能进言加码。',
    officeHint: 'steward',
    categories: ['economy'],
    counselChance: 0.45,
    yearEnd: { treasury: 4, unrest: 1 },
  },
  {
    id: 'yujun',
    name: '驭军之才',
    seal: '军',
    description: '恩威并施，士卒归心。岁末军势大益，然军费略增；遇军事之事，常能进言加码。',
    officeHint: 'marshal',
    categories: ['military'],
    counselChance: 0.45,
    yearEnd: { army: 4, treasury: -1 },
  },
  {
    id: 'wenjiao',
    name: '文教之望',
    seal: '文',
    description: '经史淹通，士林所推。岁末民变、权臣稍抑；遇文教之事，常能进言加码。',
    officeHint: 'chancellor',
    categories: ['culture'],
    counselChance: 0.45,
    yearEnd: { unrest: -2, regent: -1 },
  },
  {
    id: 'rende',
    name: '仁厚之名',
    seal: '仁',
    description: '宽仁爱民，闾里称颂。岁末民变大纾，然府库略损；遇执政、宗庙之事，常能进言加码。',
    officeHint: 'censor',
    categories: ['governance', 'ritual'],
    counselChance: 0.45,
    yearEnd: { unrest: -3, treasury: -1 },
  },
]

export const ADVISOR_ABILITY_MAP: Record<AdvisorAbilityId, AdvisorAbility> = Object.fromEntries(
  ADVISOR_ABILITIES.map((ability) => [ability.id, ability]),
) as Record<AdvisorAbilityId, AdvisorAbility>

export const ADVISOR_SURNAMES = [
  '李',
  '王',
  '张',
  '刘',
  '陈',
  '杨',
  '赵',
  '韩',
  '裴',
  '崔',
  '谢',
  '萧',
  '房',
  '杜',
  '陆',
  '苏',
  '魏',
  '沈',
  '司马',
  '欧阳',
  '诸葛',
  '上官',
]

export const ADVISOR_GIVEN_NAMES = [
  '景略',
  '文正',
  '季明',
  '子房',
  '玄龄',
  '如晦',
  '九龄',
  '履霜',
  '持衡',
  '望舒',
  '三省',
  '观澜',
  '允恭',
  '宗元',
  '仲淹',
  '肃之',
  '秉忠',
  '清臣',
  '知远',
  '慎行',
  '怀瑾',
  '牧之',
  '长孺',
  '正则',
  '守拙',
  '载舟',
  '敬亭',
  '明诚',
]

export const ADVISOR_ORIGINS = [
  '河东裴氏',
  '陇西李氏',
  '琅琊王氏',
  '清河崔氏',
  '颍川陈氏',
  '弘农杨氏',
  '河内司马氏',
  '吴郡陆氏',
  '京兆杜氏',
  '南阳张氏',
  '北海孔氏',
  '陈郡谢氏',
]

export const ADVISOR_EPITHETS = ['沉毅', '通脱', '刚介', '练达', '渊博', '果决', '持重', '机敏', '清峻', '宽和']

export const ADVISOR_TRAITS = [
  '临事有断，不避权贵',
  '善察人心，长于调停',
  '经学淹通，士林所推',
  '理财有术，锱铢必较',
  '沉静寡言，谋定后动',
  '锐意进取，不恤人言',
  '老成持重，循法守成',
  '知人善任，不拘一格',
  '清介自守，不通私谒',
  '熟稔边务，晓畅兵机',
]

export const FORTUNE_BANES: FortuneEffect[] = [
  {
    id: 'river-break',
    label: '河决堤溃',
    text: '大河秋汛决口，沿河州县被淹，赈济与修堤并耗国帑。',
    effects: { treasury: -3, unrest: 3 },
  },
  {
    id: 'locust-drought',
    label: '旱蝗相继',
    text: '春旱秋蝗，田亩歉收，百姓流徙，郡县催科愈急。',
    effects: { treasury: -2, unrest: 4 },
  },
  {
    id: 'border-alarm',
    label: '边烽又起',
    text: '斥候连报敌骑犯边，守军疲于奔命，粮饷与军械皆有折损。',
    effects: { army: -4, treasury: -2 },
  },
  {
    id: 'clan-encroach',
    label: '权贵侵渔',
    text: '宗室勋贵侵占民田、把持选官，言路渐为私门所壅。',
    effects: { regent: 3, unrest: 2 },
  },
  {
    id: 'plague',
    label: '疫疠流行',
    text: '瘟疫自南而北，州县闭坊，营中亦有病卒，人心惶惶。',
    effects: { unrest: 4, army: -2 },
  },
  {
    id: 'canal-block',
    label: '漕运淤塞',
    text: '运河淤塞，南粮不能北运，京仓告急，朝议纷然。',
    effects: { treasury: -3, regent: 1 },
  },
  {
    id: 'warlord',
    label: '藩镇跋扈',
    text: '边镇将帅久不奉调，截留赋税、私蓄甲兵，朝廷号令渐不行于外。',
    effects: { regent: 3, army: -3 },
  },
  {
    id: 'treasury-theft',
    label: '库银失窃',
    text: '内库账目不清，掌库官吏与勋贵勾连，亏空之数难以追补。',
    effects: { treasury: -4, regent: 1 },
  },
  {
    id: 'arms-decay',
    label: '军械朽坏',
    text: '武库久不修缮，甲胄锈蚀、弓弩断弦，点验之日将校相顾失色。',
    effects: { army: -5, treasury: -1 },
  },
  {
    id: 'rumor',
    label: '流言四起',
    text: '市井盛传天象示警、宫闱有变，御史台查禁愈急，物议愈盛。',
    effects: { unrest: 4, regent: 1 },
  },
]

export const FORTUNE_BOONS: FortuneEffect[] = [
  {
    id: 'good-weather',
    label: '风调雨顺',
    text: '雨旸时若，麦禾登熟，税粮如期入仓，百姓稍得苏息。',
    effects: { treasury: 5, unrest: -3 },
  },
  {
    id: 'border-win',
    label: '边关小捷',
    text: '守将设伏击退犯边之敌，斩获颇多，边军士气为之一振。',
    effects: { army: 6, unrest: -1 },
  },
  {
    id: 'scholar-praise',
    label: '士林称颂',
    text: '朝政宽简，诏令不扰，太学生与地方清流交章称善。',
    effects: { unrest: -5, regent: -1 },
  },
  {
    id: 'trade-road',
    label: '商路畅通',
    text: '关津整顿，商旅往来无阻，市税与关赋日渐丰盈。',
    effects: { treasury: 5 },
  },
  {
    id: 'refugees-return',
    label: '流民归籍',
    text: '郡县开仓赈济、给田授种，流亡之民渐归乡里，田亩复耕。',
    effects: { unrest: -4, treasury: 3 },
  },
  {
    id: 'good-general',
    label: '良将崭露',
    text: '行伍之中擢得勇略之士，整训部曲，军容为之一新。',
    effects: { army: 5, regent: -1 },
  },
  {
    id: 'granary-full',
    label: '仓廪丰实',
    text: '常平仓积粟充溢，度支有余，朝廷得以缓征一年。',
    effects: { treasury: 6 },
  },
  {
    id: 'clean-court',
    label: '清议肃然',
    text: '台谏敢言，数名贪墨大吏被劾去职，朝纲为之一肃。',
    effects: { unrest: -4, regent: -3 },
  },
  {
    id: 'canal-done',
    label: '新渠告成',
    text: '新凿水渠贯通两州，灌溉与漕运并利，沿河百姓颂声载道。',
    effects: { treasury: 4, unrest: -2 },
  },
  {
    id: 'army-heart',
    label: '军心大定',
    text: '拖欠军饷补发，将士感念，营中讹言止息，操演如常。',
    effects: { army: 5, unrest: -1 },
  },
]

export const EPITHETS: Record<string, Epithet> = {
  文: { char: '文', name: '文皇帝', meaning: '经纬天地曰文；道德博闻曰文。' },
  武: { char: '武', name: '武皇帝', meaning: '克定祸乱曰武；威强睿德曰武。' },
  明: { char: '明', name: '明皇帝', meaning: '照临四方曰明；任贤致远曰明。' },
  仁: { char: '仁', name: '仁皇帝', meaning: '慈民爱物曰仁；克己复礼曰仁。' },
  成: { char: '成', name: '成皇帝', meaning: '安民立政曰成；刑民克服曰成。' },
  康: { char: '康', name: '康皇帝', meaning: '安乐抚民曰康；令民安乐曰康。' },
  景: { char: '景', name: '景皇帝', meaning: '由义而济曰景；布义行刚曰景。' },
  宣: { char: '宣', name: '宣皇帝', meaning: '圣善周闻曰宣；施而不成曰宣。' },
  厉: { char: '厉', name: '厉皇帝', meaning: '杀戮无辜曰厉；暴虐无亲曰厉。' },
  炀: { char: '炀', name: '炀皇帝', meaning: '好内远礼曰炀；去礼远众曰炀。' },
  幽: { char: '幽', name: '幽皇帝', meaning: '壅遏不通曰幽；动祭乱常曰幽。' },
  恭: { char: '恭', name: '恭皇帝', meaning: '尊贤贵义曰恭；执事坚固曰恭。' },
  哀: { char: '哀', name: '哀皇帝', meaning: '恭仁短折曰哀；在国遭忧曰哀。' },
  殇: { char: '殇', name: '殇皇帝', meaning: '短折不成曰殇；未家短折曰殇。' },
  灵: { char: '灵', name: '灵皇帝', meaning: '乱而不损曰灵；不勤成名曰灵。' },
  僊: { char: '僊', name: '僊皇帝', meaning: '服食求仙曰僊；乘云上升曰僊。' },
  隐: { char: '隐', name: '隐皇帝', meaning: '隐居求志曰隐；不显尸国曰隐。' },
  悼: { char: '悼', name: '悼皇帝', meaning: '恐惧从处曰悼；年中早夭曰悼。' },
  桓: { char: '桓', name: '桓皇帝', meaning: '辟土服远曰桓；克敬勤民曰桓。' },
  愍: { char: '愍', name: '愍皇帝', meaning: '在国遭忧曰愍；在国逢难曰愍。' },
  荒: { char: '荒', name: '荒皇帝', meaning: '好乐怠政曰荒；外内从乱曰荒。' },
}

/** 谥号美恶：唯善谥方可传位承继，平谥与恶谥皆须另开新朝。 */
export const EPITHET_KINDS: Record<string, EpithetKind> = {
  文: 'good',
  武: 'good',
  明: 'good',
  仁: 'good',
  成: 'good',
  康: 'good',
  景: 'good',
  宣: 'good',
  桓: 'good',
  恭: 'neutral',
  哀: 'neutral',
  殇: 'neutral',
  隐: 'neutral',
  悼: 'neutral',
  愍: 'neutral',
  僊: 'neutral',
  厉: 'bad',
  炀: 'bad',
  幽: 'bad',
  灵: 'bad',
  荒: 'bad',
}

export function epithetKind(char: string): EpithetKind {
  return EPITHET_KINDS[char] ?? 'neutral'
}

export function canInheritEpithet(char: string): boolean {
  return epithetKind(char) === 'good'
}

export const ENDING_META: Record<
  EndingKind,
  { label: string; seal: string; headline: string; narrative: string }
> = {
  natural: {
    label: '寿终',
    seal: '崩',
    headline: '山陵既成，史笔初落',
    narrative: '帝崩于寝殿。宫门缟素，钟鼓齐鸣。天下未定，而一代之政，自此成为往事。',
  },
  abdication: {
    label: '禅让',
    seal: '禅',
    headline: '九锡已至，宫阙易主',
    narrative: '权臣羽翼已成，百官俯首。禅让诏书自宫中传出，帝退居别宫，社稷改姓。',
  },
  mutiny: {
    label: '军变',
    seal: '变',
    headline: '府库既竭，禁军叩阙',
    narrative: '粮饷久欠，禁军鼓噪于宫门。乱兵入城，宗庙兵火，江山终为他人所据。',
  },
  rebellion: {
    label: '民变',
    seal: '乱',
    headline: '揭竿四起，宫城日落',
    narrative: '饥民与流寇合势，郡县望风而降。义军破门之日，宫墙上残阳如血。',
  },
  conquest: {
    label: '灭国',
    seal: '亡',
    headline: '边关尽失，社稷倾覆',
    narrative: '武备尽废，强敌长驱直入。宗庙焚毁，玉玺易手，国祚就此而绝。',
  },
  fengshan: {
    label: '封禅',
    seal: '封',
    headline: '岱宗封禅，告成天地',
    narrative:
      '帝东巡泰山，燔柴告天，瘗玉于地。礼成之日，云开日出，百官山呼。功业至此而极，国祚在这一刻写下最盛的一笔。',
  },
  ascension: {
    label: '登仙',
    seal: '仙',
    headline: '丹成九转，白日飞升',
    narrative:
      '丹炉既开，云气自殿脊升起。帝服衮冕，随云而去，唯余玉座空陈。宫人俯伏，不知当哭，还是当贺。',
  },
  retirement: {
    label: '归隐',
    seal: '隐',
    headline: '挂冠而去，白云深处',
    narrative:
      '帝解下玺绶，乘一叶扁舟入山。新君与百官送至津口，回望时，烟水已合，再不见天子旌旗。',
  },
  partition: {
    label: '分国',
    seal: '分',
    headline: '裂土封侯，山河数分',
    narrative:
      '金册分授，诸镇各归其国。天子仍居京师，号令却不出百里。一个朝廷，从此成了许多朝廷。',
  },
  martyr: {
    label: '殉国',
    seal: '殉',
    headline: '宗庙火起，以身殉社稷',
    narrative:
      '城破之日，帝不去、不降，衣冠坐于宗庙。火光照彻宫城，史官在残简上写下最后一笔。',
  },
  mediocrity: {
    label: '庸政',
    seal: '庸',
    headline: '岁岁搁笔，朝堂草深',
    narrative:
      '一年又一年，御案上的奏疏积成小山，朱笔却始终未落。百官照旧入朝，照旧散朝；史官翻过一页页空白，终于合上了本纪。',
  },
}

export const ENDING_ORDER: EndingKind[] = [
  'natural',
  'abdication',
  'mutiny',
  'rebellion',
  'conquest',
  'fengshan',
  'ascension',
  'retirement',
  'partition',
  'martyr',
  'mediocrity',
]

/** 由异闻直接落定的终局，依其事迹定谥。 */
export const ENDING_FIXED_EPITHET: Partial<Record<EndingKind, string>> = {
  fengshan: '桓',
  ascension: '僊',
  retirement: '隐',
  partition: '悼',
  martyr: '愍',
  mediocrity: '荒',
}

export const LOCKED_ENDING_TITLE = '未启'
export const LOCKED_ENDING_HINT = '国祚终局仍在指掌之间'

export const ANNUAL_MARK_META: Record<
  AnnualMark,
  { label: string; seal: string; remark: string; color: string }
> = {
  顺: {
    label: '顺',
    seal: '顺',
    remark: '朝野称善，政令通行，是岁可谓顺矣。',
    color: '#526b4f',
  },
  厄: {
    label: '厄',
    seal: '厄',
    remark: '灾异并见，物议汹汹，是岁多厄。',
    color: '#8c352c',
  },
  平: {
    label: '平',
    seal: '平',
    remark: '无功无过，守成而已，是岁平平。',
    color: '#6d604d',
  },
  庸: {
    label: '庸',
    seal: '庸',
    remark: '诸事尽搁，百官空立，是岁庸庸。',
    color: '#81796d',
  },
}

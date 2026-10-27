import type { EventTemplate } from './types'

/**
 * 异闻事件。一朝各遇一次，不系日辰吉凶，也不计入岁评。
 * 每条异闻都藏着一条足以改写国祚的抉择：择定之后，当季结算即入终卷。
 */
export const SPECIAL_EVENTS: EventTemplate[] = [
  {
    id: 'elixir',
    category: 'ritual',
    title: '方士献丹',
    subtitle: '东海客至，丹炉夜明',
    narrative:
      '有方士自东海来，献九转金丹一匣，自言服之可白日飞升。丹香盈殿，宫人皆屏息。\n\n太医院院使跪奏：此物金石燥烈，恐非血肉之躯所能承受。',
    options: [
      {
        id: 'elixir-take',
        label: '服丹求仙',
        description: '斋戒七日，服下金丹，以观天命。',
        tone: 'radical',
        effects: { treasury: -3, unrest: 1 },
        weight: 0,
        endsReign: 'ascension',
        outcome:
          '丹入喉中，初觉五内如焚，继而通体轻明。第七日，殿上云气盘绕，帝与丹炉俱失所在。',
      },
      {
        id: 'elixir-test',
        label: '死囚试药',
        description: '令死囚先服，验其效验，再议进御。',
        tone: 'cautious',
        effects: { treasury: -1, regent: 1, unrest: 2 },
        weight: 0,
        outcome:
          '三名死囚服药后暴毙，方士下狱。丹炉被封，宫中却仍有人暗传“仙丹”之名。',
      },
      {
        id: 'elixir-reject',
        label: '焚丹逐客',
        description: '当廷焚丹，斥方士以妖言惑众。',
        tone: 'cautious',
        effects: { unrest: -2, treasury: 1 },
        weight: 0,
        outcome:
          '丹丸在殿前化为青烟，方士踉跄出宫。士林闻之，皆称陛下不为方术所动。',
      },
    ],
  },
  {
    id: 'hermit-offer',
    category: 'culture',
    title: '山中隐士',
    subtitle: '一纸樵书，直陈天命',
    narrative:
      '终南山中一名隐士托樵夫递书入宫，言朝廷气数将尽，劝陛下早让贤路，自全令名。\n\n书末只画一叶扁舟，泊于烟水之间。',
    options: [
      {
        id: 'hermit-yield',
        label: '挂冠归隐',
        description: '下诏让位于贤，自乘扁舟入山，不再问朝政。',
        tone: 'cautious',
        effects: { unrest: -3, regent: -2 },
        weight: 0,
        endsReign: 'retirement',
        outcome:
          '禅诏既下，帝解玺绶，乘一叶扁舟入终南烟水。送行者回望良久，唯见白云。',
      },
      {
        id: 'hermit-ask',
        label: '召问治道',
        description: '礼请隐士入朝，问以安民之策。',
        tone: 'balanced',
        effects: { unrest: -3, treasury: 2 },
        weight: 0,
        outcome:
          '隐士入对三日，所言皆切时弊。帝欲授官，隐士辞归，只留一卷《牧民书》。',
      },
      {
        id: 'hermit-arrest',
        label: '按妖言治罪',
        description: '以妄言天命、摇动人心之罪拿下隐士。',
        tone: 'radical',
        effects: { regent: 2, unrest: 3, treasury: -1 },
        weight: 0,
        outcome:
          '隐士被押入京狱，终南山中却开始流传另一句话：朝廷连一个樵夫也容不得。',
      },
    ],
  },
  {
    id: 'feudal-lords',
    category: 'governance',
    title: '诸侯请封',
    subtitle: '裂土之议，再起朝堂',
    narrative:
      '宗室与边镇联名上表，请依古制裂土分封，各领一方，以藩屏王室。\n\n表文写得极恭顺，附上的舆图却已将山河划去大半。',
    options: [
      {
        id: 'lords-partition',
        label: '裂土分封',
        description: '依古制分封诸镇，各领其土，天子但守京畿。',
        tone: 'cautious',
        effects: { regent: 4, army: -2 },
        weight: 0,
        endsReign: 'partition',
        outcome:
          '金册分授，诸镇各归其国。此后天子诏书出京畿百里，便需先问诸侯。',
      },
      {
        id: 'lords-refuse',
        label: '削藩集权',
        description: '当廷驳表，收诸镇兵符，改置郡县。',
        tone: 'radical',
        effects: { regent: 3, unrest: 4, army: -2 },
        weight: 0,
        outcome:
          '诏书一下，诸镇哗然。兵符虽收，驿路上已开始有甲士夜行。',
      },
      {
        id: 'lords-delay',
        label: '温诏缓议',
        description: '赐帛慰劳，命有司从容议之，不即不驳。',
        tone: 'balanced',
        effects: { treasury: -2, regent: 1 },
        weight: 0,
        outcome:
          '诸镇得了赏赐，表文暂压尚书省。事情看似缓了下来，舆图上的墨线却一天比一天深。',
      },
    ],
  },
  {
    id: 'fengshan-request',
    category: 'ritual',
    title: '群臣请封禅',
    subtitle: '岱宗云起，百官待诏',
    narrative:
      '礼部率百官三上表，请陛下登泰山封禅，告成功于天地。\n\n太史令却私奏：近年灾异未绝，此时封禅，恐招物议。',
    options: [
      {
        id: 'fengshan-hold',
        label: '登岱封禅',
        description: '择吉日东巡，登泰山筑坛，行封禅大礼。',
        tone: 'radical',
        effects: { treasury: -5, unrest: -3, regent: -1 },
        weight: 0,
        endsReign: 'fengshan',
        outcome:
          '封礼既成，云开日出。百官山呼万岁，声震山谷。帝立坛上，忽觉此生功业已尽于此。',
      },
      {
        id: 'fengshan-defer',
        label: '谦让不允',
        description: '以德薄年歉为由，却而不行，留待来日。',
        tone: 'cautious',
        effects: { unrest: -2, treasury: 3 },
        weight: 0,
        outcome:
          '三表皆留中，陛下自减膳撤乐一年。百姓闻之，反称其谦德。',
      },
      {
        id: 'fengshan-altar',
        label: '郊坛代礼',
        description: '不赴泰山，只在南郊筑坛告天，以省民力。',
        tone: 'balanced',
        effects: { treasury: -2, unrest: -1 },
        weight: 0,
        outcome:
          '南郊礼成，仪仗虽简，礼数不缺。礼部略觉遗憾，户部却松了一口气。',
      },
    ],
  },
  {
    id: 'last-stand',
    category: 'military',
    title: '城下之盟',
    subtitle: '烽火照阙，敌使叩门',
    narrative:
      '敌骑越过最后一道关隘，列营于京城之外。敌使持书入城，许以划疆而治；守将则请开城门夜袭，或死守宗庙。\n\n宫墙上的火把一夜未熄。',
    options: [
      {
        id: 'stand-die',
        label: '死守社稷',
        description: '不降不走，亲登城楼，与宗庙共存亡。',
        tone: 'radical',
        effects: { army: -6, unrest: 2 },
        weight: 0,
        endsReign: 'martyr',
        outcome:
          '城破之日，帝衣冠坐于宗庙，火起不避。敌骑入宫，只见焦土与一具不肯倒下的玉座。',
      },
      {
        id: 'stand-negotiate',
        label: '城下议和',
        description: '许割地纳币，换敌骑退兵，以图后举。',
        tone: 'cautious',
        effects: { treasury: -8, army: -4, unrest: 3 },
        weight: 0,
        outcome:
          '盟书既定，敌骑带着金帛北去。京城保住了，城门上的守军却久久不肯抬头。',
      },
      {
        id: 'stand-sally',
        label: '夜开城门',
        description: '选死士夜袭敌营，焚其粮草，乱中求生。',
        tone: 'balanced',
        effects: { army: -4, treasury: -3, regent: -1 },
        weight: 0,
        outcome:
          '夜火起于敌营，喊杀声直到天明。敌骑退去，京城残破，却仍挂着朝廷的旗。',
      },
    ],
  },
]

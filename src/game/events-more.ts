import type { EventTemplate } from './types'

/**
 * 第四批日常朝政事件。仍循「每事五策、择二至四呈现、抉择前不列利害」之例，
 * 题材偏重灾荒、吏治、边贸与地方积弊，使长朝后期亦有新事可议。
 */
export const MORE_DAILY_EVENTS: EventTemplate[] = [
  // ── 执政 ─────────────────────────────────────────────
  {
    id: 'locust-plague',
    category: 'governance',
    title: '蝗蝻蔽日',
    subtitle: '飞蝗过境，禾稼一空',
    narrative:
      '蝗虫是从东北方向来的。起初只是天边一层灰黄的云，到了午后便遮住半个日头。落到田里时，声音像下了一场急雨，等声音过去，刚抽穗的粟田只剩下一根根光秆。\n\n老农跪在田埂上，抓起一把蝗虫往嘴里塞，嚼了两口又吐出来，说这东西连苦味都没有。地方官请设坛禳灾，也有县丞主张掘沟焚烧。京仓的粮还没动，粮价已经先涨了三成。',
    options: [
      {
        id: 'locust-buy',
        label: '捕蝗易粟',
        description: '悬赏收蝗，一斗蝗虫换一斗粟，令百姓昼夜扑捕。',
        tone: 'radical',
        effects: { treasury: -3, unrest: -4 },
        weight: 3,
        outcome:
          '一斗蝗换一斗粟的告示贴出后，田里尽是提灯扑蝗的人。蝗势终于压了下去，官仓的粮也见了底；灾民捧着换来的粟米，说这是头一回见蝗虫能当饭吃。',
      },
      {
        id: 'locust-burn',
        label: '掘沟焚野',
        description: '沿田掘沟，夜间燃火诱蝗，焚尽蝗群。',
        tone: 'radical',
        effects: { treasury: -2, unrest: -3 },
        weight: 1,
        outcome:
          '入夜后，沟火连成一条长龙，蝗群扑火而下，焦味传出十里。田里保住了大半秋粮，只是焚野时也烧了几间草棚，塘边的老柳被烧得只剩黑桩。',
      },
      {
        id: 'locust-relief',
        label: '免赋赈饥',
        description: '尽免受灾州县今岁田赋，开仓赈济。',
        tone: 'balanced',
        effects: { treasury: -5, unrest: -2 },
        weight: 3,
        outcome:
          '免赋的诏书与赈粮同时到了州县。百姓在城门口磕头谢恩，户部的账上却多了一个大窟窿；今年的秋税，只能从别处想办法。',
      },
      {
        id: 'locust-pray',
        label: '设坛禳灾',
        description: '命礼部设坛祭蝗神，禁民捕杀，以免触怒天意。',
        tone: 'cautious',
        effects: { treasury: -1, unrest: 2, regent: 1 },
        weight: -2,
        outcome:
          '祭坛上的香火三日不熄，蝗虫却一日多过一日。有老吏跪在坛下哭，说蝗神收了祭品，仍不肯放过这一方人。等到开禁捕蝗，秋粮已经去了七成。',
      },
      {
        id: 'locust-blame',
        label: '严责有司',
        description: '责成州县自筹赈济，捕蝗不力者停俸问罪。',
        tone: 'cautious',
        effects: { regent: 2, unrest: 1 },
        weight: 0,
        outcome:
          '公文在州县之间转了半月，问罪的名单越拉越长，蝗虫却一路吃到邻州。被停俸的县令在衙里苦笑，说早知如此，不如先带人去挖沟。',
      },
    ],
  },
  {
    id: 'clerk-extortion',
    category: 'governance',
    title: '胥吏之害',
    subtitle: '官有清名，吏无廉耻',
    narrative:
      '新上任的县令是个读书人，断案还要翻律书，收税、造册、押解却全靠衙里的老吏。老吏把持案牍十余年，谁家该缴多少、哪桩官司能拖多久，全在他一支笔下。\n\n有农户来告，说交了两石粮，账上只记一石；老吏当堂把仓串翻出来，账目做得滴水不漏。县令看着无懈可击的簿册，沉默了半晌，最后只让农户先回去等消息。',
    options: [
      {
        id: 'clerk-purge',
        label: '清汰胥吏',
        description: '尽罢把持案牍的老吏，另募识字良民补缺。',
        tone: 'radical',
        effects: { regent: -3, unrest: -2, treasury: -1 },
        weight: 3,
        outcome:
          '数十名老吏同日被逐出衙门，案牍一时无人能理，头一个月连税簿都险些造错。可百姓再来告状时，收状纸的书吏会抬头看他们一眼了。',
      },
      {
        id: 'clerk-punish',
        label: '重法惩贪',
        description: '拿办首恶，追赃还民，其余令其具结自新。',
        tone: 'radical',
        effects: { regent: -2, unrest: -3 },
        weight: 3,
        outcome:
          '首恶在衙前枷号三日，追出的粮食堆了半条街。其余胥吏个个写了具结，收税时手也抖了；只是暗地里，他们开始把好处藏得更深。',
      },
      {
        id: 'clerk-pay',
        label: '加俸养廉',
        description: '给胥吏增俸，明定规费，不许额外需索。',
        tone: 'balanced',
        effects: { treasury: -3, regent: -1, unrest: -1 },
        weight: 1,
        outcome:
          '增俸的文书一下，胥吏们头一回领到了足额的月钱。可州县的钱粮本就吃紧，这笔开销只得从别处挪；有人得了俸，仍照旧伸手，只说“月钱是月钱，规矩是规矩”。',
      },
      {
        id: 'clerk-supervise',
        label: '长官约束',
        description: '严令县令亲自核账，胥吏有犯，连坐长官。',
        tone: 'cautious',
        effects: { regent: 1, unrest: 2 },
        weight: -2,
        outcome:
          '县令从此亲自核账，每日熬到三更，仍有看不完的册子。胥吏把账做得更细，细到每一笔都挑不出错；农户再来告状时，县衙只说“查无实据”。',
      },
      {
        id: 'clerk-ignore',
        label: '听之任之',
        description: '以“吏治积弊已久”为由，暂不更张。',
        tone: 'cautious',
        effects: { unrest: 3, regent: 2 },
        weight: -2,
        outcome:
          '衙门的门照旧开着，老吏照旧坐在案后。农户们渐渐不再来告状，只在缴粮时把斗压得低些，又在斗底藏一把沙。官府与民间，各自学会了瞒。',
      },
    ],
  },
  {
    id: 'foundling',
    category: 'governance',
    title: '慈幼之政',
    subtitle: '道旁弃婴，啼声渐弱',
    narrative:
      '城南的育婴堂是前朝留下的，三间破屋，两个老妪，米缸见了底。今春青黄不接，路边的襁褓多了起来，有的裹着半件旧袄，有的只垫一把干草。\n\n老妪把孩子一个个抱进去，说再这样下去，只能挑哭声大的留。城里的富户偶尔施一碗米，更多人家关紧了门，怕被官府摊派。',
    options: [
      {
        id: 'foundling-bureau',
        label: '设慈幼局',
        description: '由官府拨粮设局，收养弃婴，雇乳妇抚育。',
        tone: 'radical',
        effects: { treasury: -4, unrest: -3, regent: -1 },
        weight: 3,
        outcome:
          '慈幼局在城南开了门，乳妇们抱着孩子晒太阳，米粥的香气飘出半条巷。府库为此支出一大笔，却有老臣在朝上说，这是本朝最像样的一桩善政。',
      },
      {
        id: 'foundling-temple',
        label: '令寺院收养',
        description: '拨少量田租给寺院，由僧尼收养弃婴。',
        tone: 'balanced',
        effects: { treasury: -1, unrest: -1, regent: 1 },
        weight: 1,
        outcome:
          '寺院的柴房里添了几十张小床，僧人们轮流照看。孩子活下来了大半，只是寺产因此更紧；方丈几次想开口要田，终究没敢在御前说。',
      },
      {
        id: 'foundling-amnesty',
        label: '免弃婴之罪',
        description: '下诏免究弃婴之人，许其匿名送养，官府不追。',
        tone: 'balanced',
        effects: { unrest: -1, regent: -1 },
        weight: 1,
        outcome:
          '诏书说弃婴者不问，只要把孩子送到慈幼局或寺院。夜里往门口放襁褓的人多了，哭声却少了；有人说这是纵容，也有人说，总比让孩子死在道旁强。',
      },
      {
        id: 'foundling-punish',
        label: '严惩弃婴',
        description: '重罚弃婴父母，以儆效尤。',
        tone: 'cautious',
        effects: { regent: 1, unrest: 2 },
        weight: -2,
        outcome:
          '几个弃婴的农户被枷在城门口，围观的人却比被罚的人更沉默。此后道旁的襁褓少了，河边的浮尸多了；胥吏说，案子算是少了。',
      },
      {
        id: 'foundling-ignore',
        label: '不闻不问',
        description: '以府库不足为由，不设官局，只令地方自行处置。',
        tone: 'cautious',
        effects: { unrest: 3 },
        weight: -2,
        outcome:
          '州县的回文都说“本地民风淳厚，并无弃婴之事”。育婴堂的老妪又老了一岁，米缸空了三日；城南的道旁，草席下偶尔露出半只小鞋。',
      },
    ],
  },
  // ── 军事 ─────────────────────────────────────────────
  {
    id: 'border-smuggle',
    category: 'military',
    title: '边市私贩',
    subtitle: '铁器出关，马匹入塞',
    narrative:
      '边市的榷场设在城墙外半里，白日里官军守门，入夜便换了另一拨人。守卒说，夜里过关的驮队比白日多，驮的是铁锅、农具，有时还有成捆的箭镞。\n\n关外的部落拿马匹和皮毛来换，一转手便是三倍利。边将的幕僚也掺在其中，账册上记的是“损耗”，库里却多出一批良马。守关的队正说，真要查，先从将军的中军帐查起。',
    options: [
      {
        id: 'smuggle-ban',
        label: '严关禁铁',
        description: '加派军士查关，铁器出关者一律没收治罪。',
        tone: 'radical',
        effects: { army: 2, treasury: -2, unrest: 1 },
        weight: 3,
        outcome:
          '关门的铁器被一车车扣下，边将的脸也一天比一天黑。私贩一时绝迹，关外的部落却开始绕道别处；边市冷清了，边军的马价也涨了。',
      },
      {
        id: 'smuggle-official',
        label: '官营互市',
        description: '由官府设栈收买马匹，铁器只准官营，私贩尽罢。',
        tone: 'balanced',
        effects: { treasury: 2, army: 1, regent: -1, unrest: 1 },
        weight: 3,
        outcome:
          '官栈在关下开张，马匹按等论价，铁器一律归官。边军添了新马，私贩却把生意转进了更深的巷子；边将交出了部分兵权，脸色比关外的风还冷。',
      },
      {
        id: 'smuggle-tax',
        label: '开市抽税',
        description: '不禁私贩，只在关津加重税，以其利养边军。',
        tone: 'balanced',
        effects: { treasury: 3, regent: 1, army: -1 },
        weight: 1,
        outcome:
          '关津的税银一车车解进京，边军的粮饷也宽裕了些。只是铁器仍旧出关，只不过每一件都盖了税印；边将笑着说，这叫“官许私贩”。',
      },
      {
        id: 'smuggle-ignore',
        label: '弛禁不问',
        description: '以边市繁荣为由，暂不查禁，只令边将自行约束。',
        tone: 'cautious',
        effects: { army: -3, treasury: 1, regent: 1 },
        weight: -2,
        outcome:
          '边市比往年更热闹，关外的马蹄声也离得更近。边将把“自行约束”四个字裱起来挂在堂上，幕僚们照旧在夜里清点驮队。',
      },
      {
        id: 'smuggle-army',
        label: '缉私扩军',
        description: '募边民为缉私队，许以查获之物充饷。',
        tone: 'radical',
        effects: { army: 2, treasury: -1, unrest: 2 },
        weight: 1,
        outcome:
          '缉私队沿着边墙扎了营，查获的铁器和马匹堆满校场。可这群人渐渐也学会了设卡抽头，边民说，从前只有一个税吏，如今满路都是拿刀的要钱。',
      },
    ],
  },
  {
    id: 'post-road',
    category: 'military',
    title: '驿路断绝',
    subtitle: '羽书迟至，驿马骨立',
    narrative:
      '北边的急报走了十二日才到京，按旧例该是七日。驿丞说，不是不想快，是驿马跑不动了：上等的马被军官牵去私用，驿站的地被豪强占了种田，剩下的驿卒连草料都凑不齐。\n\n兵部派人沿途查看，回来只说了一句“驿路尚通”。可他袖子里藏着一份私记：有三处驿站只剩老卒一名，连换马的槽都是空的。',
    options: [
      {
        id: 'post-repair',
        label: '大修驿道',
        description: '拨帑修驿舍、补驿马，严定程限，误期者论罪。',
        tone: 'radical',
        effects: { treasury: -5, army: 2, unrest: -1 },
        weight: 3,
        outcome:
          '驿道两旁新栽了柳，驿马也换了膘。急报从北边到京，终于又回到七日；只是修驿的银子，够边军吃上三个月。',
      },
      {
        id: 'post-horse',
        label: '募民养马',
        description: '免养马户的杂役，令其代养驿马、应驿差。',
        tone: 'radical',
        effects: { treasury: -3, army: 3, unrest: -1 },
        weight: 3,
        outcome:
          '沿驿的农户领了马驹，免了杂役，草料自己出。三年后驿马渐渐足数，农户却也被驿差缠住，田里的活计常要误上一季。',
      },
      {
        id: 'post-purge',
        label: '严治冒驿',
        description: '清查私用驿马、冒领驿粮者，追赃罢官。',
        tone: 'balanced',
        effects: { regent: -2, treasury: 1, unrest: -1 },
        weight: 1,
        outcome:
          '清查的名单里有几个旧将的名字，兵部犹豫了三日才呈上来。追出的马匹重新入了驿，被罢的军官却在京中四处诉苦，说朝廷卸磨杀驴。',
      },
      {
        id: 'post-merge',
        label: '裁驿并站',
        description: '裁去僻路小驿，只留冲要大站，以省浮费。',
        tone: 'cautious',
        effects: { treasury: 2, army: -2, unrest: 1 },
        weight: -2,
        outcome:
          '僻路上的小驿一间间关了门，驿卒领了遣散钱各奔东西。冲要大站的马是够了，可山里的急报要多绕两日；有县令说，这省下的，是拿人命换的。',
      },
      {
        id: 'post-delay',
        label: '姑且缓修',
        description: '以府库未充为由，令地方自行修补，暂不动官帑。',
        tone: 'cautious',
        effects: { army: -2, unrest: 2 },
        weight: -2,
        outcome:
          '地方的修驿公文在藩司压了半年，驿站的破屋先用木头顶着。北边的急报仍是一日慢过一日，兵部的堂官看着地图，把“七日”改成了“旬日”。',
      },
    ],
  },
  // ── 经济 ─────────────────────────────────────────────
  {
    id: 'iron-works',
    category: 'economy',
    title: '铁冶官营',
    subtitle: '炉火照山，利归何处',
    narrative:
      '南山的铁冶已经开了百年，炉火昼夜不熄，山下的溪水被淬铁染成赭色。铁冶原由几家大户承包，岁课一年比一年少，运进京的铁器却一年比一年贵。\n\n有臣请收归官营，说一岁可增课银数万；冶户们却连夜聚在炉前，说官营之后，炉头换成胥吏，工钱必减，炉子迟早要熄。山道上，运铁的车马与运粮的车马挤在一处。',
    options: [
      {
        id: 'iron-official',
        label: '尽收官营',
        description: '收铁冶归官，设铁官统管，岁课尽入国库。',
        tone: 'radical',
        effects: { treasury: 4, regent: 2, unrest: 2 },
        weight: 3,
        outcome:
          '铁官带着兵丁进了山，炉子一座座换了主人。岁课果然翻了一番，冶户却散去大半；铁官说缺人手，便从流民里补，烧出的铁，成色不如从前。',
      },
      {
        id: 'iron-supervised',
        label: '官督民营',
        description: '仍由冶户经营，官府派员监炉、按炉抽课。',
        tone: 'balanced',
        effects: { treasury: 2, army: 1, regent: -1 },
        weight: 3,
        outcome:
          '冶户保住了炉子，官府在炉边设了监官。课银稳中有升，铁器也还过得去；监官与炉头渐渐熟络起来，逢年过节，山道上总多几辆不载铁的驴车。',
      },
      {
        id: 'iron-lease',
        label: '招商承买',
        description: '将铁冶分作数区，公开召商承买，价高者得。',
        tone: 'balanced',
        effects: { treasury: 1, unrest: -1 },
        weight: 1,
        outcome:
          '承买的告示贴出后，山下的富商争相投标。铁冶的炉火没停，官府也落了一笔现银；只是中标的多是旧日承包的大户换了块招牌，冶户的工钱仍由他们说了算。',
      },
      {
        id: 'iron-ban',
        label: '严禁私冶',
        description: '封小炉、禁私铁，只留官炉，以绝盗铸。',
        tone: 'cautious',
        effects: { treasury: -1, army: 1, unrest: 3 },
        weight: -2,
        outcome:
          '山里的私炉被一座座封了，炉工们把铁钳扔进溪里，背起铺盖下山。私铁确实少了，铁价却涨得更快；有老兵说，如今打一把锄头，比打一把刀还贵。',
      },
      {
        id: 'iron-keep',
        label: '维持旧制',
        description: '不改变承包旧例，只令大户多缴岁课。',
        tone: 'cautious',
        effects: { treasury: -1, regent: 1 },
        weight: 0,
        outcome:
          '大户们满口应承，岁课也添了一些。可账册上的铁课仍是用旧斗量、旧秤称，冶户说，山还是那座山，炉还是那座炉，只是官府的秤一年比一年轻。',
      },
    ],
  },
  {
    id: 'granary-rot',
    category: 'economy',
    title: '仓廪之蠹',
    subtitle: '陈粮如土，账册如山',
    narrative:
      '常平仓的仓门一开，霉味冲得人后退半步。仓里的粟米结成了硬块，用锄头才刨得动；仓吏说，这是三年前的陈粮，按例早该轮换，可轮换的公文一直压在转运司。\n\n账册上写着一万二千石，实际点验不足八千。亏空的数目，正好与仓吏去年新置的宅子差不多。转运使的批语只有一句：“灾年将至，先不要声张。”',
    options: [
      {
        id: 'granary-investigate',
        label: '彻底清查',
        description: '派御史清仓查账，亏空者追赃论罪。',
        tone: 'radical',
        effects: { treasury: 1, regent: -2, unrest: -1 },
        weight: 3,
        outcome:
          '御史带着算盘进了仓，一笔笔对到深夜。追出的粮食填回了半个仓廪，被拿办的仓吏在狱里供出一串名字；转运使的批语，也一并呈到了御前。',
      },
      {
        id: 'granary-burn',
        label: '焚粮换新',
        description: '焚毁霉粮，急调新粮入仓，先行赈济。',
        tone: 'radical',
        effects: { treasury: -2, unrest: -3 },
        weight: 1,
        outcome:
          '霉粮在仓外烧了三日，黑烟飘到城头。新粮从邻道调来，虽贵了些，粥棚总算又支了起来；仓吏站在灰堆旁，说自己也是奉命行事。',
      },
      {
        id: 'granary-recover',
        label: '追赃补仓',
        description: '令亏空者限期补足，过期则以家产抵偿。',
        tone: 'balanced',
        effects: { treasury: 2, regent: -1, unrest: 1 },
        weight: 3,
        outcome:
          '限期的告示贴在仓门上，仓吏们四处借粮，有的卖了宅子，有的把儿子送去商号做学徒。仓廪补回了大半，民间却多了不少怨言，说官府翻脸比翻书还快。',
      },
      {
        id: 'granary-fill',
        label: '责令填补',
        description: '不究旧账，只令转运司设法补足，以免动摇人心。',
        tone: 'cautious',
        effects: { regent: 2, unrest: 2 },
        weight: -2,
        outcome:
          '转运司用新粮填了旧账，账面上又成了一万二千石。亏空的人松了口气，仓里的老鼠却照旧肥；有老吏私下说，这仓里的粮，从来只在账上满过。',
      },
      {
        id: 'granary-hide',
        label: '遮掩了事',
        description: '命仓吏自行处置，勿使外间知晓。',
        tone: 'cautious',
        effects: { unrest: 3, regent: 1 },
        weight: -2,
        outcome:
          '仓门重新钉上，霉粮被翻到最底下，上面压了一层新谷。入冬后粥棚照旧开，可领到的粥越来越稀；百姓不知道仓里的事，只知道肚子比去年更空。',
      },
    ],
  },
  {
    id: 'salt-smuggle',
    category: 'economy',
    title: '私盐横行',
    subtitle: '官引壅滞，枭徒满路',
    narrative:
      '官盐的引票堆在盐运司，一年也销不完；市面上的私盐却比官盐便宜一半，连县衙的厨下都买私盐。盐枭们有自己的船、自己的路，甚至有自己的寨子，官军几次围捕，都扑了个空。\n\n盐运使说，私盐不除，官课难足；可被拿住的私盐贩子里，十个有九个是失了盐田的灶户。他们挑着担子走几十里山路，不过是为了换几斗米。',
    options: [
      {
        id: 'salt-amnesty',
        label: '招安盐枭',
        description: '赦免胁从，收其船寨，编入盐丁，给以官引。',
        tone: 'radical',
        effects: { unrest: -2, army: 1, treasury: 1 },
        weight: 3,
        outcome:
          '盐枭们把船撑到盐运司码头，交出了私引和兵器。编入盐丁后，官盐的船队添了几十艘快船；只是昔日的枭首仍管着旧部，官盐的价，也悄悄由他们定了一半。',
      },
      {
        id: 'salt-cutprice',
        label: '减盐价',
        description: '削减盐课，降低官盐价格，以平价挤走私盐。',
        tone: 'balanced',
        effects: { treasury: -2, unrest: -3 },
        weight: 3,
        outcome:
          '官盐的价一降，私盐便没了赚头。灶户重新领了官引，市面上的盐价也稳了下来；盐运司的账上却少了一大笔，盐运使捧着账本，说这买卖做得窝囊。',
      },
      {
        id: 'salt-hunt',
        label: '严缉私盐',
        description: '沿盐路设卡，缉获私盐尽数充公，贩者重罚。',
        tone: 'radical',
        effects: { treasury: -1, army: 1, unrest: 2 },
        weight: 1,
        outcome:
          '盐路上新设了十几道卡，缉获的私盐堆成小山。可盐枭改走水路，官军不习水战，追了半月只烧了两条空船；灶户们则说，官盐吃不起，只能接着挑担子。',
      },
      {
        id: 'salt-share',
        label: '官商分利',
        description: '许大商领引包销，官商按成分配盐利。',
        tone: 'balanced',
        effects: { treasury: 2, regent: 1 },
        weight: 1,
        outcome:
          '几家大盐商领了引票，官盐的销路一下子通了。国库的盐课按时解到，市面上的盐价却还是由那几家说了算；小灶户的盐，仍旧只能卖给私贩。',
      },
      {
        id: 'salt-ignore',
        label: '纵之不问',
        description: '以“盐枭势大，恐激民变”为由，暂缓查缉。',
        tone: 'cautious',
        effects: { treasury: -2, unrest: 2, regent: 2 },
        weight: -2,
        outcome:
          '盐运司的缉私船停在港里生了锈，私盐的路越走越宽。盐枭们开始给地方官送“节礼”，县衙的厨下，仍旧吃着比官盐便宜的私盐。',
      },
    ],
  },
  {
    id: 'temple-land',
    category: 'economy',
    title: '寺田侵民',
    subtitle: '钟磬日盛，田亩日削',
    narrative:
      '城外的古寺又添了一座新殿，殿前的功德碑上刻满了施主的名字。可碑后的田契，却有半数是从附近农户手里“施”来的——施田之后，农户仍旧耕种，只是租子改交给了寺院。\n\n寺里不纳赋，不服役，田产越积越多；县衙的税册上，那些田却还挂在农户名下。县官去查，方丈只拿出前朝的敕额，说这田是“奉旨免科”的。',
    options: [
      {
        id: 'temple-return',
        label: '括寺田还民',
        description: '清查寺观侵夺之田，尽数还民，照例纳赋。',
        tone: 'radical',
        effects: { treasury: 3, unrest: -3, regent: -1 },
        weight: 3,
        outcome:
          '清查的告示贴到寺门口，方丈捧着敕额跪在阶下。侵夺的田亩一处处还了民，税册也重新造过；寺里的钟声照旧，只是新殿的工程停了。',
      },
      {
        id: 'temple-buy',
        label: '赎买寺田',
        description: '由官府出钱赎回寺田，分给无地农户。',
        tone: 'balanced',
        effects: { treasury: -3, unrest: -1 },
        weight: 3,
        outcome:
          '官府按市价赎回了大半寺田，分给无地农户耕种。方丈收了银子，说这是“两便”；农户捧着新地契，却听说那银子是从他们明年的赋税里预支的。',
      },
      {
        id: 'temple-limit',
        label: '限田定额',
        description: '定寺观田产之限，超额者照民田纳赋。',
        tone: 'balanced',
        effects: { treasury: 1, unrest: -1, regent: 1 },
        weight: 1,
        outcome:
          '寺观的田产被画了一条线，超出的部分照民田起科。方丈们嘴上称颂圣明，私下却把田产挂到别家寺观名下；县衙的税册，比从前更难查了。',
      },
      {
        id: 'temple-self',
        label: '令僧道自陈',
        description: '不派官清查，只令寺观自报田产，限期具结。',
        tone: 'cautious',
        effects: { regent: 2, unrest: 1 },
        weight: -2,
        outcome:
          '寺观的自陈文书一份份递上来，数目都恰到好处地压在限额之内。方丈们具结画押，县官收下文书，彼此都松了口气；田里的佃户，照旧把租子挑进寺里。',
      },
      {
        id: 'temple-grant',
        label: '崇佛赐田',
        description: '为祈国运，拨官田赐寺，广建道场。',
        tone: 'cautious',
        effects: { treasury: -3, regent: 2, unrest: -1 },
        weight: -2,
        outcome:
          '官田的界石换成了寺产，新殿的香火旺得照眼。方丈在御前诵经祈福，说这是为陛下延寿；户部的账上，又少了一处能收租的田。',
      },
    ],
  },
  // ── 宗庙 ─────────────────────────────────────────────
  {
    id: 'quarantine',
    category: 'governance',
    title: '疫起城南',
    subtitle: '一巷闭门，满城惊惧',
    narrative:
      '城南的时疫是从一口井开始的。先是几户人家发热咳嗽，不到十日，巷口的棺材铺便昼夜赶工。医官说是“时气”，可药方还是几十年前的旧本，药铺里的柴胡已经涨到三两银子一两。\n\n有吏请封巷，说疫气会顺着人流传；巷里的百姓却堵在栅栏后，说封了巷，没病的也要饿死。更麻烦的是，城外的流民还在往城里涌，谁也不知道他们身上带没带疫气。',
    options: [
      {
        id: 'quarantine-lock',
        label: '封城隔离',
        description: '封城南疫巷，设栅栏，米粮由官府送入，严禁出入。',
        tone: 'radical',
        effects: { unrest: -3, treasury: -2, regent: 1 },
        weight: 3,
        outcome:
          '栅栏在巷口立起来，官军轮班守着，米粮一日一送。疫气渐渐断了，巷里却也有人饿死；守栅的军士说，他们每日听见里面哭，分不清是病死还是饿的。',
      },
      {
        id: 'quarantine-medicine',
        label: '遣医施药',
        description: '征召医官入疫巷，广施汤药，设病坊收治。',
        tone: 'radical',
        effects: { treasury: -4, unrest: -4 },
        weight: 3,
        outcome:
          '医官们背着药箱进了疫巷，病坊里日夜熬药。死者仍有，却比预想的少了许多；药钱花得像流水，太医院的老医官说，这已经是他见过最像样的一次救疫。',
      },
      {
        id: 'quarantine-shelter',
        label: '设病坊收治',
        description: '在城外设病坊，收治患者，家属不得探视。',
        tone: 'balanced',
        effects: { treasury: -2, unrest: -2 },
        weight: 1,
        outcome:
          '城外的病坊搭起了草棚，患者被一车车送出去。城里的疫气淡了，病坊里却缺医少药；有家属隔着栅栏喊名字，里面应声的越来越少。',
      },
      {
        id: 'quarantine-expel',
        label: '驱逐患者',
        description: '将患者逐出城去，焚其衣物，以绝疫气。',
        tone: 'cautious',
        effects: { unrest: 3, regent: 1 },
        weight: -2,
        outcome:
          '患者被赶出城门，衣物在城下烧成黑灰。城里的人暂时安心了，城外却多了一群无家可归的病人；几日之后，疫气又从另一座城门进来。',
      },
      {
        id: 'quarantine-hide',
        label: '讳疫不报',
        description: '令有司不得声张，只称“偶感风寒”，以免惊动人心。',
        tone: 'cautious',
        effects: { unrest: 4, regent: 2 },
        weight: -2,
        outcome:
          '公文上只写“时气流行，民多咳嗽”，棺材铺的生意却瞒不住人。等到朝廷终于肯发药，城南的巷子已经空了一半；活着的人说，官府不说，我们自己知道。',
      },
    ],
  },
  // ── 文教 ─────────────────────────────────────────────
  {
    id: 'play-ban',
    category: 'culture',
    title: '市井演戏',
    subtitle: '优人讽世，满城争看',
    narrative:
      '东市的瓦子里新排了一出戏，说的是一个糊涂官断案，越断越糊涂，最后把原告和被告都关进了大牢。看客笑得前仰后合，散场后却有人低声说，这戏里的事，怎么听着像本朝的某位大员。\n\n教坊司的官吏来看了两回，回去写折子，说优人“托讽朝政，惑乱人心”。可戏班子的票已经卖到了下月，连宫里的内侍都偷偷换了便服去看。',
    options: [
      {
        id: 'play-allow',
        label: '弛禁观戏',
        description: '不禁瓦舍演戏，只令教坊司暗中记下讥刺过甚者。',
        tone: 'radical',
        effects: { treasury: 2, unrest: -2, regent: -1 },
        weight: 3,
        outcome:
          '瓦子的锣鼓照旧响着，看客的笑声传过半条街。市面因此热闹起来，商税也多收了些；教坊司的暗记写了一本，却始终没有呈上来。',
      },
      {
        id: 'play-new',
        label: '命编新戏',
        description: '命教坊司编演忠孝新戏，以正人心。',
        tone: 'radical',
        effects: { treasury: -1, unrest: -1, regent: 1 },
        weight: 1,
        outcome:
          '教坊司连夜编了几出新戏，唱的是忠臣孝子、烈女义仆。看客起初还来，后来便嫌闷，场子又渐渐回到旧戏班手里；新戏的词，被优人改了几个字，反倒更好笑了。',
      },
      {
        id: 'play-official',
        label: '设官戏班',
        description: '收编民间戏班入教坊，由官府给俸、演官戏。',
        tone: 'balanced',
        effects: { treasury: -3, unrest: -2, regent: -1 },
        weight: 3,
        outcome:
          '戏班领了教坊的牌子，名角儿们穿上官给的戏服，唱的都是朝廷定下的本子。瓦子里的野戏少了，城外的私戏却多了；有看客说，还是从前骂官的那几出好听。',
      },
      {
        id: 'play-ban',
        label: '禁演讥刺',
        description: '禁演讥刺朝政之戏，违者杖责、班主充军。',
        tone: 'cautious',
        effects: { regent: 2, unrest: 2 },
        weight: -2,
        outcome:
          '教坊司带着差役封了瓦子，戏班班主被枷在门口。看客散去，街面上安静了；可茶馆里、酒肆里，那些不能上台的话，反而传得更快。',
      },
      {
        id: 'play-ignore',
        label: '听之任之',
        description: '以“优人俳谐，不足为虑”为由，不加干预。',
        tone: 'cautious',
        effects: { regent: -1, unrest: 1 },
        weight: 0,
        outcome:
          '朝廷没有下旨，瓦子的戏便越演越放。有官员被编进戏里，气得在家摔了茶盏；市井百姓却把戏词编成小曲，挑着担子也会哼上两句。',
      },
    ],
  },
  // ── 军事（沿用军屯） ──────────────────────────────────
  {
    id: 'military-farm',
    category: 'military',
    title: '屯田废弛',
    subtitle: '军田尽典，战士无粮',
    narrative:
      '边镇的屯田原本够军粮一半，如今却十不存三。军官把军田典给豪强，每年收租，士卒反倒成了佃户，替自己的长官种地。朝廷按册发放的军粮，层层转手，到了营里只剩糙米和糠。\n\n老卒蹲在田埂上，指着远处一片好地说，那本是他所在的屯，如今地契在城里某位老爷的匣子里。他说这话时，手里还攥着一把没扬净的谷子。',
    options: [
      {
        id: 'farm-investigate',
        label: '清查屯田',
        description: '派员清丈军屯，赎回典卖之田，重新分给军户。',
        tone: 'radical',
        effects: { army: 2, treasury: 2, regent: -1, unrest: 1 },
        weight: 3,
        outcome:
          '清丈的绳子从营外拉到山脚，典出去的地一处处收了回来。军户重新分了田，边军的粮仓也渐渐有了底；只是城里几位老爷的匣子空了，弹劾的折子随后就到。',
      },
      {
        id: 'farm-reclaim',
        label: '招民垦荒',
        description: '招募流民开垦荒地，三年免赋，以充军粮。',
        tone: 'balanced',
        effects: { treasury: 2, unrest: -3, army: -1 },
        weight: 3,
        outcome:
          '流民在边地搭起窝棚，荒地一亩亩被翻开。三年之后，边镇的粮价降了下来，可新垦的多是民田，军屯仍空着一半；守将说，至少饥民不再往关外跑了。',
      },
      {
        id: 'farm-convert',
        label: '军屯改民屯',
        description: '将残存军屯改为民屯，按亩收租，以租养军。',
        tone: 'balanced',
        effects: { treasury: 1, army: -1, unrest: -1 },
        weight: 1,
        outcome:
          '军屯的牌子换成了民屯，佃户们按亩交租，官府用租粮折银养军。账面上清爽了许多，边军却没了自己的田；将官说，往后军粮全看天时，比看敌人还难。',
      },
      {
        id: 'farm-punish',
        label: '严追侵田',
        description: '追查典卖军田的军官，抄没家产，田归军屯。',
        tone: 'radical',
        effects: { treasury: 1, army: 1, regent: -2, unrest: 2 },
        weight: 3,
        outcome:
          '几个军官被押解进京，抄出的地契装了满满一箱。军田归了屯，边军也添了粮；可营中人人自危，有老兵说，连长官都被拿了，谁还肯替朝廷卖命。',
      },
      {
        id: 'farm-ignore',
        label: '因循不查',
        description: '以“边事方急，不宜内讧”为由，暂不追查。',
        tone: 'cautious',
        effects: { army: -3, treasury: -1, unrest: 1 },
        weight: -2,
        outcome:
          '清查的公文被压在兵部抽屉里，军田的地契仍锁在城里老爷的匣中。秋后发饷，营里又闹了一场；老卒把军牌挂在田埂的树上，说这地，早就不姓朝廷了。',
      },
    ],
  },
]

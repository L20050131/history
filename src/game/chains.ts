import type { ChainTemplate } from './types'

/**
 * 史鉴事件链。改编自中国历史上的重大转折，固定触发、固定选项，
 * 选项效果不受日辰吉凶影响，也不计入当年岁评。
 */
export const CHAINS: ChainTemplate[] = [
  {
    id: 'qin-reform',
    name: '渭水新法',
    inspiration: '商鞅变法',
    summary: '客卿献策，欲以严刑峻法重塑山河。旧族与新兴之士，将在朝堂上正面相撞。',
    steps: [
      {
        title: '求贤令下',
        narrative:
          '一名来自关东的客卿献上《强邦九策》，主张废井田、开阡陌，行什伍连坐，以耕战立国。\n\n宗室老臣当廷斥其“刻薄寡恩”，年轻官吏却目光灼灼。改与不改，皆将载入史册。',
        options: [
          {
            id: 'qin-reform-1-radical',
            label: '锐意更法',
            description: '徙木立信，废世卿，奖耕战，举国一体推行新法。',
            tone: 'radical',
            effects: { treasury: 12, army: 8, unrest: 5, regent: -6 },
            weight: 0,
            outcome:
              '新法雷厉风行，关中沃野尽辟，仓廪数年之间便告充实，军功爵制让庶民看到了上升之阶。旧族怨望，市井亦因连坐之法而惶惶。',
          },
          {
            id: 'qin-reform-1-balanced',
            label: '先试三郡',
            description: '择三郡试行新法，三年有成再推及全国。',
            tone: 'balanced',
            effects: { treasury: 3, army: 3, unrest: 2 },
            weight: 0,
            outcome:
              '三郡仓廪渐实，新军初具规模。新法未必尽善，却给了朝廷回旋与修正的余地。',
          },
          {
            id: 'qin-reform-1-cautious',
            label: '守祖宗法',
            description: '逐客卿，罢新法之议，以安宗室与旧臣之心。',
            tone: 'cautious',
            effects: { treasury: -3, army: -2, regent: 3, unrest: -2 },
            weight: 0,
            outcome:
              '客卿挂冠而去，宗室欢宴三日。旧法安稳，可边军粮械的缺口也依旧安稳地留在账上。',
          },
        ],
      },
      {
        title: '刑上大夫',
        narrative:
          '新法推行数年，太子触犯禁令。按律当刑其傅，黥其师。宗室哗然，天下人都在等陛下如何落子。\n\n法若不能及贵，便只是一纸空文。',
        options: [
          {
            id: 'qin-reform-2-radical',
            label: '刑其师傅',
            description: '依法处置太子傅、师，昭示“法不阿贵”。',
            tone: 'radical',
            effects: { regent: -8, army: 6, treasury: 4, unrest: -2 },
            weight: 0,
            outcome:
              '刑刀落下，举国震动。此后数年，无人敢公然枉法，亦无人敢再以宗室自恃，法令之威直透里巷。',
          },
          {
            id: 'qin-reform-2-balanced',
            label: '罚而不刑',
            description: '夺其俸禄、闭门思过，为太子与宗室留一分体面。',
            tone: 'balanced',
            effects: { regent: 4, unrest: 4, treasury: -2 },
            weight: 0,
            outcome:
              '宗室松了一口气，新法却从此有了可以商量的余地。各地豪强开始试探朝廷的底线。',
          },
          {
            id: 'qin-reform-2-cautious',
            label: '尽废新法',
            description: '借此案罢黜客卿，恢复旧制，以息宗室之怒。',
            tone: 'cautious',
            effects: { treasury: -8, army: -4, regent: 6 },
            weight: 0,
            outcome:
              '客卿在渭水边被车裂。新法尽废，旧族弹冠相庆，边军却失去了赖以强盛的军功之制。',
          },
        ],
      },
    ],
  },
  {
    id: 'fanyang',
    name: '渔阳鼙鼓',
    inspiration: '安史之乱',
    summary: '边镇坐大，胡将拥兵。朝廷抚之则尾大不掉，削之则烽烟立起。',
    steps: [
      {
        title: '三镇入朝',
        narrative:
          '北疆三镇节度使联袂入朝，请增军饷、请授子弟官职，言语恭敬，甲士却在校场外列阵。\n\n宰相低声说：“此辈久不奉调，今日若不裁抑，来日恐难制。”',
        options: [
          {
            id: 'fanyang-1-radical',
            label: '削其兵柄',
            description: '以入朝为名留其京师，分三镇为六，另遣文臣监军。',
            tone: 'radical',
            effects: { army: -10, regent: 8, unrest: 6, treasury: 2 },
            weight: 0,
            outcome:
              '三镇兵权被夺，节度使困居京邸。边军哗然，朝廷不得不以重金安抚；朝中权臣则借机接管了大半兵符。',
          },
          {
            id: 'fanyang-1-balanced',
            label: '厚赐安之',
            description: '增饷赐爵，暂安其心，同时暗中整顿内地武备。',
            tone: 'balanced',
            effects: { treasury: -10, army: 3, regent: 4 },
            weight: 0,
            outcome:
              '节度使携赏而归，边关暂安。内地的府兵与武备也在悄悄恢复，只是时间未必站在朝廷一边。',
          },
          {
            id: 'fanyang-1-cautious',
            label: '严旨申饬',
            description: '斥其僭越，勒令交出兵权，否则以谋逆论。',
            tone: 'cautious',
            effects: { regent: 6, army: -6, unrest: 2 },
            weight: 0,
            outcome:
              '诏书出京，三镇皆称“清君侧”。边军与朝廷撕破了最后一层脸皮，烽火已在地平线上亮起。',
          },
        ],
      },
      {
        title: '渔阳兵起',
        narrative:
          '渔阳鼓角连天，叛军以“诛奸臣、清君侧”为名南下。沿途郡县或降或溃，京师震动。\n\n御案上摆着三份方略：亲征、固守、借兵。每一份都写着不同的代价。',
        options: [
          {
            id: 'fanyang-2-radical',
            label: '御驾亲征',
            description: '尽发京营与天下勤王之师，亲临前线决战。',
            tone: 'radical',
            effects: { army: -8, treasury: -10, unrest: 4, regent: -5 },
            weight: 0,
            outcome:
              '天子旌旗出现在前线，将士死战，叛军终被逐退。京营与府库却已元气大伤，天下户口十失其三。',
          },
          {
            id: 'fanyang-2-balanced',
            label: '坚守潼关',
            description: '扼守关隘，坚壁清野，待叛军内部分裂。',
            tone: 'balanced',
            effects: { army: -3, treasury: -5, regent: 2, unrest: 1 },
            weight: 0,
            outcome:
              '潼关闭门不出，叛军顿兵坚城之下。一年后其内部果然生变，朝廷得以侥幸保全。',
          },
          {
            id: 'fanyang-2-cautious',
            label: '借兵外族',
            description: '许以厚利，借外族精骑入援，速解京师之围。',
            tone: 'cautious',
            effects: { army: 6, treasury: -12, unrest: 2, regent: 2 },
            weight: 0,
            outcome:
              '外族骑兵入京，叛军溃散。京师保住，府库却被劫掠一空，外族从此也知道了中原的虚实。',
          },
        ],
      },
    ],
  },
  {
    id: 'salt-debate',
    name: '盐铁廷议',
    inspiration: '盐铁会议',
    summary: '贤良文学与理财之臣当廷对辩：国用与民力，究竟该向哪一边倾斜？',
    steps: [
      {
        title: '贤良对策',
        narrative:
          '朝廷召集天下贤良文学，问以治道。儒生们痛陈盐铁官营“与民争利”，理财之臣则反问：不榷山海，军饷从何而来？\n\n殿上争论三日，天下人都在等一句定论。',
        options: [
          {
            id: 'salt-1-radical',
            label: '尽榷盐铁',
            description: '盐铁尽归官营，设场置吏，严禁私煮私贩。',
            tone: 'radical',
            effects: { treasury: 14, unrest: 5, regent: 2 },
            weight: 0,
            outcome:
              '官营之法全面推行，府库数月充盈，边军欠饷一扫而空，连年亏空竟就此填平。盐户与铁商虽有怨声，私盐之利亦渐为官课所夺。',
          },
          {
            id: 'salt-1-balanced',
            label: '官民分利',
            description: '官设场监税，许民户承包煮盐，铁器仍由官售。',
            tone: 'balanced',
            effects: { treasury: 5, unrest: 2 },
            weight: 0,
            outcome:
              '国用与民力各得其所，财政渐稳。豪商借承包之名层层盘剥，是这场折中留下的隐患。',
          },
          {
            id: 'salt-1-cautious',
            label: '尽罢榷法',
            description: '罢盐铁官营，弛山泽之禁，与民休息。',
            tone: 'cautious',
            effects: { treasury: -5, unrest: -4 },
            weight: 0,
            outcome:
              '盐铁重归民间，市价回落，百姓称便。度支尚书却连夜上疏：不出三年，边饷必缺。',
          },
        ],
      },
      {
        title: '均输平准',
        narrative:
          '盐铁之法既定，理财之臣又请行均输、平准：由官府统购天下货物，贱买贵卖，以平物价、充国用。\n\n反对者说，此乃天子与商贾争利；支持者说，富商大贾囤积居奇，才该有人制衡。',
        options: [
          {
            id: 'salt-2-radical',
            label: '行均输法',
            description: '于天下广设均输官，官府统购统销，平抑物价。',
            tone: 'radical',
            effects: { treasury: 11, unrest: 2, regent: 3 },
            weight: 0,
            outcome:
              '均输官遍布郡国，物价果然平抑，府库亦得充盈，豪商囤积居奇之利自此大减。地方官借机中饱，是这桩善政暗处的蛀孔。',
          },
          {
            id: 'salt-2-balanced',
            label: '京畿试行',
            description: '只在京畿试行均输，观察数岁，再议推广。',
            tone: 'balanced',
            effects: { treasury: 3, unrest: 1 },
            weight: 0,
            outcome:
              '京畿物价渐稳，试行尚有成效。地方未受惊扰，保守与进取之间总算留了一步余地。',
          },
          {
            id: 'salt-2-cautious',
            label: '尽废新法',
            description: '罢均输、平准，尽废盐铁新法，复归旧制。',
            tone: 'cautious',
            effects: { treasury: -4, unrest: -2 },
            weight: 0,
            outcome:
              '理财之臣去位，新法尽废。民间称颂朝廷宽仁，边关的军饷却又开始拖欠。',
          },
        ],
      },
    ],
  },
  {
    id: 'western-road',
    name: '凿空西域',
    inspiration: '张骞通西域',
    summary: '河西以西，黄沙万里。有人看见商路与强邻，有人只看见无底的军费。',
    steps: [
      {
        title: '募使西域',
        narrative:
          '匈奴使节在边市上耀武扬威，带来西域诸国的消息。郎官上书，请遣使西行，联合诸国，断匈奴右臂。\n\n朝臣争论：万里凿空，值得吗？',
        options: [
          {
            id: 'west-1-radical',
            label: '遣使凿空',
            description: '募勇士西行，携金帛通好诸国，开辟商道。',
            tone: 'radical',
            effects: { treasury: -8, army: 2, regent: 3, unrest: -2 },
            weight: 0,
            outcome:
              '使团西出阳关，百余人去，十余人还。带回的葡萄、苜蓿与诸国地图，让朝堂第一次看见了更远的天下。',
          },
          {
            id: 'west-1-balanced',
            label: '屯田河西',
            description: '不遣远使，先在河西屯田设郡，稳步经营。',
            tone: 'balanced',
            effects: { treasury: -3, army: 4, regent: 1 },
            weight: 0,
            outcome:
              '河西荒地渐成良田，边军有了立足之地。西域商路尚未打通，河西走廊却已牢牢握在手中。',
          },
          {
            id: 'west-1-cautious',
            label: '闭关绝使',
            description: '以劳民伤财为由，闭关绝使，专务内政。',
            tone: 'cautious',
            effects: { treasury: 2, army: -3, unrest: 1 },
            weight: 0,
            outcome:
              '关禁重设，西域使团被挡在关外。省下了一笔钱，也省掉了与更远世界相遇的机会。',
          },
        ],
      },
      {
        title: '丝路初通',
        narrative:
          '多年经营之后，商队终于沿着河西走廊往来不绝。西域诸国遣使入贡，请求汉家设都护、护商道。\n\n有人请设都护以扬国威，有人主张节用，只置亭障。',
        options: [
          {
            id: 'west-2-radical',
            label: '设都护府',
            description: '设西域都护，驻军护道，统辖诸国。',
            tone: 'radical',
            effects: { treasury: 6, army: 4, regent: 5, unrest: -3 },
            weight: 0,
            outcome:
              '都护府立于西域，商道大通，岁入可观。都护手握重兵与财权，渐渐成了朝中不可小觑的边镇势力。',
          },
          {
            id: 'west-2-balanced',
            label: '置亭障',
            description: '只设亭障驿站，保护商旅，不介入诸国纷争。',
            tone: 'balanced',
            effects: { treasury: 3, army: 2, regent: 2 },
            weight: 0,
            outcome:
              '亭障相连，商旅有恃。朝廷省下了驻军之费，西域诸国也仍保有自立之地。',
          },
          {
            id: 'west-2-cautious',
            label: '罢都护',
            description: '以边费浩大为由，撤都护，闭玉门，专守关内。',
            tone: 'cautious',
            effects: { treasury: -4, army: -5, regent: -4 },
            weight: 0,
            outcome:
              '都护府撤离，玉门关闭。商路断绝，西域诸国重新倒向强邻，河西再闻胡笳。',
          },
        ],
      },
    ],
  },
  {
    id: 'imperial-exam',
    name: '曲江题名',
    inspiration: '科举取士',
    summary: '一张榜单，牵动天下士子。门第与才学，将在这个春天分出高下。',
    steps: [
      {
        title: '春闱放榜',
        narrative:
          '进士科放榜，寒门举子与世家子弟同场竞逐。世家主张“取士当先门第”，寒门则请“唯才是举”。\n\n曲江池畔，新科进士的题名诗已经写满墙壁。',
        options: [
          {
            id: 'exam-1-radical',
            label: '广收寒门',
            description: '扩大取士名额，专设寒素之科，抑制门荫。',
            tone: 'radical',
            effects: { unrest: -3, regent: -4, treasury: -2 },
            weight: 0,
            outcome:
              '寒门士子大批入仕，朝堂气象一新。世家门阀怨声载道，称此举“乱祖宗成法”。',
          },
          {
            id: 'exam-1-balanced',
            label: '如额取士',
            description: '维持旧额，只严核试卷，不许公然请托。',
            tone: 'balanced',
            effects: { regent: -1, unrest: -1 },
            weight: 0,
            outcome:
              '科场大体无弊，寒门仍有出路，门第也未被彻底撼动。两边都不甚满意，却也都能接受。',
          },
          {
            id: 'exam-1-cautious',
            label: '专用门荫',
            description: '罢进士科，恢复门荫与荐举，以安世家之心。',
            tone: 'cautious',
            effects: { regent: 6, unrest: 5, treasury: 1 },
            weight: 0,
            outcome:
              '世家子弟弹冠相庆，寒门士子散去四方。朝堂的官位很快被几家大姓填满，连诏书都带着门第的气味。',
          },
        ],
      },
      {
        title: '座主门生',
        narrative:
          '科场旧例，新科进士须拜主考官为“座主”，自称“门生”。数年后，这些门生已遍布台省，隐隐自成一党。\n\n有人请废座主之称，行糊名阅卷。',
        options: [
          {
            id: 'exam-2-radical',
            label: '糊名阅卷',
            description: '废座主门生之礼，行糊名、誊录之法，杜绝请托。',
            tone: 'radical',
            effects: { regent: -5, unrest: -2 },
            weight: 0,
            outcome:
              '糊名法行，科场为之一肃。座主们失去了门生，寒门举子却第一次真正靠文章改命。',
          },
          {
            id: 'exam-2-balanced',
            label: '循旧例',
            description: '保留座主之礼，只禁门生结党干预朝政。',
            tone: 'balanced',
            effects: { regent: 2, unrest: 1 },
            weight: 0,
            outcome:
              '座主仍是座主，门生仍是门生。朝廷下了一纸禁令，众人也就心照不宣地换了个名目。',
          },
          {
            id: 'exam-2-cautious',
            label: '尽废科举',
            description: '以结党为患，尽废科举，复行察举征辟。',
            tone: 'cautious',
            effects: { treasury: -2, regent: 5, unrest: 4 },
            weight: 0,
            outcome:
              '科举废罢，选官之权重归公卿。举子们焚书痛哭，州郡的察举名单则由几家大姓共同拟定。',
          },
        ],
      },
    ],
  },
]

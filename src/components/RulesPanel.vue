<script setup lang="ts">
import ModalShell from './ModalShell.vue'
import { OFFICES, RESOURCE_META, RESOURCE_ORDER } from '@/game/content'

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <ModalShell
    title="治国要略"
    subtitle="内府抄本 · 御览要略"
    size="lg"
    @close="emit('close')"
  >
    <div class="rules">
      <section class="rules-section">
        <span class="rules-section__number">一</span>
        <div>
          <h3>年号与四时</h3>
          <p>
            御极之初，取两字年号，此号随一朝始终。纪年以干支，岁分四季，每季各有一桩朝议。
            日辰或吉、或凶、或平，只应于日常朝政。
          </p>
          <p>
            <b>行动点</b>：每岁仅三点，亲理一桩事务耗一点，搁置不耗；点尽之后，余季只可搁置。
          </p>
          <ul>
            <li><b>吉日</b>：若择激进之策，其正面效用增五成。</li>
            <li><b>凶日</b>：若择保守之策，其负面效用减半。</li>
            <li><b>平日</b>：诸策一如其述，全凭圣断。</li>
          </ul>
        </div>
      </section>

      <section class="rules-section">
        <span class="rules-section__number">二</span>
        <div>
          <h3>朝议与岁评</h3>
          <p>
            每项决断皆有政绩，或正或负。岁末合当年日常朝议所积政绩而计：<b>满六为「顺」</b>，
            <b>三至五为「平」</b>，<b>不足三为「厄」</b>。若一岁日常朝议尽数搁置，则评为「庸」。
            史鉴与异闻不入岁评。
          </p>
          <p>
            日常朝政择定后另有顺逆之数：六成顺遂（正面效用增、负面减），四成波折（反之）。
            择定之后，本季总变会记下此项政绩；岁末再合而计之。
          </p>
          <div class="mark-grid">
            <div><span>顺</span><p>本岁善政居多，朝野称善。</p></div>
            <div><span>厄</span><p>本岁失政居多，怨声渐起。</p></div>
            <div><span>平</span><p>功过相抵，或勉强守成。</p></div>
            <div><span>庸</span><p>一岁诸事尽搁，史官无政可纪。</p></div>
          </div>
        </div>
      </section>

      <section class="rules-section">
        <span class="rules-section__number">三</span>
        <div>
          <h3>四值国势</h3>
          <p>
            权臣、府库、民变、军势，四值此消彼长。权臣与民变愈高愈危，府库与军势愈低愈危；
            任一值走到极处，国祚便可能另起一卷。辅臣考成与每季时运，都会改变它们。
          </p>
          <div class="rules-resources">
            <div v-for="key in RESOURCE_ORDER" :key="key" class="rules-resource">
              <span class="rules-resource__seal">{{ RESOURCE_META[key].seal }}</span>
              <div>
                <strong>{{ RESOURCE_META[key].label }}</strong>
                <p>{{ RESOURCE_META[key].description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rules-section">
        <span class="rules-section__number">四</span>
        <div>
          <h3>朝议三类</h3>
          <p>
            日常朝政分为执政、军事、经济、宗庙、文教五类。每季之事备有多条线索，每次只呈现其中二三至四；
            选项数目与日辰吉凶每季不同。抉择之前不列利害，须由陛下自行判断；择定之后，才在本季总变中揭晓。
            诸事皆可搁置。
          </p>
          <p>
            史鉴改编自前朝兴亡大事，依年岁自行展开。其选项固定，不系吉凶，也不入岁评；若中途搁置，后续便不再来。
          </p>
          <p>
            异闻不依常例，一朝或只一遇。它不系日辰吉凶，也不入岁评；其去留，往往不由朝议常法。
          </p>
        </div>
      </section>

      <section class="rules-section">
        <span class="rules-section__number">五</span>
        <div>
          <h3>每季时运</h3>
          <p>
            每季或天时平顺，或独降灾异；若逢吉运，必有一项隐忧相随。福祸相倚，正是御极之难。
          </p>
        </div>
      </section>

      <section class="rules-section">
        <span class="rules-section__number">六</span>
        <div>
          <h3>辅臣与官职</h3>
          <p>
            开朝之际，辅臣之位有<b>二</b>。可从三名才俊中择一或二人，各授不同官职；亦可尽罢不设，乾纲独断。
            辅臣岁末依官职考成增益国势，又怀有<b>治世之能</b>：在相应朝议中有概率进言，献上更优之策。
          </p>
          <p>
            若前朝得善谥而顺利承继，前朝首席辅臣可留任新朝，仍领旧职；其岁末考成之力，较寻常辅臣更著。
            新朝另择辅臣后，两代新旧同朝。
          </p>
          <ul class="rules-offices">
            <li v-for="office in OFFICES" :key="office.id">
              <span>{{ office.rank }}</span>
              <b>{{ office.office }}</b>
              <em>{{ office.summary }}</em>
            </li>
          </ul>
        </div>
      </section>

      <section class="rules-section">
        <span class="rules-section__number">七</span>
        <div>
          <h3>终卷与承继</h3>
          <p>
            在位之数，十至四十年不等，以钟形之数抽取。国祚终了，史官依谥法定谥，并作总评。
            唯得<b>善谥</b>方可承继国势、传于下一世；<b>平谥</b>与<b>恶谥</b>，皆唯有另开新朝。
          </p>
          <p>
            承继之际，新君初立，朝局未稳：府库、军势各减十，民变、权臣各增十；
            濒危之值止于边界之内，以存一线生机。
          </p>
          <p>
            新朝首季，必先办<b>先皇葬仪</b>；此礼不入岁评，亦不受日辰所扰。若将葬仪搁置，朝野非议，权臣与民变各增二。
            此后前朝积弊渐深，部分日常朝政的有害效用会较往昔更重；世次愈远，积弊愈显。
          </p>
          <p>
            每一终局自动录入历代本纪；图鉴以所得谥号为记，未亲历者只书「未启」。
          </p>
          <p class="rules-save">
            卷页于每次翻动后自动录于本机。暂离后回到首页即可续读；若清除本机所藏，旧卷亦不可复得。
          </p>
        </div>
      </section>
    </div>

    <template #footer>
      <button class="btn btn--ink" type="button" @click="emit('close')">已悉朝纲</button>
    </template>
  </ModalShell>
</template>

<style scoped>
.rules {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  padding-top: 0.2rem;
}

.rules-section {
  display: flex;
  gap: 0.85rem;
}

.rules-section + .rules-section {
  padding-top: 1.2rem;
  border-top: 1px solid rgba(79, 67, 53, 0.12);
}

.rules-section__number {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.7rem;
  height: 1.7rem;
  color: var(--cinnabar);
  border: 1px solid rgba(158, 48, 39, 0.28);
  font-family: var(--font-kai);
  font-size: 0.72rem;
}

.rules-section h3 {
  margin-bottom: 0.4rem;
  font-family: var(--font-kai);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.rules-section p {
  color: var(--ink-soft);
  font-size: 0.78rem;
  line-height: 1.85;
}

.rules-section p + p {
  margin-top: 0.5rem;
}

.rules-section strong {
  color: var(--cinnabar);
  font-weight: 600;
}

.rules-section ul {
  margin-top: 0.55rem;
  padding-left: 0;
  list-style: none;
}

.rules-section li {
  position: relative;
  padding-left: 0.9rem;
  color: var(--ink-soft);
  font-size: 0.76rem;
  line-height: 1.8;
}

.rules-section li::before {
  position: absolute;
  top: 0.75em;
  left: 0;
  width: 3px;
  height: 3px;
  content: '';
  background: var(--cinnabar);
  border-radius: 50%;
}

.rules-section li b {
  color: var(--ink);
  font-family: var(--font-kai);
  font-weight: 600;
}

.mark-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  margin-top: 0.65rem;
}

.mark-grid div {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.45rem 0.5rem;
  background: rgba(255, 247, 230, 0.38);
  border: 1px solid rgba(79, 67, 53, 0.1);
}

.mark-grid span {
  flex: 0 0 auto;
  color: var(--cinnabar);
  font-family: var(--font-kai);
  font-size: 1rem;
  line-height: 1.2;
}

.mark-grid p {
  font-size: 0.68rem;
  line-height: 1.65;
}

.rules-resources {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  margin-top: 0.7rem;
}

.rules-resource {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 247, 230, 0.38);
  border: 1px solid rgba(79, 67, 53, 0.1);
}

.rules-resource__seal {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--paper-light);
  background: var(--ink-soft);
  font-family: var(--font-kai);
  font-size: 0.68rem;
}

.rules-resource strong {
  display: block;
  color: var(--ink);
  font-family: var(--font-kai);
  font-size: 0.76rem;
  font-weight: 500;
}

.rules-resource p {
  margin-top: 0.05rem;
  color: var(--ink-faint);
  font-size: 0.64rem;
  line-height: 1.6;
}

.rules-resource em {
  display: block;
  margin-top: 0.2rem;
  color: var(--cinnabar);
  font-size: 0.6rem;
  font-style: normal;
  line-height: 1.55;
}

.rules-offices {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.rules-offices li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
}

.rules-offices span {
  color: var(--ink-faint);
  font-size: 0.62rem;
}

.rules-offices b {
  font-family: var(--font-kai);
  font-size: 0.72rem;
}

.rules-offices em {
  color: var(--ink-faint);
  font-size: 0.64rem;
  font-style: normal;
}

.rules-save {
  padding: 0.5rem 0.6rem;
  color: var(--ink-faint) !important;
  background: rgba(80, 103, 86, 0.06);
  border-left: 2px solid rgba(80, 103, 86, 0.35);
  font-size: 0.68rem !important;
}

@media (max-width: 640px) {
  .rules-section {
    gap: 0.6rem;
  }

  .mark-grid,
  .rules-resources {
    grid-template-columns: 1fr;
  }

  .rules-section p {
    font-size: 0.75rem;
  }
}
</style>

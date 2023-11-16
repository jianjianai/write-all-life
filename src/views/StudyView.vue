<script setup lang="ts">
import PinyinText from '@/components/PinyinText.vue';
import { type StudyPrototype, StudyManager, type WordPrototype } from '@/db';
import type { SentencePrototype } from '@/db/class';
import { useSentenceStore } from '@/stores/SentenceStore';
import { useStudyStore } from '@/stores/StudyStore';
import type { FuseResult } from 'fuse.js';
import { type Ref, ref, watch, toRefs, onUnmounted, computed } from 'vue';

const { workType } = defineProps<{
  workType: "study" | "review"
}>();

const {
  studyingLibrary,
  studyingLibraryloinging,
  needStudyArrays,
  needStudyArraysloinging,
  needReviewArray,
  needReviewArrayloinging
} = toRefs(useStudyStore());

const {
  sentenceFuseloinging,
  sentenceFuse
} = toRefs(useSentenceStore());



////当前选择的词库
let studyAllArrays: Ref<StudyPrototype[] | undefined> | undefined = undefined;
////学习功能
const studyingArray: Ref<Studying[]> = ref([]);

const studyingIndex = ref(0);
class Studying {
  //需要的记住次数，降到0则代表学习完成
  okTime: number;
  //学习进度对象
  study: StudyPrototype;
  constructor(okTime: number, study: StudyPrototype) {
    this.okTime = okTime;
    this.study = study;
  }
};
//学习计数
const studyCount = ref(0);
const needStudyNumber = ref(0);
/**
 * 获取需要学习的次数
 */
const needStudyTime = (study: StudyPrototype) => {
  if(study.schedule == 0){//如果是新单词则只用学习一次
    return 1;
  }
  if (study.schedule == 1) {//如果是新单词并且不会则学习三次
    return 3;
  }
  //否者记住一次
  return 1;
}
/**
 * 获取下一个学习对象
 * @returns undefined 代表已经完成本次学习目标
 */
const nextStudying = () => {
  if (studyCount.value >= needStudyNumber.value) {//如果已经完成目标
    return undefined;
  }
  if (studyingArray.value.length <= 0) {//如果没有更多单词
    return undefined;
  }
  let index = studyingIndex.value;
  if (index + 1 > studyingArray.value.length) {
    index = 0;
  }
  let theStudy = studyingArray.value[index];
  studyingIndex.value = index + 1;
  return {
    study: theStudy,
    /**
     * 本次记住了
     * 如果当前单词已经完成背诵，替换成新的任务。
     */
    ok() {
      theStudy.okTime = theStudy.okTime - 1;
      console.log(theStudy);
      if (theStudy.okTime <= 0) {
        if (studyAllArrays!.value!.length > 0) {//如果有新的任务则替换
          let study = studyAllArrays!.value!.shift();
          studyingArray.value[index] = new Studying(needStudyTime(study!), study!);
        } else {
          studyingArray.value.splice(index, 1);
        }
        //添加完成计数
        studyCount.value = studyCount.value + 1;

        //修改学习进度并保存
        theStudy.study.setNextlearn();//进行下一次学习
        theStudy.study.update();
      }
      this.ok = () => { throw new Error("不可多次调用！") };
    },
    /**
     * 本次没记住,则重新学习
     */
    on() {
      theStudy.study.setRelearn();//重新学习
      theStudy.study.update();
      theStudy.okTime = needStudyTime(theStudy.study);
      this.on = () => { throw new Error("不可多次调用！") };
    }
  };
}

//学习组件逻辑
const flishAll = ref(false);
const studying: Ref<{ study: Studying, ok: () => void, on: () => void } | undefined> = ref(undefined);
const studyingWord: Ref<WordPrototype | undefined> = ref(undefined);
const studyingSenence:Ref<SentencePrototype|undefined> = ref(undefined);
const sentenceArray:Ref<FuseResult<SentencePrototype>[]|undefined> = ref(undefined);;
const search = ()=>{
    //查找句子
  if (sentenceFuseloinging.value) {
    sentenceArray.value = undefined;
     return;
  }
  if (!studyingWord.value) {
    sentenceArray.value = undefined;
    return;
  }
  sentenceArray.value =  sentenceFuse.value!.search(studyingWord.value.word);
}
watch([sentenceFuseloinging,studyingWord],search);
const findSenence = ()=>{
  //查找其中一个
  if (!sentenceArray.value) {
    studyingSenence.value = undefined;
    return;
  }
  while (sentenceArray.value.length > 0) {
    let index = Math.floor(sentenceArray.value.length * Math.random());
    let sentence = sentenceArray.value[index].item;
    sentenceArray.value.splice(index, 1);
    if (sentence.sentence.indexOf(studyingWord.value!.word) >= 0) {
      studyingSenence.value = sentence;
      return;
    }
  }
  studyingSenence.value = undefined;
}
watch([sentenceFuseloinging, studyingWord], findSenence);
watch(studying, () => {
  studyingWord.value = undefined;
  studying.value?.study.study.getWord().then((o) => {
    studyingWord.value = o;
  });
});

//换句子
const reFindSenenceClick = ()=>{
  if(!sentenceArray.value ||sentenceArray.value.length<=0){
    search();
  }
  findSenence();
}

//没学完的要还回去
onUnmounted(() => {
  if (studyAllArrays) {
    for (const stud of studyingArray.value) {
      studyAllArrays.value!.unshift(stud.study);
    }
  }
})

//加载词库
const longing = ref(true);
const loadStudyingArray = () => {
  //需要学习的个数
  needStudyNumber.value = Math.min(10, studyAllArrays!.value!.length);
  //讲即将学习的词添加到学习队列
  for (let i = 0; i < needStudyNumber.value && studyAllArrays!.value!.length > 0; i++) {
    let study = studyAllArrays!.value!.shift();
    studyingArray.value.push(new Studying(needStudyTime(study!), study!));
  }
  //初始化学习组件
  studying.value = nextStudying();
  if (!studying.value) {
    flishAll.value = true;
  }
  //结束加载状态
  longing.value = false;
}



//开始加载组件
const loadNeedStudyArraysError: Ref<any> = ref(undefined);
if (workType == "study") {
  watch(needStudyArraysloinging, () => {
    if (needStudyArraysloinging.value) {
      return;
    }
    studyAllArrays = needStudyArrays;
    loadStudyingArray();
  }, { immediate: true })
} else if (workType == "review") {
  watch(needReviewArrayloinging, () => {
    if (needReviewArrayloinging.value) {
      return;
    }
    studyAllArrays = needReviewArray;
    loadStudyingArray();
  }, { immediate: true })
} else {
  loadNeedStudyArraysError.value = "错误,错误的workType:" + studying;
}


//页面学习逻辑
const watching = ref(false);
const inputWord = ref("");
const message = ref("");
const check = () => {
  if (studyingWord.value?.word != inputWord.value) {
    message.value = "词语不正确";
    return;
  }
  if (!watching.value) {
    studying.value!.ok();
  } else {
    studying.value!.on();
  }
  inputWord.value = "";
  message.value = '';
  watching.value = false;
  studying.value = nextStudying();
  if (!studying.value) {
    flishAll.value = true;
  }
}
watch(inputWord, () => {
  message.value = "";
})



</script>
<template>
  <div class="page">
    <div v-if="loadNeedStudyArraysError">{{ loadNeedStudyArraysError }}</div>
    <div v-else-if="longing">
      longing...
    </div>
    <template v-else>
      <div class="hTitle">
        <p v-if="workType == 'study'">学习 {{ studyCount }}/{{ needStudyNumber }}</p>
        <p v-else-if="workType == 'review'">复习 {{ studyCount }}/{{ needStudyNumber }}</p>
        <p v-else>???</p>
      </div>

      <template v-if="flishAll">
        <div>已经全部学习完成！</div>
      </template>

      <div v-else class="studyPage">
        <div class="pageShwo">

          <template v-if="!studyingWord">
            <div>
              <p>loinging...</p>
            </div>

          </template>
          <template v-else>
            <div class="mainShsow">
              <PinyinText class="mainShsowP" :text="studyingWord.word" :word="studyingWord.word" :inputWord="inputWord"
                :shwoWord="watching" />
            </div>

            <div>
              <p class="message">{{ message }}</p>
              <input type="text" :maxlength="studyingWord ? studyingWord.word.length : 1" v-model="inputWord"
                @keydown.enter="check"><input type="button" value="检查" @click="check">
            </div>

            <div class="cShsowDiv">
              <p v-if="sentenceFuseloinging" style="font-size: 3rem;">loinging..</p>
              <p v-else-if="!studyingSenence" style="font-size: 3rem;">没找到包含此词语的句子</p>
              <PinyinText v-else class="cShsow" :text="studyingSenence.sentence" :word="studyingWord.word"
                :inputWord="inputWord" :shwoWord="watching" />
              <button @click="reFindSenenceClick">换一换</button>
            </div>
          </template>
        </div>

        <div class="pageButtons">
          <input type="button" value="检查" @click="check">
          <input v-if="!watching" type="button" value="不会" @click="watching = true">
        </div>
        <!-- 将上面的元素挤到上方的没用div -->
        <div></div>
        <div></div>
        <div></div>
      </div>
    </template>
  </div>

  <!-- 调试 -->
  <!-- <div style="border: 1px solid green;" id="text">
            <div>调试信息</div>
            <div style="font-size: 3rem;" v-for="a of studyingArray">{{ a }}</div>
            <div>{{ studyingIndex }}</div>
            <div style="font-size: 3rem;"> {{ studying }}</div>
          </div> -->
</template>
  
<style scoped>
#text {
  opacity: 0.5;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: -1;
}

.mainShsow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 20rem;
  align-items: center;
}

.mainShsowP {
  transform: scale(2);
}

.cShsowDiv {
  padding-left: 3rem;
  padding-right: 3rem;
}

.cShsow {}

.showWord {
  font-size: 6rem;
}

.studyPage {
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-evenly;
}

.message {
  font-size: 4rem;
}

.pageShwo {
  min-height: 65rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.pageButtons {
  min-height: 40rem;
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.page {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.hTitle {
  font-size: 5rem;
  width: 100%;
  background-color: antiquewhite;
}

.hTitle>p {
  margin: 2rem;
  margin-top: 0;
  margin-bottom: 0;
}
</style>
  
<script setup lang="ts">
import { type StudyPrototype, StudyManager, type WordPrototype } from '@/db';
import { type Ref, ref, computed, watchEffect, watch } from 'vue';

////当前选择的词库
const loadNeedStudyArraysError: Ref<any> = ref(undefined);
const needStudyArrays: Ref<StudyPrototype[] | undefined> = ref(undefined);

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
  if (study.schedule <= 1) {//如果是初次学习则需要记住3次
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
      theStudy.okTime = theStudy.okTime-1;
      console.log(theStudy);
      if (theStudy.okTime < 0) {
        if (needStudyArrays.value!.length > 0) {//如果有新的任务则替换
          let study = needStudyArrays.value!.shift();
          studyingArray.value[index] = new Studying(needStudyTime(study!), study!);
        } else {
          studyingArray.value.splice(index, 1);
        }
        //添加完成计数
        studyCount.value = studyCount.value+1;

        //修改学习进度并保存
        theStudy.study.schedule++;
        theStudy.study.update();
      }
      this.ok = () => { throw new Error("不可多次调用！") };
    },
    /**
     * 本次没记住,则重新学习
     */
    on() {
      theStudy.study.schedule = 1;
      theStudy.study.update();
      theStudy.okTime = needStudyTime(theStudy.study);
      this.on = () => { throw new Error("不可多次调用！") };
    }
  };
}

//学习组件逻辑
const studying: Ref<{ study: Studying, ok: () => void, on: () => void } | undefined> = ref(undefined);
const studyingWord: Ref<WordPrototype | undefined> = ref(undefined);
watch(studying, () => {
  studyingWord.value = undefined;
  studying.value?.study.study.getWord().then((o) => {
    studyingWord.value = o;
  });
});
//加载词库
const longing = ref(true);
StudyManager.getStudyingLibrary().then((studying) => {
  if (!studying) {
    throw "错误，当前没有使用任何题库！";
  }
  return StudyManager.newStudyArray(studying);
}).then((array) => {
  needStudyArrays.value = array;
}).then(() => {
  //需要学习的个数
  needStudyNumber.value = Math.min(10, needStudyArrays.value!.length);
  //讲即将学习的词添加到学习队列
  for (let i = 0; i < needStudyNumber.value && needStudyArrays.value!.length > 0; i++) {
    let study = needStudyArrays.value!.shift();
    studyingArray.value.push(new Studying(needStudyTime(study!), study!));
  }
  //初始化学习组件
  studying.value = nextStudying();
  //结束加载状态
  longing.value = false;
}).catch((e) => {
  loadNeedStudyArraysError.value = e;
});

const watching = ref(false);
const inputWord = ref("");
const message = ref("");
const check = ()=>{
  if(studyingWord.value?.word!=inputWord.value){
    message.value = "error";
    return;
  }
  if(!watching.value){
    studying.value!.ok();
  }else{
    studying.value!.on();
  }
  inputWord.value = "";
  message.value = '';
  watching.value = false;
  studying.value = nextStudying();
}



</script>
<template>
  <div class="page">
    <div v-if="longing">
      longing...
    </div>
    <template v-else>
      <div class="hTitle">
        <p>学习 {{ studyCount }}/{{ needStudyNumber }}</p>
      </div>

      <div style="font-size: 3rem;" v-for="a of studyingArray">{{ a }}</div>
      <div>{{ studyingIndex }}</div>
      <div style="font-size: 3rem;"> {{ studying }}</div>

      <template v-if="!studyingWord">
        <div>loinging...</div>
      </template>
      <!-- 背 -->
      <template v-else-if="!watching">
        <div>
          {{ studyingWord.word }}::
        </div>
        <p>{{ message }}</p>
        <input type="text" v-model="inputWord">
        <input type="button" value="检查" @click="check">
        <input type="button" value="不会" @click="watching=true">
      </template>
      <!-- 看 -->
      <template v-else>
        <div>
          {{ studyingWord.word }}
        </div>
        <p>{{ message }}</p>
        <input type="text" v-model="inputWord">
        <input type="button" value="检查" @click="check">
      </template>
    </template>
  </div>
</template>
  
<style scoped>
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
  
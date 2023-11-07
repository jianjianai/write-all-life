<script setup lang="ts">
import { type LibraryPrototype, StudyManager, type StudyPrototype } from '@/db';
import router from '@/router';
import { type Ref, ref, onMounted } from 'vue';

//当前选择的词库
const studyingLibrary: Ref<LibraryPrototype | undefined | null> = ref(undefined);
const studyingLibraryloinging = ref(true);
const needStudyArrays:Ref<StudyPrototype[]|undefined> = ref(undefined);
const needReviewArray:Ref<StudyPrototype[]|undefined> = ref(undefined);
onMounted(async () => {
  studyingLibrary.value = await StudyManager.getStudyingLibrary();
  if(!studyingLibrary.value){
    router.replace("/library");
    return;
  }
  needStudyArrays.value = await StudyManager.newStudyArray(studyingLibrary.value);
  needReviewArray.value = await StudyManager.needReviewArray(new Date());
  studyingLibraryloinging.value = false;
});


</script>

<template>
  <div class="page">
    <div class="titleDiv">
      Good good study day day up!
    </div>
    <div class="start">
      <template v-if="studyingLibraryloinging">
        loging...
      </template>
      <template v-else>
        <div>
          <h4>学习</h4>
          <p>{{needStudyArrays!.length}}</p>
        </div>
        <div>
          <h4>复习</h4>
          <p>{{ needReviewArray!.length }}</p>
        </div>
      </template>
    </div>
    <header class="header">
      <RouterLink class="link" to="/library">词库</RouterLink>
      <RouterLink class="link" to="/">句子</RouterLink>
      <RouterLink class="link" to="/about">关于</RouterLink>
    </header>
  </div>
</template>

<style scoped>
.start>div>h4 {
  font-size: 5rem;
  margin: 0;
  padding: 0;
}

.start>div>p {
  font-size: 4rem;
  margin: 0;
  padding: 0;
}

.start>div {
  width: 29rem;
  height: 15rem;
  border-radius: 3rem;
  border: 1px solid black;
  text-align: center;
}

.start {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-evenly;
}

.titleDiv {
  font-size: 6rem;
}

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding-bottom: 5rem;
}

.link {
  margin: 1rem;
  font-size: 4rem;
}

.header {
  bottom: 0;
  position: absolute;
  height: 5rem;
  width: 100%;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>

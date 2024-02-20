<script setup lang="ts">
import { useStudyStore } from '@/stores/StudyStore';
import { toRefs } from 'vue';

const {
    studyingLibrary,
    studyingLibraryloinging,
    needStudyArrays,
    needStudyArraysloinging,
    needReviewArray,
    needReviewArrayloinging
  } = toRefs(useStudyStore());

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
      <template v-else-if="!studyingLibrary">
        <RouterLink class="studyButtln" to="/library">
          <h4>词库</h4>
          <p>前往设置词库</p>
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink class="studyButtln" to="/study">
          <h4>学习</h4>
          <p v-if="needStudyArraysloinging">loinging...</p>
          <p v-else>{{needStudyArrays!.length}}</p>
        </RouterLink>
        <RouterLink  class="studyButtln" to="/review">
          <h4>复习</h4>
          <p v-if="needReviewArrayloinging">loinging...</p>
          <p v-else>{{ needReviewArray!.length }}</p>
        </RouterLink>
      </template>
    </div>
    <header class="header">
      <RouterLink class="link" to="/library">词库</RouterLink>
      <RouterLink class="link" to="/sentence/1">句子</RouterLink>
      <RouterLink class="link" to="/studyings/1">学习中</RouterLink>
      <RouterLink class="link" to="/about">关于</RouterLink>
    </header>
  </div>
</template>

<style scoped>
.start>.studyButtln>h4 {
  font-size: 5rem;
  margin: 0;
  padding: 0;
}

.start>.studyButtln>p {
  font-size: 4rem;
  margin: 0;
  padding: 0;
}

.start>.studyButtln {
  display: block;
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

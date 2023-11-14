<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeUnmount, onMounted, reactive, watchEffect } from 'vue';

// import { DB } from './db/dexie';
// import { LibraryManager, SentenceManager, StudyManager } from './db';
// import { useSentenceStore } from './stores/SentenceStore';
// onMounted(() => {
//   window.DB = DB;
//   window.LibraryManager = LibraryManager;
//   window.StudyManager = StudyManager;
//   window.SentenceManager = SentenceManager;
//   window.useSentenceStore = useSentenceStore;
// });

let html = document.querySelector("html");
let body = document.querySelector("body");
let appsize = reactive({
  width: 0,
  height: 0
});
let event = () => {
  let bodyWidth = body!.offsetWidth;
  let bodyHeight = body!.offsetHeight;
  let bi = bodyWidth / bodyHeight;
  // console.log(bi, bodyWidth, bodyHeight);
  let height = bodyHeight;
  let width = bodyWidth;
  if (bi > 0.65) {
    width = bodyHeight * 0.65;
  } else if (bi < 0.45) {
    height = bodyWidth / 0.45;
  }
  appsize.height = height;
  appsize.width = width;
};
onMounted(() => {
  window.addEventListener('resize', event);
  event();
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', event)
});
watchEffect(() => {
  html!.style.fontSize = `${(appsize.width < appsize.height ? appsize.width : appsize.height) / 100}px`;
})


</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  width: v-bind("`${appsize.width}px`");
  height: v-bind("`${appsize.height}px`");
  border: 1px solid black;
  position: relative;
  /* left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
  /* margin: auto; */
  overflow: hidden;
  font-size: 5rem;
}
</style>
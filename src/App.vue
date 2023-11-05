<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {DB,LibraryManager} from './db';
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, watch, watchEffect } from 'vue';
let html = document.querySelector("html");
let body = document.querySelector("body");
onMounted(() => {
  window.DB = DB;
  window.LibraryManager = LibraryManager;
});
let appsize = reactive({
  width: 0,
  height: 0
});
let event = () => {
  let bodyWidth = body!.offsetWidth;
  let bodyHeight = body!.offsetHeight;
  let bi = bodyWidth / bodyHeight;
  console.log(bi, bodyWidth, bodyHeight);
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
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  font-size: 5rem;
}

</style>

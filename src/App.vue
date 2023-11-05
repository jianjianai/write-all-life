<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { DB } from './db';
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, watch, watchEffect } from 'vue';
let html = document.querySelector("html");
let body = document.querySelector("body");
onMounted(() => {
  window.DB = DB;
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

    <header class="header">
      <RouterLink class="link" to="/">学习</RouterLink>
      <RouterLink class="link" to="/about">词汇</RouterLink>
    </header>
  </div>
</template>

<style>
.link {
  margin: 1rem;
}

.header {
  bottom: 0;
  position: absolute;
  height: 10rem;
  width: 100%;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.app {
  width: v-bind("`${appsize.width}px`");
  height: v-bind("`${appsize.height}px`");
  border: 1px solid black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}

.app>* {
  font-size: 5rem;
}
</style>

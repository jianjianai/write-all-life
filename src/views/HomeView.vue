<script setup lang="ts">

</script>

<template>
  <div class="page">
    <div class="titleDiv">
      Good good study day day up!
    </div>
    <div class="start">
      <div>
        <h4>学习</h4>
        <p>10</p>
      </div>
      <div>
        <h4>复习</h4>
        <p>20</p>
      </div>
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
}</style>

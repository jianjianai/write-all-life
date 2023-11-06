<script setup lang="ts">
import { LibraryManager, LibraryPrototype } from '@/db';
import { onMounted, ref, type Ref } from 'vue';
let libraryArray: Ref<LibraryPrototype[] | undefined> = ref(undefined);
onMounted(async () => {
    libraryArray.value = await LibraryManager.array();
})
</script>
<template>
    <div class="page">
        <div class="titile">
            <p>词库</p>
        </div>
        <div class="list">
            <template v-if="!libraryArray">
                <div>
                    longing..
                </div>
            </template>
            <template v-else-if="libraryArray.length <= 0">
                <div>
                    null
                </div>
            </template>
            <template v-else>
                <RouterLink v-for="{ id, name, about } of libraryArray" class="li" :to="`/library/${id}`">
                    <h5 v-if="name">{{ name }}</h5>
                    <p v-if="about">{{ about }}</p>
                </RouterLink>
            </template>
        </div>
    </div>
</template>
  
<style scoped>
.page{
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
    justify-content: flex-start;
}
.titile {
    font-size: 5rem;
    width: 100%;
    background-color:antiquewhite;
}
.titile > p{
    margin: 2rem;
    margin-top: 0;
    margin-bottom: 0;
}

.list {
    padding-top: 2rem;
    overflow: auto;
}

.li {
    display: block;
    border: 1px solid black;
    margin: 1rem;
    margin-bottom: 3rem;
    padding: 2rem;
}

.li > h5{
    font-size: 4rem;
}
.li > p{
    font-size: 3rem;
}
</style>
  
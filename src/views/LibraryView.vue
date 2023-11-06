<script setup lang="ts">
import { LibraryManager } from '@/db';
import { onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { type LibraryPrototype,type WordPrototype } from "@/db"

const route = useRoute();
const { libraryid } = route.params;
const library: Ref<LibraryPrototype | null> = ref(null);
const error: Ref<any> = ref(undefined);
const words:Ref<WordPrototype[] | undefined> = ref(undefined);
onMounted(async () => {
    try {
        library.value = await LibraryManager.get(parseInt(libraryid as string));
        words.value = await library.value?.WordArray();
    } catch (e) {
        error.value = e;
    }
});



</script>
<template>
    <div class="page">
        <div class="hTitle">
            <p>词库详情</p>
        </div>
        <div class="body">
            <template v-if="error">
                <div class="error">
                    {{ error }}
                </div>
            </template>
            <template v-else-if="!library">
                <div>
                    logining...
                </div>
            </template>
            <template v-else>
                <div class="box">
                    <div class="title">名称</div>
                    <div class="text">{{ library.name }}</div>
                </div>
                <div class="box">
                    <div class="title">简介</div>
                    <div class="text">{{ library.about }}</div>
                </div>
                <div class="box">
                    <div class="title">词语列表</div>
                    <div v-if="!words" class="text">
                        loinging..
                    </div>
                    <div v-else class="wordList">
                        <div v-for="{word} in words">
                            {{ word }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
  
<style scoped>
.body {
    padding-top: 2rem;
    overflow: auto;
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

.page {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
    justify-content: flex-start;
}
.box{
    margin-left: 2rem;
    margin-right: 2rem;
    margin-bottom: 2rem;
}
.box>.title {
    font-size: 3rem;
    font-weight: 700;
}

.box>.text {
    font-size: 4rem;
}</style>
  
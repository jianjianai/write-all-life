<script setup lang="ts">
import { LibraryManager } from '@/db';
import { onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { type LibraryPrototype, type WordPrototype } from "@/db"

//显示
const route = useRoute();
const { libraryid } = route.params;
const library: Ref<LibraryPrototype | null> = ref(null);
const error: Ref<any> = ref(undefined);
const words: Ref<WordPrototype[] | undefined> = ref(undefined);
onMounted(async () => {
    try {
        library.value = await LibraryManager.get(parseInt(libraryid as string));
        words.value = await library.value?.WordArray();
    } catch (e) {
        error.value = e;
    }
});

//添加
const adderror: Ref<any> = ref(undefined);
const addInput: Ref<string | void> = ref(undefined);
const addButtonClick = async () => {
    if (!library.value) {
        adderror.value = "请等待加载完成"
        return;
    }
    if (!addInput.value) {
        adderror.value = "不能添加空词语"
        return;
    }
    let { addNew, word } = await library.value.addWord(addInput.value);
    if (!addNew) {
        adderror.value = "词语已存在"
        return;
    }
    words.value?.push(word);
    addInput.value = '';
    adderror.value = null;
}



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
                    <template v-else>
                        <div class="wordList">
                            <div v-for="{ word,id } in words" :key="id" class="wordDiv">
                                {{ word }}
                            </div>
                        </div>
                    </template>
                </div>
                <div class="box">
                    <div class="title">添加词语</div>
                    <div class="addWord">
                        <div class="addError" v-if="adderror">
                            {{ adderror }}
                        </div>
                        <input type="text" v-model="addInput"><button @click="addButtonClick">添加</button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
  
<style scoped>
.addError {
    font-size: 1rem;
    color: red;
}

.wordList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    align-items: center;
}

.wordDiv {
    border-bottom: 1px solid rgba(0, 0, 0, 0.192);
    /* border-radius: 2rem; */
    min-height: 5rem;
    min-width: 12rem;
    padding: 1rem;
    margin: 1rem;
    font-size: 3rem;
}

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

.box {
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
}
</style>
  
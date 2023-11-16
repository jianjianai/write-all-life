<script setup lang="ts">
import { pinyin } from 'pinyin-pro';
import { ref, watch, type Ref, toRefs } from 'vue';

let props = defineProps<{ text: string, word: string, shwoWord: boolean, inputWord: string }>();
let { text, word, shwoWord, inputWord } = toRefs(props);

let shwoArray: Ref<{ ty: string, t?: string, up?: string, is_?: boolean }[]> = ref([]);
//显示和隐藏文字
const xxxxxsssss = () => {
    for (let theIdex = text.value.indexOf(word.value), lastIndex = 0; theIdex >= 0;) {
        // 替换文字
        for (let wordInex = 0; wordInex < word.value.length; wordInex++) {
            const shwoIndex = theIdex + wordInex;
            shwoArray.value[shwoIndex].is_ = true;
            if (inputWord.value[wordInex]) {
                shwoArray.value[shwoIndex].t = inputWord.value[wordInex];
            } else {
                shwoArray.value[shwoIndex].t = undefined;
            }
        }
        lastIndex = theIdex;
        theIdex = text.value.indexOf(word.value, lastIndex + 1)
    }
}
//加载文字和拼音
const wwwzzzpppyyy = () => {
    shwoArray.value = [];
    for (const theChar of text.value) {
        shwoArray.value.push({ ty: theChar, t: theChar });
    }
    const py = pinyin(word.value, { type: "array" });
    for (let theIdex = text.value.indexOf(word.value), lastIndex = 0; theIdex >= 0;) {
        // 替换拼音
        for (let pyInex = 0; pyInex < py.length; pyInex++) {
            const shwoIndex = theIdex + pyInex;
            shwoArray.value[shwoIndex].up = py[pyInex];
        }
        lastIndex = theIdex;
        theIdex = text.value.indexOf(word.value, lastIndex + 1)
    }
    xxxxxsssss();
}

watch([text, word], () => { wwwzzzpppyyy() }, { immediate: true });
//党显示状态变化时
watch([inputWord], () => { xxxxxsssss() }, { immediate: false });





</script>
<template>
    <p class="pinyinP">
    <div v-for="{ ty,t, up, is_ } of shwoArray" :class="{ aChar: true, mChar: is_ }">
        <div class="top">{{ up }}</div>
        <div :class="{ char: true, _char: is_, __char:(!is_&& !shwoWord) ,wordError:((!shwoWord)&&(t)&&(ty!=t)) }">{{ shwoWord?ty:(t ? t : "■")  }}</div>
    </div>
    </p>
</template>
<style scoped>
.wordError{
    color: rgb(152, 0, 0);
}
.pinyinP {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: flex-start;
}

.aChar {
    display: inline-block;
}

.mChar {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
}

.top {
    /* height: 4rem; */
    font-size: 3rem;
    line-height: 4rem;
    text-align: center;
}

.char {
    font-size: 4rem;
    line-height: 4rem;
    /* min-height: 3rem;
    min-width: 3rem; */
    text-align: center;
    padding-bottom: 0.2rem;
}

._char {
    font-weight: bolder;
    /* font-size: 5em; */
    border-bottom: 0.2rem solid black;
    /* min-height: 8rem;
    min-width: 8rem; */
}

.__char {
    color: rgba(255, 255, 255, 0);
}</style>
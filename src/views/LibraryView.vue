<script setup lang="ts">
import { LibraryManager } from '@/db/manager/index.js';
import { ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { type LibraryPrototype, type WordPrototype } from "@/db"
import router from '@/router';
import { computed } from '@vue/reactivity';

//显示
const route = useRoute();
const { libraryid } = route.params;
const library: Ref<LibraryPrototype | null> = ref(null);
const error: Ref<any> = ref(undefined);
const words: Ref<WordPrototype[] | undefined> = ref(undefined);
LibraryManager.get(parseInt(libraryid as string)).then((the) => {
    library.value = the;
    return the?.wordArray();
}).then((the) => {
    words.value = the;
}).catch((e) => {
    error.value = e;
});

//删除
const remove = (wordsIndex: number) => {
    let word = words.value![wordsIndex];
    words.value?.splice(wordsIndex, 1);
    library.value!.removeWord(word);
}


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

//删除
const removeIng = ref(false);
const clickRemoove = async () => {
    removeIng.value = true;
    await library.value!.remove();
    router.push({ name: "LibrarysView" });
}

//重命名
const editName = ref(false);
const editAbout = ref(false);
const saveEditName = () => {
    editName.value = false;
    library.value!.update()
}
const saveEditAbout = () => {
    editAbout.value = false;
    library.value!.update()
}

//批量导入
const fenci = (bigString: string) => {
    bigString = bigString.replace(/[ \n\t]+/g, " ");
    if (bigString.startsWith(" ")) {
        bigString = bigString.substring(1);
    }
    if (bigString.endsWith(" ")) {
        bigString = bigString.substring(0, bigString.length - 1);
    }
    const inputGroup = bigString.split(" ");
    if (inputGroup.length == 1 && (inputGroup[0] == '' || inputGroup[0] == ' ')) {
        return [];
    }
    return inputGroup;
}
const bigInput = ref('');
const bigInputShow = ref('');
watch(bigInput, () => {
    bigInputShow.value = `共${fenci(bigInput.value).length}个词语。`
})
const bigInputClick = async () => {
    if (!library.value) {
        bigInputShow.value = "请等待加载完成"
        return;
    }
    let inputGroup = fenci(bigInput.value);
    let countOk = 0;
    let countHas = 0;
    let lastTime = 0;
    let addEd = [];
    for (let index = 0; index < inputGroup.length; index++) {
        let now = Date.now();
        if(lastTime<now){
            lastTime = now+500;
            bigInputShow.value = `正在添加.. 剩${inputGroup.length - index}个词语。成功${countOk}个，${countHas}个重复`
        }
        const valve = inputGroup[index];
        let { addNew, word } = await library.value.addWord(valve);
        if (!addNew) {
            countHas++;
            continue
        }
        countOk++;
        addEd.push(word)
        
    }
    bigInputShow.value = `添加完成！成功${countOk}个，${countHas}个重复`
    words.value = [...words.value!,...addEd];
}

//批量导出
const bigOutput = ref('');
const bigOutputShow = computed(() => {
    if (!words.value) {
        return "正在加载..";
    }
    return `共${words.value.length}个词语。`
})
const bigOutputClick = () => {
    if (!words.value) {
        return;
    }
    let bigString = '';
    for(const value of words.value){
        bigString+=value.word+" ";
    }
    bigOutput.value = bigString;
}

//批量添加测试数据
// let a = await LibraryManager.get(8)
// let w = [];
// for(let i=1;i<=10000;i++){w.push(a.addWord(i+"x"));console.log(i)}
// for(let i=1;i<=10000;i++){await w[i];console.log(i)};

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
                    <div v-if="!editName" class="text">{{ library.name }}</div>
                    <input v-else type="text" class="text" v-model="library.name">
                    <button v-if="!editName" @click="editName = true">编辑</button>
                    <button v-else @click="saveEditName">保存</button>
                </div>
                <div class="box">
                    <div class="title">简介</div>
                    <div v-if="!editAbout" class="text">{{ library.about }}</div>
                    <input v-else type="text" class="text" v-model="library.about">
                    <button v-if="!editAbout" @click="editAbout = true">编辑</button>
                    <button v-else @click="saveEditAbout">保存</button>
                </div>
                <div class="box">
                    <div class="title">删除词库</div>
                    <button v-if="!removeIng" @click="clickRemoove">删除</button>
                    <button v-else disabled>删除中..</button>
                </div>
                <div class="box">
                    <div class="title">词语列表</div>
                    <div v-if="!words" class="text">
                        loinging..
                    </div>
                    <template v-else>
                        <div class="wordList">
                            <div v-for="theWord, index in words" :key="theWord.id" class="wordDiv">
                                <div class="woedShow">{{ theWord.word }}</div>
                                <div class="delWord" @click.stop="remove(index)">×</div>
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
                <div class="box">
                    <div class="title">批量导入</div>
                    <div>
                        <p class="bigInputShow">{{ bigInputShow }}</p>
                        <input type="button" value="导入" @click="bigInputClick">
                        <textarea class="bigInput" v-model="bigInput"></textarea>
                    </div>
                </div>
                <div class="box">
                    <div class="title">批量导出</div>
                    <div>
                        <p class="bigOutputShow">{{ bigOutputShow }}</p>
                        <input type="button" value="导出" @click="bigOutputClick">
                        <textarea class="bigOutput" v-model="bigOutput"></textarea>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
  
<style scoped>
.bigInputShow,
.bigOutputShow {
    font-size: 2.5rem;
}

.bigInput,
.bigOutput {
    width: 100%;
    height: 20rem;
}

.addError {
    font-size: 2rem;
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

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
}

.woedShow {
    font-size: 3rem;
}

.delWord {
    font-size: 3rem;
    color: red;
    cursor: pointer;
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
    display: block;
}</style>
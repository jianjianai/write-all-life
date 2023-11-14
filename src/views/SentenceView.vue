<script setup lang="ts">
import Pagination from '@/components/Pagination.vue';
import { SentenceManager } from '@/db';
import type { SentencePrototype } from '@/db/class';
import router from '@/router';
import { ref, watch, type Ref, computed } from 'vue';
import { useRoute } from 'vue-router';


const pagesize = 60;
const route = useRoute();
const { pageOf } = route.params;
const pageNumber = ref(parseInt(pageOf as string));
const total = ref(0);
const sentenceArray: Ref<Array<SentencePrototype> | undefined> = ref(undefined);
SentenceManager.count().then((t) => {
    total.value = t;
})
watch(pageNumber, () => {
    //改变路由
    router.push({ name: "SentenceView", params: { pageOf: pageNumber.value } });
    //更新数据
    sentenceArray.value = undefined;
    SentenceManager.sentenceArray({ offset: pagesize * (pageNumber.value - 1), limit: pagesize }).then((v) => {
        sentenceArray.value = v;
    });
}, { immediate: true });
const remove = (index: number) => {
    let sentence = sentenceArray.value![index];
    sentenceArray.value!.splice(index, 1);
    sentence.remove();
    SentenceManager.count().then((t) => {
        total.value = t;
    })
}

//添加句子
const errorMseeage = ref('');
const addInput = ref('');
watch(addInput, () => {
    errorMseeage.value = '';
})
const clickAddButtin = async () => {
    if (!addInput.value) {
        errorMseeage.value = "句子为空"
        return;
    }
    SentenceManager.add(addInput.value).then(({ addNew, sentence }) => {
        if (!addNew) {
            errorMseeage.value = "句子已存在"
            return;
        }
        sentenceArray.value!.push(sentence);
        addInput.value = '';
    });
}

//批量导入
const fen = (bigString:string)=>{
    bigString = bigString.replace(/\n\n+/g,"\n");
    if (bigString.startsWith("\n")) {
        bigString = bigString.substring(1);
    }
    if (bigString.endsWith("\n")) {
        bigString = bigString.substring(0, bigString.length - 1);
    }
    const sentences = bigString.split("\n");
    if(sentences.length==1 && !sentences[0]){
        return [];
    }
    return sentences;
}
const inputText = ref('');
const inputMessage = ref('');
watch(inputText,()=>{
    inputMessage.value =  `共${fen(inputText.value).length}个句子。`
});
const inputClick = async ()=>{
    const sentences = fen(inputText.value);
    let lastTime = 0;
    let countOk = 0;
    let countHas = 0;
    let addArray = [];
    for(let index=0;index<sentences.length;index++){
        let now = Date.now();
        if(lastTime<now){
            inputMessage.value = `正在添加.. 剩${sentences.length - index}个句子。成功${countOk}个，${countHas}个重复`
            lastTime = now+500;
        }
        let value = sentences[index];
        const {addNew,sentence} =  await SentenceManager.add(value);
        if (!addNew) {
            countHas++;
            continue
        }
        countOk++;
        addArray.push(sentence);
    }
    inputMessage.value = `添加完成！成功${countOk}个，${countHas}个重复`
    sentenceArray.value = [...sentenceArray.value!,...addArray];
    theWitallSentenceArray.value = undefined;
}

//导出
const outputText = ref('');
const theWitallSentenceArray:Ref<SentencePrototype[] | undefined> = ref(undefined);
const allSentenceArray = computed(()=>{
    if(!theWitallSentenceArray.value){
        SentenceManager.sentenceArray().then((array)=>{
            theWitallSentenceArray.value = array;
        });
        return undefined;
    }else{
        return theWitallSentenceArray.value;
    }
});
const outputMessage = computed(()=>{
    if (!allSentenceArray.value) {
        return "正在加载..";
    }
    return `共${allSentenceArray.value.length}个句子。`
});
const outputClick = ()=>{
    if (!allSentenceArray.value) {
        return;
    }
    let bigString = '';
    for(let index=0;index<allSentenceArray.value.length;index++){
        const value = allSentenceArray.value[index];
        bigString += value.sentence+"\n";
    }
    outputText.value = bigString;
}

</script>
<template>
    <div class="page">
        <div class="hTitle">
            <p>全部句子 <span style="font-size: 3rem;">共:{{ total }} <a href=""
                        @click.prevent.stop="pageNumber = Math.ceil(total / pagesize)">添加</a></span></p>
        </div>
        <div class="body">
            <div v-if="pageNumber == Math.ceil(total / pagesize)" class="addDiv">
                <div class="addBody">
                    <p>{{ errorMseeage }}</p>
                    <p>
                        <input type="text" v-model="addInput" @keyup.enter="clickAddButtin">
                        <input type="button" value="添加" @click="clickAddButtin">
                    </p>
                </div>
                <div class="addBody">
                    <p class="addBodyTitle">批量导入</p>
                    <p>
                        <p>{{ inputMessage }}</p>
                        <input type="button" value="导入" @click="inputClick">
                        <textarea class="inputTextarea" v-model="inputText"></textarea>
                    </p>
                </div>
                <div class="addBody">
                    <p class="addBodyTitle">批量导出</p>
                    <p>
                        <p>{{ outputMessage }}</p>
                        <input type="button" value="导出" @click="outputClick">
                        <textarea class="outputTextarea" v-model="outputText"></textarea>
                    </p>
                </div>

            </div>
            <div>
                <Pagination :page='pageNumber' @change-page='pageNumber = $event' :pagesize='pagesize' :total='total' />
            </div>
            <div class="sentences">
                <template v-if="!sentenceArray">
                    <div>loinging...</div>
                </template>
                <template v-else>
                    <div v-for="{ sentence, id }, index of sentenceArray" :key="id" class="sentence">
                        <div class="sentenceDiv">{{ sentence }}</div>
                        <div class="delsentence" @click.stop="remove(index)">×</div>
                    </div>
                </template>
            </div>
        </div>

    </div>
</template>
  
<style scoped>
.inputTextarea,
.outputTextarea {
    width: 100%;
    height: 20rem;
}

.addDiv {
    text-align: center;
}

.sentences {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
}

.sentenceDiv {
    font-size: 4rem;
}

.body {
    padding-top: 2rem;
    overflow: auto;
}

.sentence {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-bottom: 0.2rem solid rgba(0, 0, 0, 0.297);
}

.delsentence {
    font-size: 3rem;
    color: red;
    cursor: pointer;
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
</style>
  
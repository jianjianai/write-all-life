<script setup lang="ts">
import Pagination from '@/components/Pagination.vue';
import { SentenceManager } from '@/db';
import type { SentencePrototype } from '@/db/class';
import router from '@/router';
import { ref, watch, type Ref } from 'vue';
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
watch(addInput,()=>{
    errorMseeage.value = '';
})
const clickAddButtin = async () => {
    if (!addInput.value) {
        errorMseeage.value = "句子为空"
        return;
    }
    SentenceManager.add(addInput.value).then(({addNew,sentence})=>{
        if(!addNew){
            errorMseeage.value = "句子已存在"
            return;
        }
        sentenceArray.value!.push(sentence);
        addInput.value = '';
    });
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
                <p>{{ errorMseeage }}</p>
                <p>
                    <input type="text" v-model="addInput" @keyup.enter="clickAddButtin">
                    <input type="button" value="添加" @click="clickAddButtin">
                </p>
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
}</style>
  
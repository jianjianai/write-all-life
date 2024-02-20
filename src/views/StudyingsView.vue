<script setup lang="ts">
import Pagination from '@/components/Pagination.vue';
import { type StudyPrototype, StudyManager, type WordPrototype} from '@/db';
import router from '@/router';
import { type Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

interface MyWorkStudyPrototype extends StudyPrototype{
    word?:WordPrototype
}
const now = new Date().getTime();
const pagesize = 60;
const route = useRoute();
const { pageOf } = route.params;
const pageNumber = ref(parseInt(pageOf as string));
const total = ref(0);
const studyingsArray: Ref<Array<MyWorkStudyPrototype> | undefined> = ref(undefined);
StudyManager.count().then((t) => {
    total.value = t;
})
watch(pageNumber, () => {
    //改变路由
    router.push({ name: "StudyingsView", params: { pageOf: pageNumber.value } });
    //更新数据
    studyingsArray.value = undefined;
    StudyManager.getStudyingArray(pagesize * (pageNumber.value - 1),pagesize).then((v) => {
        studyingsArray.value = v;
        for(const v of studyingsArray.value){
            v.getWord().then((word)=>{
                v.word =  word;
            });
        }
    });
}, { immediate: true });
</script>
<template>
    <div style="overflow: auto;width: 100%;height: 100%;">
        <div>
            <Pagination :page='pageNumber' @change-page='pageNumber = $event' :pagesize='pagesize' :total='total' />
        </div>
        <div>
            <table style="font-size: 3rem;text-align: center;margin: auto;">
                <tr><td>id</td><td>词语</td><td>熟练度1~10</td><td>下次复习时间</td></tr>
                <tr v-for="i of studyingsArray"><td>{{ i.id }}</td><td>{{ i.word?.word }}</td><td>{{ i.schedule }}</td><td> {{ Math.floor((i.next-now)/(24 * 60 * 60 * 1000)) }}天后</td></tr>
            </table>
        </div>
    </div>
</template>
  
<style scoped></style>
  
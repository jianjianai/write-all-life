<script setup lang="ts">
import { LibraryManager, StudyManager, type LibraryPrototype } from '@/db';
import { ref, type Ref } from 'vue';

//显示题库列表
const libraryArray: Ref<LibraryPrototype[] | undefined> = ref(undefined);
LibraryManager.array().then((the)=>{
    libraryArray.value = the;
});

//当前选择的词库
const studyingLibrary: Ref<LibraryPrototype | undefined | null> = ref(undefined);
const studyingLibraryloinging = ref(true);
StudyManager.getStudyingLibrary().then((the)=>{
    studyingLibrary.value = the;
    studyingLibraryloinging.value = false;
});

//选择一个题库
const selectStudyLibrary = async (library: LibraryPrototype) => {
    studyingLibrary.value = library;
    await StudyManager.setStudyingLibrary(library);
}

//创建题库
const createError: Ref<any> = ref();
const inputName = ref("");
const inputAbout = ref("");
const createClick = async () => {
    if (!libraryArray.value) {
        createError.value = "清等待加载完成";
        return;
    }
    if (!inputName.value) {
        createError.value = "词库名称不能为空";
        return;
    }
    let library = await LibraryManager.create(inputName.value, inputAbout.value);
    libraryArray.value!.push(library);
    inputName.value = '';
    inputAbout.value = '';
    createError.value = undefined;
}

//TODO

</script>
<template>
    <div class="page">
        <!-- 当前词库 -->
        <div class="titile">
            <p>当前词库</p>
        </div>
        <div class="userLibrary">
            <template v-if="studyingLibraryloinging">
                <div>loinging...</div>
            </template>
            <template v-else-if="!studyingLibrary">
                <div>
                    当前没有选中任何词库
                </div>
            </template>
            <RouterLink v-else class="li" :to="`/library/${studyingLibrary.id}`">
                <h5 v-if="studyingLibrary.name">{{ studyingLibrary.name }}</h5>
                <p v-if="studyingLibrary.about">{{ studyingLibrary.about }}</p>
            </RouterLink>
        </div>
        <!-- 全部词库 -->
        <div class="titile">
            <p>全部词库</p>
        </div>
        <div class="list">
            <template v-if="!libraryArray">
                <div>
                    longing..
                </div>
            </template>
            <template v-else-if="libraryArray.length <= 0">
                <div>
                    没有任何词库
                </div>
            </template>
            <template v-else>
                <RouterLink v-for="library of libraryArray" :key="library.id" class="li" :to="`/library/${library.id}`">
                    <div class="shwo">
                        <h5 v-if="library.name">{{ library.name }}</h5>
                        <p v-if="library.about">{{ library.about }}</p>
                    </div>
                    <div class="click">
                        <button v-if="library.id==studyingLibrary?.id" disabled>已选择</button>
                        <button v-else @click.stop.prevent="selectStudyLibrary(library)">选择</button>
                    </div>
                </RouterLink>
            </template>

            <!-- 创建题库 -->
            <div class="addLibrary">
                <div class="title">创建词库</div>
                <div>
                    <span>名称</span><input type="text" v-model="inputName">
                </div>
                <div>
                    <span>简介</span><input type="text" v-model="inputAbout">
                </div>
                <div class="crateError" v-if="createError">
                    {{ createError }}
                </div>
                <div>
                    <button @click="createClick">创建词库</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.crateError {
    font-size: 2rem;
    color: red;
}

.addLibrary>.title {
    font-size: 3rem;
    font-weight: 700;
}

.addLibrary {
    padding: 2rem;
    font-size: 2rem;
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

.titile {
    font-size: 5rem;
    width: 100%;
    background-color: antiquewhite;
}

.titile>p {
    margin: 2rem;
    margin-top: 0;
    margin-bottom: 0;
}

.list {
    padding-top: 2rem;
    overflow: auto;
}

.userLibrary {
    padding-top: 2rem;
}

.li {
    display: block;
    border: 1px solid black;
    margin: 1rem;
    margin-bottom: 3rem;
    padding: 2rem;
}
.li > .shwo{

}
.li > .click{

}

.li> .shwo >h5 {
    font-size: 4rem;
}

.li> .shwo> p {
    font-size: 3rem;
}
</style>
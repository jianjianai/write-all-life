<!--   
不想写了，好麻烦，反正有现成的复制过来改改yyds！

作者：code_fly
链接：https://juejin.cn/post/7011091450788053005
 -->
<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue'
let props = defineProps<{ total: number, pagesize: number, page: number }>();
let {page} = toRefs(props);
let emit = defineEmits<{ (event: "change-page", id: number): void }>();

// attrs表示父组件传递的属性，但是props没有接收的属性，这种属性不是响应式的
// 动态计算中期的页码信息
// 每页的条数
// const pagesize = 8
// 总页数
const pages = computed(() => Math.ceil(props.total / props.pagesize))
// 当前页码
// console.log(attrs.page)
const currentPage = ref(props.page as number || 1)
watch(page,()=>{
    currentPage.value = page.value;
})
// 动态计算页码列表
const list = computed(() => {
    // 当父组件传递total的值发生变化时，计算属性会重新计算
    // pages = Math.ceil(props.total / props.pagesize)
    const result = []
    // 总页码小于等于5；大于5
    if (pages.value <= 5) {
        // 总页码小于等于5的情况
        for (let i = 1; i <= pages.value; i++) {
            result.push(i)
        }
    } else {
        // 总页码大于5
        if (currentPage.value <= 2) {
            // 左侧临界值
            for (let i = 1; i <= 5; i++) {
                result.push(i)
            }
        } else if (currentPage.value >= pages.value - 1) {
            // 右侧临界值
            for (let i = pages.value - 4; i <= pages.value; i++) {
                result.push(i)
            }
        } else {
            // 中间的状态
            for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
                result.push(i)
            }
        }
    }
    return result
})
// 控制上一页和下一页变化
const changePage = (type: boolean | number) => {
    if (type === false) {
        // 上一页
        // 页面是第一页时，禁止点击操作
        if (currentPage.value === 1) return
        if (currentPage.value > 1) {
            currentPage.value -= 1
        }
    } else if (type === true) {
        // 下一页
        // 页面是最后页时，禁止点击操作
        if (currentPage.value === pages.value) return
        if (currentPage.value < pages.value) {
            currentPage.value += 1
        }
    } else {
        // 点击页码
        currentPage.value = type
    }
    emit('change-page', currentPage.value)
}

</script>
<template>
    <div class="my-pagination">
        <a @click='changePage(false)' href="javascript:;" :class="{ disabled: currentPage === 1 }">&lt</a>
        <a @click='changePage(1)' href="javascript:;" :class='{ active: currentPage === 1 }' v-if="list[0]!=1">{{ 1 }}</a>
        <span v-if='currentPage > 3'>...</span>
        <a @click='changePage(item)' href="javascript:;" :class='{ active: currentPage === item }' v-for='item in list'
            :key='item'>{{ item }}</a>
        <span v-if='currentPage < pages - 2'>...</span>
        <a @click='changePage(pages)' href="javascript:;" :class='{ active: currentPage === pages }' v-if="list[list.length-1]!=pages" >{{ pages }}</a>
        <a @click='changePage(true)' href="javascript:;" :class='{ disabled: currentPage === pages }'>></a>
    </div>
</template>
<style scoped>
.my-pagination{
    font-size: 3rem;
}
.my-pagination>a {
    display: inline-block;
    padding: 0rem 2rem;
    text-decoration: none;
    color: #666;
    border: 1px solid #e4e4e4;
    border-radius: 1rem;
    margin-right: 1rem;
}

.my-pagination>a:hover {
    color: antiquewhite;
}

.my-pagination>a.active {
    background: antiquewhite;
    color: #fff;
    border-color: antiquewhite;
}

.my-pagination>a.disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.my-pagination>a.disabled:hover {
    color: #333;
}

.my-pagination>span {
    margin-right: 0.2rem;
}

.my-pagination {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
}
</style>
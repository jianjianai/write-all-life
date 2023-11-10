import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { SentenceManager } from '@/db';
import Fuse from 'fuse.js';
import { SentencePrototype } from '@/db/class';



export const useSentenceStore = defineStore('sentence', () => {
  const sentenceFuseloinging = ref(true);
  const sentenceFuse: Ref<Fuse<SentencePrototype> | undefined> = ref(undefined);
  const reLoadSentenceFuse = async () => {
    const datas = await SentenceManager.sentenceArray();
    sentenceFuse.value = new Fuse(datas, {
      keys: ["sentence"],
      includeScore:true,
      threshold:0.4999
    });
  };
  reLoadSentenceFuse();
  return {
    sentenceFuseloinging,
    sentenceFuse,
    reLoadSentenceFuse
  };
});

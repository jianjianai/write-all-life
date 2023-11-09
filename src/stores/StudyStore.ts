import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { StudyManager, type LibraryPrototype, type StudyPrototype } from '@/db';

export const useStudyStore = defineStore('study', () => {
  //当前选择的词库
  const studyingLibrary: Ref<LibraryPrototype | undefined | null> = ref(undefined);
  const studyingLibraryloinging = ref(true);

  const needStudyArrays: Ref<StudyPrototype[] | undefined> = ref(undefined);
  const needStudyArraysloinging = ref(true);

  const needReviewArray: Ref<StudyPrototype[] | undefined> = ref(undefined);
  const needReviewArrayloinging = ref(true);
  StudyManager.needReviewArray(new Date()).then((array) => {
    needReviewArray.value = array;
    needReviewArrayloinging.value =false;
  });
  StudyManager.getStudyingLibrary().then((studying) => {
    studyingLibrary.value = studying;
    studyingLibraryloinging.value = false;
    if (!studying) {
      return;
    }
    StudyManager.newStudyArray(studying).then((array) => {
      needStudyArrays.value = array;
      needStudyArraysloinging.value = false;
    });
  });

  return {
    studyingLibrary,
    studyingLibraryloinging,
    needStudyArrays,
    needStudyArraysloinging,
    needReviewArray,
    needReviewArrayloinging
  }
})

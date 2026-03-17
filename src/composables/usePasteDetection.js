import { ref } from 'vue'

const isPasteCardVisible = ref(false)

function triggerPaste() {
  isPasteCardVisible.value = true
}

function confirmPaste() {
  isPasteCardVisible.value = false
}

function rejectPaste() {
  isPasteCardVisible.value = false
}

function dismissPaste() {
  isPasteCardVisible.value = false
}

export function usePasteDetection() {
  return {
    isPasteCardVisible,
    triggerPaste,
    confirmPaste,
    rejectPaste,
    dismissPaste
  }
}

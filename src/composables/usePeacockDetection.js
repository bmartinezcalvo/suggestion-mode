import { ref } from 'vue'

const isCardVisible = ref(false)

function triggerPeacock() {
  isCardVisible.value = true
}

function revise() {
  isCardVisible.value = false
}

function dismissCard() {
  isCardVisible.value = false
}

function decline() {
  isCardVisible.value = false
}

export function usePeacockDetection() {
  return {
    isCardVisible,
    triggerPeacock,
    revise,
    dismissCard,
    decline
  }
}

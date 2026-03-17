<template>
  <div v-if="visible" class="edit-check-card" role="dialog" :aria-label="title">
    <div class="edit-check-card__header">
      <div class="edit-check-card__title">{{ title }}</div>
      <button class="edit-check-card__close" type="button" aria-label="Close" @click="$emit('close')">
        <cdx-icon :icon="cdxIconClose" size="small" />
      </button>
    </div>
    <div class="edit-check-card__body">
      <div class="edit-check-card__description">
        <slot name="description" />
      </div>
      <div class="edit-check-card__actions">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.footer" class="edit-check-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { CdxIcon } from '@wikimedia/codex'
import { cdxIconClose } from '@wikimedia/codex-icons'

defineProps({
  title: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.edit-check-card {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 320px;
  max-width: calc(100% - 32px);
  background: var(--background-color-base, #ffffff);
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: var(--border-radius-base, 2px);
  box-shadow: var(--box-shadow-medium, 0 2px 6px rgba(0, 0, 0, 0.2));
  z-index: 80;
}

.edit-check-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 0;
}

.edit-check-card__title {
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-base, #202122);
}

.edit-check-card__close {
  background: transparent;
  border: 0;
  padding: 4px;
  cursor: pointer;
  color: var(--color-subtle, #54595d);
}

.edit-check-card__body {
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-base, #202122);
}

.edit-check-card__description p {
  margin: 0;
}

.edit-check-card__description a {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.edit-check-card__description a:hover {
  text-decoration: underline;
}

.edit-check-card__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-check-card__footer {
  padding: 0 12px 12px;
}
</style>

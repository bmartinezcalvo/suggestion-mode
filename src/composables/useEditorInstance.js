import { ref } from 'vue'

const editorInstance = ref(null)

export function useEditorInstance() {
  function setEditor(editor) {
    editorInstance.value = editor
  }

  function getEditor() {
    return editorInstance.value
  }

  return {
    setEditor,
    getEditor
  }
}

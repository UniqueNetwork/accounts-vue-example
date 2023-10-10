<script setup lang="ts">
defineProps({
  isVisible: Boolean,
  title: String,
})

const emit = defineEmits(['close'])

</script>
<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal-container">
      <div v-if="!!title" class="modal-title">
        {{title}}
        <button class="close" @click="emit('close')" ></button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(255,255,255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  max-width: 400px;
  border: 1px solid gray;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.4);
  background-color: white;
}

.modal-title {
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: large;
}

.modal-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
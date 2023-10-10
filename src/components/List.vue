<template>
  <div class="list-container">
    <slot />
  </div>
</template>
<style scoped>
.list-container {
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px;
}
</style>
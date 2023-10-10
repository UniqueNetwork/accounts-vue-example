<template>
  <div class="list-item">
    <slot />
  </div>
</template>
<style>
.list-item {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid lightblue;
  padding-bottom: 8px;
}

.list-item>span {
  padding: 8px 0;
}

.list-item>span:first-child {
  width: 100px;
}

.list-item>span:nth-child(2) {
  width: 100px;
  text-align: start;
}

.list-item>span:nth-child(3) {
  flex-grow: 1;
  text-align: start;
}
</style>
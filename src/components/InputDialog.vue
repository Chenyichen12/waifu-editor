<template>
  <div class="dialog-overlay">
    <div class="dialog-container">
      <input v-model="inputValue" placeholder="请输入内容" @keyup.enter="handleEnter" />
      <button @click="handleConfirm">确认</button>
      <button @click="handleCancel">取消</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: ['visible'],
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const inputValue = ref('');

    const handleConfirm = () => {
      emit('confirm', inputValue.value);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    const handleEnter = () => {
      handleConfirm();
    };

    return {
      inputValue,
      handleConfirm,
      handleCancel,
      handleEnter
    };
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
}
</style>
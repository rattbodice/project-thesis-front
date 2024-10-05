<template>
    <dialog ref="modal" class="modal">
      <div class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
        <h3 class="text-lg font-bold">ยืนยันที่จะลบคอร์ส</h3>
        <p class="py-4">คุณยืนยันที่จะลบคอร์ส</p>
      </div>
    </dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const modal = ref(null);
  
  const showModal = () => {
    if (modal.value) {
      modal.value.showModal();
    }
  };
  
  const closeModal = () => {
    if (modal.value) {
      modal.value.close();
    }
  };
  
  defineExpose({ showModal }); // เปิดเผยฟังก์ชัน showModal
  </script>
  
  <style scoped>
  .modal {
    /* สไตล์ที่ต้องการ */
  }
  </style>
  
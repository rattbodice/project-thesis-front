<template>
    <div>
      <div class="p-6 mt-4 bg-white rounded-lg shadow-lg">
        <button @click="gotoEditSubtopic" class="btn btn-warning me-2">แก้ไข</button>
        <button @click="confirmDeleteSubTopic" class="btn btn-error">ลบหัวข้อย่อย</button>
      </div>
  
      <!-- Modal ยืนยันการลบ -->
      <div
        v-if="isModalVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-4">ยืนยันการลบ</h3>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบหัวข้อย่อยนี้: <strong>{{ props.subtopic.title }}</strong>?</p>
          <div class="mt-6 flex justify-end">
            <button @click="closeModal" class="btn btn-cancel me-2">ยกเลิก</button>
            <button @click="handleDelete" class="btn btn-error">ลบ</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { deleteSubTopic } from '@/services/courseSubTopicService';
  
  const props = defineProps({
    subtopic: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['deleted', 'toEdit']);
  
  const isModalVisible = ref(false);
  
  const confirmDeleteSubTopic = () => {
    isModalVisible.value = true; // แสดง modal
  };
  
  const gotoEditSubtopic = () => {
    emit('toEdit'); // ส่งสัญญาณไปยังผู้ฟัง
  };
  
  const handleDelete = async () => {
    const response = await deleteSubTopic(props.subtopic.id);
    if (response.success) {
      console.log('Subtopic deleted successfully:', response.message);
      emit('deleted');
      // รีเฟรชข้อมูลหรือเปลี่ยนเส้นทางหลังจากลบสำเร็จ
    } else {
      console.error('Error deleting subtopic:', response.error);
    }
    closeModal(); // ปิด modal
  };
  
  const closeModal = () => {
    isModalVisible.value = false; // ซ่อน modal
  };
  </script>
  
  <style scoped>
  /* Styles for your component */
  </style>
  
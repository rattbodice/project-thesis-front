<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
      <h3 class="text-lg font-bold">ยืนยันที่จะลบคอร์ส</h3>
      <p class="py-4">คุณยืนยันที่จะลบคอร์สนี้หรือไม่?</p>
      <div class="modal-action">
        <button class="btn btn-error" @click="confirmDelete">ยืนยัน</button>
        <button class="btn" @click="closeModal">ยกเลิก</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig, useFetch } from '#app';

const modal = ref(null);
const topicId = ref(null); // เก็บ ID ของหัวข้อที่จะลบ
const config = useRuntimeConfig();
const router = useRouter(); // ใช้ router

const showModal = (id) => {
  topicId.value = id; // กำหนด topicId เมื่อแสดง modal
  if (modal.value) {
    modal.value.showModal();
  }
};

const closeModal = () => {
  if (modal.value) {
    modal.value.close();
  }
};

// ฟังก์ชันสำหรับการลบหัวข้อ
const confirmDelete = async () => {
  try {
    const { data, error } = await useFetch(
      `${config.public.baseURL}/api/course/deleteCourseById?courseId=${topicId.value}`,
      {
        method: 'DELETE',
      }
    );

    if (error.value) {
      console.error("Error deleting topic course:", error.value);
      alert('เกิดข้อผิดพลาดในการลบหัวข้อ');
    } else {
      console.log("Deleted successfully:", data.value);
      alert('หัวข้อถูกลบสำเร็จ');
      router.push('/e-learning'); 
    }

    closeModal(); // ปิด modal หลังจากการลบสำเร็จ
  } catch (err) {
    console.error("An error occurred:", err);
    alert('เกิดข้อผิดพลาดในการลบหัวข้อ');
  }
};

// เปิดเผยฟังก์ชันให้ component อื่นเรียกใช้
defineExpose({ showModal });
</script>

<style scoped>
.modal {
  /* สไตล์ที่ต้องการ */
}
</style>

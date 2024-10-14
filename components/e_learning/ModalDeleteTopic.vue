<template>
  <div
    v-if="props.show"
    class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-4">
      <h2 class="text-lg font-semibold">ยืนยันการลบ</h2>
      <p>คุณแน่ใจหรือไม่ว่าต้องการลบหัวข้อหลัก "{{ dataTopic.title }}"?</p>
      <div class="flex justify-end mt-4">
        <button
          @click="close"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
        >
          ยกเลิก
        </button>
        <button
          @click="confirmDelete"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { deleteTopicCourse } from "@/services/courseTopicService"; // อย่าลืม import ฟังก์ชันลบที่ถูกต้อง

const props = defineProps(["show", "dataTopic"]);
const emit = defineEmits();

const currentTitle = ref("");

watch(
  () => props.dataTopic,
  (newTopic) => {
    console.log("work2");

    currentTitle.value = newTopic.title; // อัปเดต title เมื่อ dataTopic เปลี่ยนแปลง
  }
);

function close() {
  emit("close");
}

async function confirmDelete() {
  const result = await deleteTopicCourse(props.dataTopic.id); // เรียก API หรือฟังก์ชันสำหรับลบหัวข้อหลักที่ระบุ
  emit("submitted"); // เรียกใช้งาน event เมื่อทำการลบสำเร็จ
  if (result.success) {
    emit("submitted");
    close();
  } else {
    console.error("เกิดข้อผิดพลาดในการแก้ไขบทเรียน:", result.error);
  }
}
</script>

<style scoped>
/* สไตล์ของโมดัล */
</style>

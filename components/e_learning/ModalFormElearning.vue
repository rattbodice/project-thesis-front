<template>
  <!-- ใช้ v-if เพื่อแสดง/ซ่อนโมดัลตามค่า showModal -->
  <div v-if="isVisible" class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 class="text-xl font-semibold mb-4">เพิ่มคอร์สใหม่</h3>
        <form @submit.prevent="submitForm">
          <!-- ชื่อคอร์ส -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">ชื่อคอร์ส</label>
            <input
              type="text"
              v-model="courseName"
              class="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <!-- รายละเอียดคอร์ส -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">รายละเอียดคอร์ส</label>
            <textarea
              v-model="courseDescription"
              class="w-full px-3 py-2 border rounded-lg"
              required
            ></textarea>
          </div>
          <!-- อัพโหลดรูปภาพ -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">อัปโหลดรูปภาพ</label>
            <input
              type="file"
              @change="onImageSelected"
              class="w-full px-3 py-2 border rounded-lg"
              accept="image/*"
            />
          </div>
          <!-- แสดงตัวอย่างรูปภาพ -->
          <div v-if="imagePreview" class="mb-4">
            <img :src="imagePreview" alt="Image Preview" class="w-full h-auto rounded-lg" />
          </div>
          <!-- ปุ่ม -->
          <div class="flex justify-end">
            <!-- ปุ่มยกเลิก -->
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              ยกเลิก
            </button>
            <!-- ปุ่มบันทึก -->
            <button
              type="submit"
              class="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { defineProps, defineEmits } from "vue";
import { useRuntimeConfig } from '#app';

// กำหนด prop เพื่อรับสถานะการแสดงผลจาก parent
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

// ใช้ emit เพื่อส่งเหตุการณ์กลับไปยัง parent
const emit = defineEmits(["close"]);
const config = useRuntimeConfig();

// ตัวแปรควบคุมการแสดงโมดัล
const isVisible = computed(() => props.show);

// ฟังก์ชันปิดโมดัล
const closeModal = () => {
  emit("close");
};

// ค่าที่ใช้ในฟอร์ม
const courseName = ref("");
const courseDescription = ref("");
const imageFile = ref(null); // ตัวแปรเก็บไฟล์ที่อัปโหลด
const imagePreview = ref(null);

// ฟังก์ชันสำหรับอัปโหลดรูปภาพ
const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
    imageFile.value = file; // เก็บไฟล์รูปภาพ
  }
};

// ฟังก์ชันส่งฟอร์ม
const submitForm = async () => {
  try {
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
    if (!courseName.value || !courseDescription.value) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // สร้าง formData เพื่อส่งข้อมูลแบบ multipart/form-data
    const formData = new FormData();
    formData.append("title", courseName.value);
    formData.append("description", courseDescription.value);
    if (imageFile.value) {
      formData.append("image", imageFile.value); // ส่งไฟล์รูปภาพไปด้วย
    }

    // ส่ง request ไปยัง backend โดยใช้ fetch API
    const response = await fetch(`${config.public.baseURL}/course/create-course`, {
      method: "POST",
      body: formData,
    });

    // ตรวจสอบสถานะของ response
    if (response.ok) {
      const data = await response.json();
      console.log("คอร์สถูกสร้างสำเร็จ:", data);
      // ปิดโมดัลเมื่อสร้างคอร์สสำเร็จ
      closeModal();
    } else {
      const errorData = await response.json();
      console.error("เกิดข้อผิดพลาดในการสร้างคอร์ส:", errorData);
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์:", error);
  }
};
</script>


<style scoped>
/* ปรับพื้นหลังของ overlay ให้โปร่งใส */
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5); /* สีดำโปร่งใส 50% */
}
</style>

<template>
  <div v-if="isVisible" class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto">
        <h3 class="text-xl font-semibold mb-4">เพิ่มบทเรียนใหม่</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">ชื่อบทเรียน</label>
            <input
              type="text"
              v-model="courseName"
              class="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">รายละเอียดบทเรียน</label>
            <textarea
              v-model="courseDescription"
              class="w-full px-3 py-2 border rounded-lg"
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">อัปโหลดรูปภาพ</label>
            <input
              type="file"
              @change="onImageSelected"
              class="w-full px-3 py-2 border rounded-lg"
              accept="image/*"
            />
          </div>
          <div v-if="imagePreview" class="mb-4">
            <img :src="imagePreview" alt="Image Preview" class="w-full h-auto rounded-lg" />
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              ยกเลิก
            </button>
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
import { useRuntimeConfig } from "#app";
import { createCourse } from "@/services/courseService";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  fetchCourses: { // เพิ่ม props นี้
    type: Function,
    required: true,
  }
});

const emit = defineEmits(["close"]);
const config = useRuntimeConfig();

const isVisible = computed(() => props.show);

const closeModal = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  emit("close");
};

const courseName = ref("");
const courseDescription = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);
const level = ref(1)

const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
  imagePreview.value = URL.createObjectURL(file);
  imageFile.value = file;
} else {
  alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
}
};

const submitForm = async () => {
  if (!courseName.value || !courseDescription.value) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }
  const userId = localStorage.getItem('userId');
  console.log(`get id user : ${userId}`)
  const result = await createCourse(
    courseName.value,
    courseDescription.value,
    userId,
    imageFile.value,
    level.value,
    config.public.baseURL
  );

  if (result.success) {
    props.fetchCourses();
    closeModal();
  } else {
    console.error("เกิดข้อผิดพลาดในการสร้างบทเรียน:", result.error);
  }
};
</script>

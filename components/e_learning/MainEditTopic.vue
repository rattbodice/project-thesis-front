<template>
    <div
      v-if="isVisible"
      class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          <h3 class="text-xl font-semibold mb-4">แก้ไขหัวข้อ</h3>
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">หัวข้อ</label>
              <input
                type="text"
                v-model="courseTopicName"
                class="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">รายละเอียดหัวข้อ</label>
              <textarea
                v-model="courseDescription"
                class="w-full px-3 py-2 border rounded-lg"
                required
              ></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">ระดับ</label>
              <input
                type="number"
                v-model="courseLevelTopic"
                class="w-full px-3 py-2 border rounded-lg"
                required
              />
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
  import { ref, computed, watch } from "vue";
  import { defineProps, defineEmits } from "vue";
  import { editTopicCourse } from "@/services/courseTopicService"; // ฟังก์ชันสำหรับการอัปเดตหัวข้อ
  import { useToast } from 'vue-toastification';
  
  // รับ props จาก component parent
  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: [String, Number],
      required: true,
    },
    dataTopic: {
      type: Object,
      required: true,
    },
  });
  
  // ใช้ emit เพื่อส่ง event กลับไปยัง parent
  const emit = defineEmits(["close", "submitted"]);
  const isVisible = computed(() => props.show);
  const toast = useToast();

  // กำหนดค่าฟิลด์แก้ไขหัวข้อ
  const courseTopicName = ref("");
  const courseDescription = ref("");
  const courseLevelTopic = ref(1);
  
  // ตั้งค่าข้อมูลเมื่อเปิด modal
  watch(
    () => props.dataTopic,
    (newValue) => {
      if (newValue) {
        courseTopicName.value = newValue.title;
        courseDescription.value = newValue.description;
        courseLevelTopic.value = newValue.level;
      }
    },
    { immediate: true }
  );
  
  // ฟังก์ชันจัดการการบันทึกข้อมูล
  const submitForm = async () => {
    if (!courseTopicName.value || !courseDescription.value) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    const payload = {
      title: courseTopicName.value,
      description: courseDescription.value,
      course_id: props.courseId,
      level: courseLevelTopic.value,
    };
  
    // เรียก API สำหรับการแก้ไข
    const result = await editTopicCourse(props.dataTopic.id, payload);
  
    if (result.success) {
        toast.success('บันทึกหัวข้อหลักสำเร็จ!');
      emit("submitted"); // แจ้ง parent ว่าการบันทึกสำเร็จ
      closeModal(); // ปิด modal
    } else {
      console.error("เกิดข้อผิดพลาดในการแก้ไขหัวข้อ:", result.error);
    }
  };
  
  // ฟังก์ชันจัดการปิด modal
  const closeModal = () => {
    emit("close"); // แจ้ง parent ให้ปิด modal
  };
  </script>
  
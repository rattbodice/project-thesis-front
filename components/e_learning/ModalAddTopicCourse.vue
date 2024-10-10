<template>
  <div
    v-if="isVisible"
    class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
  >
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 class="text-xl font-semibold mb-4">เพิ่มหัวข้อใหม่</h3>
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
import { ref, computed } from "vue";
import { defineProps, defineEmits } from "vue";
import { useRuntimeConfig } from "#app";
import { createTopicCourse } from "@/services/courseTopicService";
import { useToast } from 'vue-toastification';
const toast = useToast();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  courseId: {
    type: [String, Number],
    required: true,
    default: false
  },
  dataTopic: {
    type: Object,
    required: true,
    default: false
  }
});

const emit = defineEmits(["close"]);
const isVisible = computed(() => props.show);

const dataTopic = props.dataTopic;



const courseTopicName = ref("");
const courseDescription = ref("");
const courseLevelTopic = ref(1);

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
    no: (dataTopic.length)+1
  };

  const result = await createTopicCourse(payload);

  if (result.success) {
    toast.success('เพิ่มหัวข้อหลักสำเร็จ!');
    emit("submitted"); 
    closeModal();
  } else {
    console.error("เกิดข้อผิดพลาดในการสร้างคอร์ส:", result.error);
    toast.error('ไม่สามารถเพิ่มหัวข้อหลักได้ !');
  }
};

const closeModal = () => {
  emit("close");
};
</script>

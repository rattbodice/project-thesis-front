<template>
  <div class="flex-1 p-8">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- ชื่อหัวข้อย่อย -->
      <div class="space-y-2">
        <label for="title" class="block text-sm font-medium text-gray-700">หัวข้อย่อย</label>
        <input 
          v-model="title"
          type="text" 
          id="title" 
          class="w-full px-3 py-2 border rounded-lg"
          placeholder="กรอกชื่อหัวข้อย่อย" 
          required
        />
      </div>

      <!-- อัปโหลดวิดีโอ -->
      <div class="space-y-2">
        <label for="video" class="block text-sm font-medium text-gray-700">อัปโหลดวิดีโอ</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          @change="handleFileUpload"
          class="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
      </div>

      <!-- คำบรรยายหัวข้อย่อย -->
      <div class="space-y-2">
        <label for="description" class="block text-sm font-medium text-gray-700">คำบรรยายหัวข้อย่อย</label>
        <textarea
          id="description"
          v-model="description"
          rows="4"
          class="block w-full text-sm px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="กรอกคำบรรยายที่นี่..."
        ></textarea>
      </div>

      <!-- ปุ่มส่งฟอร์ม -->
      <div>
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          ตกลง
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createSubTopic } from '@/services/courseSubTopicService'

const props = defineProps({
  topicId: {
    type: Number,
    required: true,
  },
});

const title = ref('');
const videoFile = ref(null);
const description = ref('');

// ฟังก์ชันจัดการการอัปโหลดไฟล์
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('video/')) {
    videoFile.value = file;
  } else {
    alert('กรุณาอัปโหลดไฟล์วิดีโอที่ถูกต้อง.');
    videoFile.value = null;
  }
};

// ฟังก์ชันจัดการเมื่อกดปุ่มส่งฟอร์ม
const handleSubmit = async () => {
  if (!videoFile.value) {
    alert('กรุณาอัปโหลดวิดีโอ.');
    return;
  }

  if (!title.value.trim() || !description.value.trim()) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน.');
    return;
  }

  // สร้าง formData สำหรับเก็บข้อมูลหัวข้อย่อย
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('video', videoFile.value);
  formData.append('topic_course_id', props.topicId); // ส่ง topicId ไปในข้อมูล

  // เรียกใช้ฟังก์ชัน createSubTopic เพื่อลงข้อมูล
  const result = await createSubTopic(formData);

  if (result.success) {
    alert('ส่งแบบฟอร์มเรียบร้อยแล้ว!');
    title.value = '';
    description.value = '';
    videoFile.value = null;
    emit("submitted"); 
  } else {
    alert('เกิดข้อผิดพลาด: ' + result.error);
  }
};
</script>


<style scoped>
/* คุณสามารถเพิ่มสไตล์ที่กำหนดเองได้ที่นี่ */
</style>

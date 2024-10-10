<template>
    <div class="flex-1 p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- ฟิลด์หัวข้อย่อย -->
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium text-gray-700">หัวข้อย่อย</label>
          <input 
            v-model="title"
            type="text" 
            id="title" 
            class="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="กรอกชื่อหัวข้อย่อย" 
            required
          />
        </div>
        
        <!-- ฟิลด์อัปโหลดวิดีโอ -->
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
  
        <!-- Progress Bar -->
        <div v-if="uploadProgress > 0" class="w-full bg-gray-200 rounded-full">
          <div 
            class="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            :style="{ width: uploadProgress + '%' }"
          >
            {{ uploadProgress }}%
          </div>
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
            required
          ></textarea>
        </div>
  
        <div class="flex justify-between">
          <button
            type="button"
            @click="cancelEdit"
            class="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-300 ease-in-out"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { editSubTopic } from '@/services/courseSubTopicService';
  import { useToast } from 'vue-toastification';
  
  const props = defineProps({
    existingData: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['cancelEdit', 'submitted']);
  const toast = useToast();
  
  const title = ref(props.existingData.title);
  const description = ref(props.existingData.description || ''); // เพิ่มฟิลด์คำบรรยาย
  const videoFile = ref(null);
  const uploadProgress = ref(0);
  const isSubmitting = ref(false);
  
  watch(() => props.existingData, (newVal) => {
    title.value = newVal.title;
    description.value = newVal.description || ''; // เพิ่มการจับการเปลี่ยนแปลงคำบรรยาย
  });
  
  function handleFileUpload(event) {
    videoFile.value = event.target.files[0];
  }
  
  async function handleSubmit() {
  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append('subtopicId', props.existingData.id);
    formData.append('title', title.value);
    formData.append('description', description.value); 
    if (videoFile.value) {
      formData.append('video', videoFile.value);
    }

    const { success, error } = await editSubTopic(formData, {
      onUploadProgress: (progressEvent) => {
        // คำนวณ upload progress และแสดงผล
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      },
    });

    if (success) {
      toast.success('บันทึกหัวข้อย่อยสำเร็จ!');
      emit('submitted');
    } else {
      toast.error('เกิดข้อผิดพลาด: ' + error);
    }
  } catch (error) {
    console.error(error);
    toast.error('เกิดข้อผิดพลาดในการบันทึก!');
  } finally {
    isSubmitting.value = false;
    uploadProgress.value = 0; // รีเซ็ต progress เมื่อเสร็จสิ้น
  }
}


  
  function cancelEdit() {
    emit('cancelEdit'); // ส่งสัญญาณยกเลิกการแก้ไข
  }
  </script>
  
  <style scoped>
  /* Styles for your edit component */
  </style>
  
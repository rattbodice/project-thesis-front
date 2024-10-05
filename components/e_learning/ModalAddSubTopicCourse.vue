<template>
    <div v-if="isVisible" class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          <h3 class="text-xl font-semibold mb-4">อัปโหลดวีดีโอ</h3>
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">เลือกไฟล์วีดีโอ</label>
              <input
                type="file"
                @change="onVideoSelected"
                class="w-full px-3 py-2 border rounded-lg"
                accept="video/*"
                required
              />
            </div>
  
            <!-- Progress Bar -->
            <div v-if="uploading" class="mb-4">
              <progress :value="uploadProgress" max="100" class="w-full"></progress>
              <p>{{ uploadProgress }}%</p>
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
                :disabled="uploading"
              >
                อัปโหลด
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
  import { uploadVideo } from "@/services/videoService"; // ฟังก์ชันสำหรับอัปโหลดวีดีโอ
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    }
  });
  
  const emit = defineEmits(["close"]);
  const config = useRuntimeConfig();
  
  const isVisible = computed(() => props.show);
  const videoFile = ref(null);
  const uploading = ref(false);
  const uploadProgress = ref(0);
  
  // ฟังก์ชันปิด Modal
  const closeModal = () => {
    console.log('work');
    
    emit("close");
  };
  
  // ฟังก์ชันเลือกไฟล์วีดีโอ
  const onVideoSelected = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      videoFile.value = file;
    } else {
      alert("กรุณาอัปโหลดไฟล์วีดีโอเท่านั้น");
    }
  };
  
  // ฟังก์ชันอัปโหลดวีดีโอพร้อมแสดง Progress
  const submitForm = async () => {
    if (!videoFile.value) {
      alert("กรุณาเลือกไฟล์วีดีโอ");
      return;
    }
  
    uploading.value = true;
    uploadProgress.value = 0;
  
    const formData = new FormData();
    formData.append("videoFile", videoFile.value);
  
    try {
      const result = await uploadVideo(formData, config.public.baseURL, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        uploadProgress.value = percentCompleted;
      });
  
      if (result.success) {
        alert("อัปโหลดสำเร็จ!");
        closeModal();
      } else {
        console.error("เกิดข้อผิดพลาดในการอัปโหลดวีดีโอ:", result.error);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      uploading.value = false;
    }
  };
  </script>
  
  
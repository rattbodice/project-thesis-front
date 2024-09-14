<template>
    <div>
      <Navbar />
      <div class="flex flex-col lg:flex-row min-h-screen bg-base-200">
        <!-- เมนูด้านซ้าย -->
        <div class="menu-container lg:w-64 p-4 bg-base-200">
          <ul class="menu">
            <li><a class="text-lg font-semibold">Item 1</a></li>
            <li>
              <details open>
                <summary class="text-lg font-semibold">Video Categories</summary>
                <ul class="pl-4">
                  <li><a>Category 1</a></li>
                  <li><a>Category 2</a></li>
                  <li><a>Category 3</a></li>
                </ul>
              </details>
            </li>
            <li><a class="text-lg font-semibold">Item 3</a></li>
          </ul>
        </div>
  
        <!-- เนื้อหาหลัก (วิดีโอและ title) -->
        <div class="content flex-1 p-4 md:p-8 bg-gray-100">
          <!-- Title -->
          <div class="video-title mb-4">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-700">
              Video Title
            </h1>
          </div>
  
          <!-- ส่วนวิดีโอ -->
          <div class="video-container mb-6">
            <div class="aspect-w-16 aspect-h-9">
              <video
                ref="video"
                controls
                class="w-full h-full object-cover rounded-lg shadow-lg"
                @timeupdate="checkTime"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
  
          <!-- ส่วนรายละเอียดเกี่ยวกับวิดีโอ -->
          <div class="video-details">
            <p class="mt-2 md:mt-4 text-base md:text-lg text-gray-600">
              This is the description of the video. You can provide more
              information here.
            </p>
            <div class="mt-4 md:mt-6 flex flex-col md:flex-row">
              <button
                class="w-full md:w-auto bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600"
              >
                Watch Again
              </button>
              <button
                class="w-full md:w-auto mt-2 md:mt-0 md:ml-4 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800"
              >
                Download
              </button>
            </div>
          </div>
          <!-- Popup -->
          <div
            v-if="showPopup"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div class="bg-white p-8 rounded-lg shadow-lg">
              <h2 class="text-xl font-bold mb-4">Popup Title</h2>
              <p>
                This is the content of the popup. The video reached
                {{ popupSecond }} seconds.
              </p>
              <button
                @click="closePopup"
                class="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const video = ref(null);
  const showPopup = ref(false);
  const popupSecond = ref(null);
  
  function checkTime() {
    const currentTime = video.value.currentTime;
  
    // ตรวจสอบว่าวิดีโอถึงวินาทีที่กำหนดหรือยัง
    if (Math.floor(currentTime) === 5 && !showPopup.value) {
      popupSecond.value = Math.floor(currentTime);
      showPopup.value = true; // แสดง popup
    }
  }
  
  function closePopup() {
    showPopup.value = false;
  }
  </script>
  
  <style scoped>
  /* Flexbox layout */
  .flex {
    display: flex;
  }
  
  /* Fixed menu on large screen */
  .menu-container {
    width: 100%; /* กำหนดให้เต็มจอในหน้าจอเล็ก */
  }
  
  /* Layout styling for content */
  .content {
    padding-left: 0;
    background-color: #f9fafb;
  }
  
  @media (min-width: 1024px) {
    /* กำหนดความกว้างของเมนูเฉพาะหน้าจอขนาดใหญ่ */
    .menu-container {
      width: 256px;
    }
  }
  </style>
  
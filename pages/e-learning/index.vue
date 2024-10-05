<template lang="">
  <div>
    <!-- Modal for E-learning form -->
    <ModalFormElearning :show="showModal" @close="showModal = false" :fetchCourses="fetchCourses" />

    <!-- Sticky Navbar -->
    <Navbar class="sticky top-0 left-0 w-full z-50" />

    <!-- Main content below the Navbar -->
    <div class="pt-6 p-6">
      <div class="flex flex-wrap justify-center gap-6">
        <!-- Loop through all courses -->
        <div
          v-for="course in dataAllCourses"
          :key="course.id"
          class="max-w-sm bg-white w-64 shadow-lg rounded-lg overflow-hidden"
        >
          <img
            class="w-full h-48 object-cover"
            :src="URLAPI + course.image.image_url"
            alt="Course Image"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ course.title }}</h2>
            <p class="text-gray-600 mb-4">{{ course.description }}</p>
            <NuxtLink :to="`/e-learning/detail?course=${course.id}`">
              <button
                class="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                ดูรายละเอียด
              </button>
            </NuxtLink>
          </div>
        </div>

        <!-- Button to open modal form -->
        <button
          @click="showModal = true"
          class="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import ModalFormElearning from '@/components/e_learning/ModalFormElearning.vue';
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue'; // ถ้า Navbar อยู่ใน components โดยตรง
import { fetchAllCourses } from "@/services/courseService";

const config = useRuntimeConfig();
const URLAPI = config.public.baseURL
const showModal = ref(false);
const dataAllCourses = ref([])

definePageMeta({
  middleware: "auth",
});

onMounted(() => {
  fetchCourses()
})

async function fetchCourses() {
  const result = await fetchAllCourses(URLAPI);
  
  if (result.success) {
    dataAllCourses.value = result.data; // เก็บข้อมูลคอร์สที่ได้
  } else {
    console.error(result.error); // แสดงข้อผิดพลาด
  }
}
</script>

<style lang="" scoped></style>

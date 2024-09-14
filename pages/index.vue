<template>
  <div class="w-full min-h-screen bg-green-100 ">
    <Navbar/>
    <div class="p-6">
      <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-x-4 sm:space-y-0 text-white">
      <!-- Card 1 -->
      <NuxtLink to="/e-learning">
        <div
        class="max-w-sm rounded overflow-hidden shadow-lg bg-blue-500 p-6 hover:bg-gray-400 cursor-pointer"
      >
        <div class="text-xl font-semibold mb-2">E-Learning</div>
        <p class=" text-base">นี่คือคำอธิบายของช้อยส์ที่ 1</p>
      </div>
      </NuxtLink>

      <!-- Card 2 -->
      <div
        class="max-w-sm rounded overflow-hidden shadow-lg bg-lime-500 p-6 hover:bg-gray-400 cursor-pointer"
      >
        <div class="text-xl font-semibold mb-2">Document</div>
        <p class=" text-base">นี่คือคำอธิบายของช้อยส์ที่ 2</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
useHead({
  title: "หน้าแรกของเว็ปไซต์",
  meta: [{ name: "description", content: "หน้าแรกของเว็ปไซต์" }],
});
</script>

<style scoped></style>

<template>
  <div class="w-full min-h-screen bg-green-100 ">
    <Navbar/>
    <div class="p-6">
      <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-x-4 sm:space-y-0 text-white">
      <!-- Card 1 -->
      <NuxtLink to="/admin/usermanage">
        <div
        class="max-w-sm rounded overflow-hidden shadow-lg bg-blue-500 p-6 hover:bg-gray-400 cursor-pointer"
      >
        <div class="text-xl font-semibold mb-2">จัดการผู้เข้าใช้งาน</div>
      </div>
      </NuxtLink>

      <!-- Card 2 -->
      <!-- <div
        class="max-w-sm rounded overflow-hidden shadow-lg bg-lime-500 p-6 hover:bg-gray-400 cursor-pointer"
      >
        <div class="text-xl font-semibold mb-2">จัดการรายละเอียดบทเรียน</div>
      </div> -->
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

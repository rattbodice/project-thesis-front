<template lang="">
  <div>
    <Navbar />
    <div class="p-6">
      <div class="flex flex-wrap justify-center gap-6">
        <!-- Card 1 -->
        <div class="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden ">
          <img
            class="w-full h-48 object-cover"
            src="https://via.placeholder.com/400x200"
            alt="Course Image"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              ชื่อคอร์ส
            </h2>
            <p class="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum
            </p>
           <NuxtLink to="/e-learning/detail">
            <button
              class="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              ดูรายละเอียด
            </button>
           </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<style lang=""></style>

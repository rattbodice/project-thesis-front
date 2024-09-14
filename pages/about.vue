<template>
  <div class="container">
      <h1>เกี่ยวกับผู้พัฒนาเว็ปไซต์</h1>
      <img src="/images/about.svg" alt="">
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});
useHead({
  title: "เกี่ยวกับเรา", 
  meta: [{ name: "description", content: "เกี่ยวกับเรา" }],
});
</script>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img{
  width: 500px;
  height: 500px;
}
</style>

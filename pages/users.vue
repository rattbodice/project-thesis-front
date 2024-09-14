<template>
  <div>
    <h1>Users List</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.username }}</li>
    </ul>
  </div>
</template>

<script setup>
const { data: users } = await useFetch('/api/users') // เปลี่ยน URL เป็น API ของคุณ

console.log(users.value)
</script>
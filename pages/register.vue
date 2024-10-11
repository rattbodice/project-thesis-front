<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">สมัครสมาชิก</h1>
      <form @submit.prevent="register" class="space-y-4">
        <input
          v-model="firstName"
          type="text"
          placeholder="First Name"
          required
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Last Name"
          required
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          class="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          สมัครสมาชิก
        </button>
        <NuxtLink to="/login" >
          <button
          type="submit"
          class="w-full bg-indigo-500 text-white mt-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          ย้อนกลับ
        </button>
        </NuxtLink>
      </form>
      <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

// Disable layout for this page
definePageMeta({
  layout: false
});

const config = useRuntimeConfig()
const firstName = ref('') // เพิ่ม firstName
const lastName = ref('')  // เพิ่ม lastName
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function register() {
  try {
    const response = await useFetch(`${config.public.baseURL}/api/users/register`, {
      method: 'POST',
      body: {
        firstName: firstName.value, // ส่งค่า firstName
        lastName: lastName.value,   // ส่งค่า lastName
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })
    alert('Registered successfully!')
    window.location.href = '/login'
  } catch (err) {
    error.value = 'Registration failed. Please try again.'
  }
}
</script>

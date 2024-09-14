<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-700">เข้าสู่ระบบ</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          เข้าสู่ระบบ
        </button>
      </form>
      <NuxtLink
        to="/register"
        class="mt-4 block w-full text-center bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        สมัครสมาชิก
      </NuxtLink>
      <p v-if="error" class="mt-4 text-center text-red-500">{{ error }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

definePageMeta({
  layout: false,
});

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const config = useRuntimeConfig();

onMounted(() => {
  // ตรวจสอบว่าอยู่ใน client-side (browser)
  if (process.client) {
    const token = localStorage.getItem('token');
    if (token) {
      // ถ้ามี token ให้นำผู้ใช้ไปที่หน้า home หรือ dashboard
      router.push('/');
    }
  }
});

async function login() {
  try {
    const response = await $fetch(`${config.public.baseURL}/users/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      }
    });

    // เก็บ JWT token ใน localStorage
    localStorage.setItem('token', response.token);

    // นำผู้ใช้ไปยังหน้า dashboard หรือ home
    router.push('/');
  } catch (err) {
    error.value = 'Login failed. Please try again.';
  }
}
</script>


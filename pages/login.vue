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
import jwt_decode from 'jwt-decode'; // Import jwt-decode

definePageMeta({
  layout: false,
});

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const config = useRuntimeConfig();

onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }
});

async function login() {
  try {
    const response = await $fetch(`${config.public.baseURL}/api/users/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // Save JWT token in localStorage
    localStorage.setItem('token', response.token);

    // Decode JWT token to get userId
    const decodedToken = jwt_decode(response.token);
    const userId = decodedToken.userId;
    localStorage.setItem('userId', userId);

    console.log(userId);
    // Navigate user to dashboard or home
    router.push('/');
  } catch (err) {
    error.value = 'Login failed. Please try again.';
  }
}
</script>



<template >
  <div >
    <header class="">
      <div class="navbar bg-sky-500">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl text-white">PM Smart E-Learning</a>
        </div>

        <!-- ปุ่ม hamburger menu -->
        <label class="sm:hidden btn btn-circle swap swap-rotate">
          <input type="checkbox" v-model="isOpen" />
          
          <!-- hamburger icon -->
          <UIcon  name="i-cil:align-right" class="w-6 h-6 swap-off fill-current" />
          
        
        <!-- close icon -->
        <UIcon  name="i-cil:x-circle" class="w-7 h-7 swap-on fill-current" />
          
        </label>

        <!-- เมนูที่แสดงบนหน้าจอขนาดใหญ่ -->
        <div class="hidden sm:flex flex-none">
          <ul class="menu menu-horizontal px-1">
            <li><NuxtLink to="/" class="text-white">หน้าหลัก</NuxtLink></li>
            <li>
              <details>
                <summary class="text-white">Parent</summary>
                <ul class="bg-sky-400 rounded-t-none p-2">
                  <li><NuxtLink to="/about" class="text-white">Link 1asdasd</NuxtLink></li>
                  <li><a>Link2asdasdasasd</a></li>
                </ul>
              </details>
            </li>
            <li>
              <button
                @click="logout()"
                class="bg-red-400 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <UIcon name="i-cil:arrow-circle-right" class="w-5 h-5" />
                <span>ลงชื่อออก</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- เมนูที่แสดงบนหน้าจอขนาดเล็ก -->
      <div v-if="isOpen" class="sm:hidden">
        <ul class="menu menu-vertical bg-orange-100 p-4 space-y-2">
          <li><NuxtLink to="/">หน้าหลัก</NuxtLink></li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul class="bg-base-100 rounded-t-none p-2">
                <li><NuxtLink to="/about">Link 1</NuxtLink></li>
                <li><a>Link 2</a></li>
              </ul>
            </details>
          </li>
          <li>
            <button
              @click="logout()"
              class="bg-red-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <UIcon name="i-cil:arrow-circle-right" class="w-5 h-5" />
              <span>ลงชื่อออก</span>
            </button>
          </li>
        </ul>
      </div>
    </header>
    <div >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();
const isOpen = ref(false);

function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}
</script>

<style scoped>
nav {
  margin: 10px auto;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #333;
}
nav a {
  color: white;
  text-decoration: none;
  margin-left: 12px;
  font-size: 18px;
  padding: 10px;
}
nav a:hover {
  color: orange;
}
.logo {
  margin-right: auto;
  padding-left: 10px;
  color: white;
}
</style>

<template>
  <div class="w-full min-h-screen bg-green-100">
    <Navbar />

    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-semibold mb-4">จัดการผู้ใช้งาน</h1>

      <!-- Search Bar -->
      <div class="mb-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="ค้นหาผู้ใช้งาน..."
          class="input input-bordered w-full"
        />
      </div>

      <!-- User Management Table -->
      <div class="overflow-x-auto">
        <table class="table w-full bg-white shadow-md rounded-lg">
          <!-- Table Head -->
          <thead class="bg-gray-200">
            <tr>
              <th>#</th>
              <th>ชื่อผู้ใช้งาน</th>
              <th>อีเมล</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>บทบาท</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="btn btn-warning mr-2" @click="editUser(user)">
                  แก้ไข
                </button>
                <button
                  class="btn btn-error"
                  @click="openDeleteUserModal(user)"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <div>
          <button
            class="btn btn-primary"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ก่อนหน้า
          </button>
          <span class="mx-2">หน้า {{ currentPage }}</span>
          <button
            class="btn btn-primary"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            ถัดไป
          </button>
        </div>

        <!-- Add User Button -->
        <button class="btn btn-primary" @click="openAddUserModal">
          เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      <!-- Add/Edit User Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold">
            {{ isEditMode ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน" }}
          </h3>
          <form @submit.prevent="isEditMode ? updateUser() : addUser()">
            <div class="form-control mb-4">
              <label class="label">ชื่อผู้ใช้งาน</label>
              <input
                v-model="userForm.username"
                type="text"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control mb-4">
              <label class="label">อีเมล</label>
              <input
                v-model="userForm.email"
                type="email"
                class="input input-bordered"
                required
              />
            </div>

            <!-- ช่องรหัสผ่าน -->
            <div v-if="!isEditMode" class="form-control mb-4">
              <label class="label">รหัสผ่าน</label>
              <input
                v-model="userForm.password"
                type="password"
                class="input input-bordered"
                required
              />
            </div>

            <div v-if="isEditMode" class="form-control mb-4">
              <label class="label"
                >รหัสผ่าน (ถ้าไม่ต้องการเปลี่ยนให้เว้นว่าง)</label
              >
              <input
                v-model="userForm.password"
                type="password"
                class="input input-bordered"
                placeholder="กรุณาเว้นว่างถ้าไม่ต้องการเปลี่ยน"
              />
            </div>

            <div class="form-control mb-4">
              <label class="label">ชื่อ</label>
              <input
                v-model="userForm.firstName"
                type="text"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control mb-4">
              <label class="label">นามสกุล</label>
              <input
                v-model="userForm.lastName"
                type="text"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control mb-4">
              <label class="label">บทบาท</label>
              <select v-model="userForm.role" class="select select-bordered">
                <option value="student">นักเรียน</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>
            <div class="form-control">
              <button type="submit" class="btn btn-primary w-full">
                {{ isEditMode ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มผู้ใช้งาน" }}
              </button>
            </div>
            <button
              class="btn btn-secondary w-full mt-2"
              @click="isModalOpen = false"
            >
              ปิด
            </button>
          </form>
        </div>
      </div>
      <!-- Delete User Modal -->
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white rounded-lg p-6 w-96">
          <h3 class="text-lg font-semibold">ยืนยันการลบผู้ใช้งาน </h3>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้ ?</p>
          <p>{{ userToDelete.firstName }} {{ userToDelete.lastName }}</p>
          <div class="flex justify-between mt-4">
            <button class="btn btn-danger" @click="deleteUser(userToDelete.id)">
              ยืนยัน
            </button>
            <button
              class="btn btn-secondary"
              @click="isDeleteModalOpen = false"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const config = useRuntimeConfig();
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);

// ข้อมูลจำลองสำหรับผู้ใช้งาน
const users = ref([]);
const userForm = ref({
  username: "",
  email: "",
  password: "", // เพิ่มฟิลด์รหัสผ่าน
  firstName: "",
  lastName: "",
  role: "student",
});
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedUserId = ref(null);
const searchQuery = ref("");

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = 10;

const openDeleteUserModal = (user) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const paginatedUsers = computed(() => {
  if (!Array.isArray(users.value)) {
    console.error("Expected users.value to be an array, but got:", users.value);
    return [];
  }

  const filteredUsers = users.value.filter((user) => {
    // ตรวจสอบว่า user มีค่า และ user.username และ user.email มีค่าก่อน
    const usernameMatch =
      user.username &&
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase());
    const emailMatch =
      user.email &&
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    return usernameMatch || emailMatch;
  });

  return filteredUsers.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  );
});

// Total pages calculation
const totalPages = computed(() => {
  const filteredUsers = users.value.filter((user) => {
    return (
      user.username.includes(searchQuery.value.toLowerCase()) ||
      user.email.includes(searchQuery.value.toLowerCase())
    );
  });
  return Math.ceil(filteredUsers.length / itemsPerPage);
});

// ฟังก์ชันที่เรียกใช้เมื่อ component ถูกติดตั้ง
onMounted(async () => {
  await fetchUsers();
});

// ฟังก์ชันดึงข้อมูลผู้ใช้งาน
const fetchUsers = async () => {
  try {
    const response = await fetch(
      `${config.public.baseURL}/api/users/fetchUsers`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log("Fetched users:", data); // ตรวจสอบข้อมูลที่ได้
    users.value = data.users; // ให้แน่ใจว่า data เป็นอาเรย์
    console.log(users.value); // เพิ่มการตรวจสอบข้อมูลผู้ใช้
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// เปิด modal สำหรับเพิ่มผู้ใช้ใหม่
const openAddUserModal = () => {
  resetForm();
  isEditMode.value = false;
  isModalOpen.value = true;
};

// เปิด modal สำหรับแก้ไขผู้ใช้
const editUser = (user) => {
  userForm.value = { ...user };
  selectedUserId.value = user.id;
  isEditMode.value = true;
  isModalOpen.value = true;
};

// รีเซ็ตฟอร์ม
const resetForm = () => {
  userForm.value = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student",
  };
  selectedUserId.value = null;
};

// ฟังก์ชันเพิ่มผู้ใช้งาน
const addUser = async () => {
  try {
    const response = await fetch(`${config.public.baseURL}/api/users/addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userForm.value),
    });
    if (!response.ok) throw new Error("Network response was not ok");
    await fetchUsers();
    isModalOpen.value = false;
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// ฟังก์ชันอัปเดตผู้ใช้งาน
const updateUser = async () => {
  try {
    const response = await fetch(
      `${config.public.baseURL}/api/users/editUser/${selectedUserId.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm.value),
      }
    );
    if (!response.ok) throw new Error("Network response was not ok");
    await fetchUsers();
    isModalOpen.value = false;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// ฟังก์ชันลบผู้ใช้งาน
const deleteUser = async (id) => {
  try {
    const response = await fetch(
      `${config.public.baseURL}/api/users/deleteUser/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Network response was not ok");
    isDeleteModalOpen.value =false
    await fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
</script>

<style scoped>
/* ปรับแต่งสไตล์ที่นี่ */
</style>

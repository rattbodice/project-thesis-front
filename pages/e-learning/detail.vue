<template>
  <ModalAddTopicCourse
    :show="showModalAddTopic"
    :courseId="course"
    @close="showModalAddTopic = false"
    @submitted="fetchTopicCourse"
    :dataTopic="dataTopicCourse"
  />
  <ModalEditTopicCourse
    :show="showModalEditTopic"
    :courseId="course"
    :dataTopic="dataTopicToEdit"
    @submitted="fetchTopicCourse"
    @close="showModalEditTopic = false"
  />
  <ModalDeleteCourse ref="modalDeleteCourse" />
  <Navbar class="w-full z-50" />

  <div class="flex h-screen bg-gray-100">
    <!-- Left-side Navigation Menu -->
    <!-- Left-side Navigation Menu -->
<div
  v-if="menuOpen"
  class="fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto w-64 p-4 bg-gray-200 shadow-lg overflow-y-auto transition-transform"
>
  <!-- ปุ่มปิดสำหรับ mobile -->
  <button
    class="lg:hidden bg-red-500 text-white p-2 rounded-lg mb-4"
    @click="toggleMenu"
  >
    ปิดเมนู
  </button>

  <!-- รายการเมนู -->
  <h2
    class="text-center font-semibold text-xl text-blue-700"
    v-if="dataCourse"
  >
    {{ dataCourse.title }}
  </h2>
  <ul class="mt-6">
    <div
      v-for="data in dataTopicCourse"
      class="bg-white rounded-lg shadow-md mb-2"
    >
      <div
        class="text-lg font-semibold bg-blue-200 text-blue-600 py-3 px-4 cursor-pointer rounded-md"
        @click="data.open = !data.open"
      >
        {{ data.title }}
        <span v-if="data.open">▲</span><span v-else>▼</span>
      </div>
      <div v-if="data.open" class="py-2 px-4">
        <button
          v-for="subtopic in data.subTopics"
          @click="openMainContent(subtopic)"
          class="w-full text-left bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-2"
        >
          {{ subtopic.title }}
        </button>

        <button
          @click="openSubtopicForm(data.id)"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md mb-2"
        >
          เพิ่มหัวข้อย่อย
        </button>

        <button
          @click="openModalEditTopic(data)"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md mb-2"
        >
          แก้ไขหัวข้อหลัก
        </button>

        <button
          @click="openEditMore(data)"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          จัดเรียงเพิ่มเติม
        </button>
      </div>
    </div>

    <!-- เพิ่มหัวข้อหลัก -->
    <li class="flex flex-col space-y-2 mt-4">
      <button
        @click="showModalAddTopic = true"
        class="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        + เพิ่มหัวข้อหลัก
      </button>

      <button
        @click="openEditTopic"
        class="w-full bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded"
      >
        จัดเรียงหัวข้อหลัก
      </button>

      <button
        @click="openDeleteModal()"
        class="w-full bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
      >
        <UIcon name="cil:trash" class="mr-2" />
        ลบคอร์ส
      </button>
    </li>
  </ul>
</div>

<!-- ปุ่มเปิดเมนูที่แอบอยู่ทางซ้ายมือ -->
<button
  v-if="!menuOpen" 
  class="lg:hidden fixed top-4 left-0  transform bg-blue-500 text-white p-3 z-50 rounded-r-lg shadow-lg"
  @click="toggleMenu"
>
  เปิดเมนู
</button>


    

    <!-- Main Content Area -->
    <div class="flex-grow overflow-y-auto">
      <MainContent
        v-if="showMainContent"
        :subtopic="dataShowMainContent"
        @fetchTopic="fetchTopicCourse"
        @setDefault="setMainDefault"
        @toEdit="openEditMainContent"
      />
      <MainAddSubtopic
        :topicId="TopicIdToAddSub"
        v-if="showMainAddSubTopic"
        @submitted="fetchTopicCourse"
        @subtopicLatest="openMainContentLatest"
      />
      <MainEditSubtopic
        :existingData="dataShowMainContent"
        v-if="showEditMainContent"
        @submitted="
          handleEditMain(dataShowMainContent.topicId, dataShowMainContent.id)
        "
        @toEdit="openEditMainContent"
        @cancelEdit="cancelEditMainContent"
      />
      <editCourse
        v-if="showEditCourse"
        :initialSubTopics="subTopicEdit || []"
        @submitted="fetchTopicCourse"
      />
      <editBigCourse
        v-if="showEditBigCourse"
        :initialTopics="dataTopicCourse"
        @submitted="fetchTopicCourse"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ModalAddTopicCourse from "@/components/e_learning/ModalAddTopicCourse.vue";
import ModalEditTopicCourse from "@/components/e_learning/MainEditTopic.vue";
import ModalDeleteCourse from "~/components/e_learning/ModalDeleteCourse.vue";
import { getAllTopicInCourse } from "@/services/courseTopicService";
import { deleteCourseById, getCourseById } from "@/services/courseService";
import MainContent from "~/components/e_learning/MainContent.vue";
import MainAddSubtopic from "~/components/e_learning/MainAddSubtopic.vue";
import MainEditSubtopic from "~/components/e_learning/MainEditSubtopic.vue";
import editCourse from "~/components/e_learning/admin/editCourse.vue";
import editBigCourse from "~/components/e_learning/admin/editBigCourse.vue";

const menuOpen = ref(true); // Controls the menu visibility
const video = ref(null); // Reference to the video element
const showPopup = ref(false); // Popup state
const popupSecond = ref(null); // Holds the time the popup should appear

const route = useRoute();
const course = route.query.course;

const showModalAddTopic = ref(false);
const showModalEditTopic = ref(false);
const dataTopicToEdit = ref(null);

// --------------------------------------- main
const showMainAddSubTopic = ref(false);
const TopicIdToAddSub = ref(0);
const showMainContent = ref(false);
const dataShowMainContent = ref([]);
const showEditMainContent = ref(false);

const showEditCourse = ref(false);
const subTopicEdit = ref(false);

const showEditBigCourse = ref(false);

// Data for topic
const dataCourse = ref(null);
const dataTopicCourse = ref([]);

function openSubtopicForm(topicId) {
  setMainDefault();
  TopicIdToAddSub.value = topicId;
  showMainAddSubTopic.value = true;
}

function openMainContent(subtopic) {
  setMainDefault();
  dataShowMainContent.value = subtopic;
  showMainContent.value = true;
}

function openModalEditTopic(topic) {
  dataTopicToEdit.value = topic;
  showModalEditTopic.value = true;
}

function openEditMore(data) {
  setMainDefault();
  subTopicEdit.value = data;
  showEditCourse.value = true;
}

function openEditTopic() {
  setMainDefault();
  console.log(dataTopicCourse.value);
  showEditBigCourse.value = true;
}

function openEditMainContent() {
  setMainDefault();
  showEditMainContent.value = true;
}

function cancelEditMainContent() {
  setMainDefault();
  showMainContent.value = true;
}

function handleEditMain(topicId, subtopicId) {
  // ส่งทั้ง topicId และ subtopicId เพื่อ Fetch ข้อมูลใหม่
  openMainContentLatest(topicId, subtopicId);
}

async function openMainContentLatest(topicId, subtopicId) {
  await fetchTopicCourse(); // รอให้ข้อมูลของ topicCourse ถูกดึงมา
  setMainDefault(); // รีเซ็ตค่าพื้นฐาน

  // หาข้อมูล topic ตาม topicId
  const dataTopicSelect = dataTopicCourse.value.find(
    (topic) => topic.id === topicId
  );

  // ตรวจสอบว่าพบ topic หรือไม่
  if (dataTopicSelect) {
    // ค้นหา subTopic ตาม subtopicId
    const dataSubTopic = dataTopicSelect.subTopics.find(
      (subTopic) => subTopic.id === subtopicId
    );

    // ตรวจสอบว่าพบ subTopic หรือไม่
    if (dataSubTopic) {
      dataShowMainContent.value = dataSubTopic; // แสดงข้อมูล subTopic ที่พบ
      showMainContent.value = true; // แสดงเนื้อหาหลัก
    } else {
      console.error("ไม่พบ subtopic ที่มี id นี้");
    }
  } else {
    console.error("ไม่พบ topic ที่มี id นี้");
  }
}

// --------------------------------------- const modal ref
const modalDeleteCourse = ref(null);

const openDeleteModal = () => {
  if (modalDeleteCourse.value) {
    modalDeleteCourse.value.showModal(course); // Show the delete modal
  }
};
// --------------------------------------

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

// Check if video reached a certain point to show popup
function checkTime() {
  const currentTime = video.value.currentTime;

  if (Math.floor(currentTime) === 5 && !showPopup.value) {
    popupSecond.value = Math.floor(currentTime);
    showPopup.value = true; // Show popup at 5 seconds
  }
}

// Fetch the list of topics in the course
async function fetchTopicCourse() {
  try {
    const userId = localStorage.getItem("userId");
    const { success, data, error } = await getAllTopicInCourse(course, userId);

    if (success && Array.isArray(data)) {
      dataTopicCourse.value = data; // Assign the topics array directly
      console.log("Fetched topics:", dataTopicCourse.value);
    } else if (error) {
      console.error("Error fetching topics:", error);
    } else {
      console.error("Unexpected data structure:", data);
    }
  } catch (error) {
    console.error("Failed to fetch topics:", error.message);
  }
}

async function fetchCourses() {
  try {
    const { success, data, error } = await getCourseById(course);

    if (data) {
      dataCourse.value = data;
      console.log(dataCourse.value);
    } else if (error) {
      console.error("Error get course:", error);
    } else {
      console.error("Unexpected data structure:", data);
    }
  } catch (error) {}
}

async function setMainDefault() {
  showMainAddSubTopic.value = false;
  showMainContent.value = false;
  showEditMainContent.value = false;
  showEditCourse.value = false;
  showEditBigCourse.value = false;
}

// Listen for when the modal closes and refetch data
async function handleModalClose() {
  showModalAddTopic.value = false;
  await fetchTopicCourse();
}

onMounted(async () => {
  if (course) {
    await fetchTopicCourse();
    await fetchCourses();
  } else {
    console.error("Course ID is missing in the route");
  }
});
</script>

<style scoped>
/* Flexbox layout */
.flex {
  display: flex;
}

/* Full height menu */
.menu-container {
  height: 100vh;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

/* On large screens */
@media (min-width: 1024px) {
  .menu-container {
    transform: translateX(0); /* Visible on large screens */
  }
}

/* Ensure full height of menu on all screens */

/* Transition for smooth sliding in and out */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}

/* Video container for full height */
.video-container {
  height: 75vh;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

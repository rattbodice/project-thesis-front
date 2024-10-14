<template>
  <Navbar class="w-full z-50" />
  <ModalAnswers
  :answers="selectedAnswers"
  :show="showModal"  
  :subTopicId="selectedSubTopicId"
  @close="showModal = false"  
/>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">
      Topics for Course: {{ courseTitle }}
    </h1>

    <div v-if="topics.length === 0" class="text-gray-500">
      No topics found for this course.
    </div>

    <div
      v-for="(topic, index) in topics"
      :key="topic.id"
      class="mb-4 border-b pb-4"
    >
      <h2
        class="text-2xl font-semibold cursor-pointer flex items-center"
        @click="toggleSubTopics(index)"
      >
        <span
          :class="
            isOpen(index)
              ? 'rotate-90 transition-transform'
              : 'transition-transform'
          "
        >
          ➕
        </span>
        {{ topic.title }}
      </h2>

      <div v-if="isOpen(index)" class="ml-4 mt-2 bg-gray-50 rounded-lg">
        <!-- แสดงหัวข้อย่อยและความก้าวหน้าของผู้ใช้ -->
        <div
          v-for="(subTopic, subIndex) in topic.subTopics"
          :key="subTopic.id"
          class="p-4 border-b last:border-b-0"
        >
          <div class="collapse bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title text-xl font-medium">
              {{ subTopic.title }}
            </div>
            <div class="collapse-content">
                <div
                v-if="subTopic.userVideoProgress.length > 0"
                class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4"
              >
                <p class="flex-1">
                  Name: {{ subTopic.userVideoProgress[0].user.firstName }}
                  {{ subTopic.userVideoProgress[0].user.lastName }}
                </p>
                <p class="flex-1">
                  Progress:
                  {{ subTopic.userVideoProgress[0].last_watched_time }} seconds
                </p>
                <p class="flex-1">
                  Status:
                  {{
                    subTopic.userVideoProgress[0].is_finished
                      ? "Completed"
                      : "In Progress"
                  }}
                </p>
                <button @click="openModal(subTopic.id,subTopic.userVideoProgress[0].user.id)" class="btn">
                  View Answers
                </button>
                <br />
              </div>

              <div v-else>
                <p class="text-gray-500">No progress recorded.</p>
              </div>
            </div>
          </div>

          <!-- แสดงผลลัพธ์ของผู้ใช้ -->
          <!-- <div v-if="subTopic.userVideoProgress.length > 0">
                        <p>
                            Progress: 
                            {{ subTopic.userVideoProgress[0].last_watched_time }} seconds
                        </p>
                        <p>
                            Status: 
                            {{ subTopic.userVideoProgress[0].is_finished ? "Completed" : "In Progress" }}
                        </p>
                    </div>
                    <div v-else>
                        <p class="text-gray-500">No progress recorded.</p>
                    </div>
                    
                    <button @click="openModal(subTopic)" class="mt-2 btn">
                        View Answers
                    </button> -->
        </div>
      </div>
    </div>

  


  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import ModalAnswers from "@/components/e_learning/admin/ModalAnswer.vue"; // สร้าง component สำหรับโมดัลคำตอบ
import Navbar from "@/components/Navbar.vue";
import { fetchUserProgressByCourseId } from "@/services/progressService"; // ฟังก์ชันสำหรับดึงข้อมูลหัวข้อ
import { fetchQuestionsWithAnswerByUser } from "@/services/questionService"; // ฟังก์ชันใหม่สำหรับดึงคำถามและคำตอบ
import { useRoute } from "vue-router";

const route = useRoute();
const courseId = ref(route.query.course); // เปลี่ยนให้เป็น ref เพื่อให้สามารถใช้ watch ได้
const courseTitle = ref(""); // แสดงชื่อหลักสูตร


const topics = ref([]);
const showModal = ref(false);
const selectedAnswers = ref([]);
const selectedSubTopicId = ref(null); // ประกาศ selectedSubTopicId
const openSubTopics = ref([]); // เก็บสถานะเปิดปิดหัวข้อย่อย

watch(
  () => route.query.course, // ค่าที่จะติดตาม
  (newCourseId) => {
    // ทำการดึงข้อมูลหรือทำงานเมื่อ courseId เปลี่ยน
    if (newCourseId) {
      courseId.value = newCourseId;
      fetchDataForCourse(newCourseId);
    }
  }
);

onMounted(async () => {
  await fetchDataForCourse(courseId.value);
});

async function fetchDataForCourse(courseId) {
  const response = await fetchUserProgressByCourseId(courseId);
  console.log(response.data.topics);
  topics.value = response.data.topics; // เก็บข้อมูลหัวข้อที่ได้
  courseTitle.value = response.data.courseName.title
  console.log(topics.value);
}

function toggleSubTopics(index) {
  openSubTopics.value[index] = !openSubTopics.value[index];
}

function isOpen(index) {
  return openSubTopics.value[index];
}

async function openModal(subTopicId, userId) {
  selectedSubTopicId.value = subTopicId;
  try {
    const response = await fetchQuestionsWithAnswerByUser(subTopicId, userId);
    selectedAnswers.value = response.data;
    console.log(selectedAnswers.value);
    showModal.value = true; // เปิด modal
  } catch (error) {
    console.error("Failed to fetch answers:", error);
  }
}




</script>

<style scoped>
/* การปรับแต่ง CSS สำหรับ collapse */
h2 {
  position: relative;
}

h2 span {
  display: inline-block;
  margin-right: 10px;
  transition: transform 0.2s ease;
}

.border-b {
  border-bottom: 1px solid #e5e7eb; /* สีเทาอ่อน */
}

.bg-gray-50 {
  background-color: #f9fafb; /* สีพื้นหลังเทาอ่อน */
}

.shadow {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* เงาเบา */
}
</style>

<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-lg">
    <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ subtopic.title }}</h2>
    <p class="text-lg text-gray-600 mb-6">{{ subtopic.description }}</p>

    <div class="relative w-full h-[75vh] bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <video
  ref="videoElement"
  v-if="subtopic.video"
  class="w-full h-full object-cover"
  controls
  @loadedmetadata="onVideoLoaded"
  @timeupdate="onVideoTimeUpdate"
  @play="onVideoPlay"
  @pause="onVideoPauseOrEnd"
  @ended="onVideoPauseOrEnd"
  @seeking="onVideoSeeking"
  @seeked="onVideoSeeked"
  :key="subtopic.video.file_path"
>

        <source :src="`${config.public.baseURL}/${subtopic.video.file_path}`" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <EDComponent v-if="isAdmin" :subtopic="subtopic" @toEdit="handleEdit" @deleted="handleDeleteSubtopic"/>

    <addQuestionForm v-if="isAdmin" class="mt-6" @fetchQuestions="fetchQuestions" :subTopicId="subtopic.id" :videoLength="videoLength" />
    
    <!-- ป๊อปอัพแสดงคำถาม -->
    <questionPopup 
      v-if="showQuestionPopup" 
      :show="showQuestionPopup" 
      :questionId="questions[currentQuestionIndex]?.id" 
      :questionText="questions[currentQuestionIndex]?.question_text" 
      :options="questions[currentQuestionIndex]?.options" 
      :subTopicId="subtopic.id" 
      @close="showQuestionPopup = false" 
      @answerSubmitted="handleAnswerSubmission"
      @fetchQuestions="fetchQuestions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import addQuestionForm from './addQuestionForm.vue';
import questionPopup from './QuestionPopup.vue'; // Import question popup component
import EDComponent from "./EdComponent.vue";
import { updateProgressVideoUser, getProgressVideoUser } from '@/services/progressService'; 
import { getQuestionsBySubTopic } from '@/services/questionService'; 

const config = useRuntimeConfig();

const props = defineProps({
  subtopic: {
    type: Object,
    default: () => ({}),
  },
});
const isAdmin = ref(false)
const emit = defineEmits(['setDefault','toEdit']); // กำหนด emit

const videoLength = ref(0);
const videoElement = ref(null); 
const userId = localStorage.getItem('userId'); 
const lastWatchedTime = ref(0); 
const hasWatched = ref(false); 

const showQuestionPopup = ref(false); // สถานะการแสดงป๊อปอัพ
const currentQuestionIndex = ref(null);  // เก็บคำถามที่แสดงในปัจจุบัน
const questions = ref([]);  // เก็บคำถามทั้งหมดของ subtopic

watch(() => props.subtopic, async (newValue) => {
  if (newValue.video) {
    // ตั้งค่า videoElement ใหม่
    lastWatchedTime.value = 0; // รีเซ็ตเวลาที่เคยดู
    hasWatched.value = false; // รีเซ็ตสถานะการดู
    
    fetchVideoProgress()
    // รอให้ DOM อัปเดตก่อน
    await nextTick();

    // ตั้งค่า src ของ videoElement
    videoElement.value.src = `${config.public.baseURL}/${newValue.video.file_path}`;
    videoElement.value.load(); // โหลดวิดีโอใหม่
  }
}, { immediate: true });

const onVideoLoaded = async (event) => {
  videoLength.value = event.target.duration; 
  videoElement.value.currentTime = lastWatchedTime.value; 
  await fetchVideoProgress()
};

const fetchQuestions = async () => {
  // ตรวจสอบว่าผู้ใช้เรียนจบหรือยัง
  if (hasWatched.value) {
    console.log('User has already completed the video. No questions will be fetched.');
    return; // ไม่ต้องดึงคำถามถ้าผู้ใช้เรียนจบแล้ว
  }

  const response = await getQuestionsBySubTopic(props.subtopic.id, userId);
  if (response.success) {
    questions.value = response.data;
    console.log('Questions fetched:', questions.value); // แสดงคำถามที่ดึงมา
  }
};


const checkForNewQuestions = async (currentTime) => {
  console.log('Current Time:', currentTime);
  console.log('Questions:', questions.value);
  
  for (let i = 0; i < questions.value.length; i++) {
    console.log('Checking question:', questions.value[i]);
    
    if (questions.value[i].time_in_video <= currentTime && (currentQuestionIndex.value === null || currentQuestionIndex.value < i)) {
      currentQuestionIndex.value = i; // เปลี่ยนให้เป็น i แทน 0
      showQuestionPopup.value = true; // แสดงป๊อปอัพ
      videoElement.value.pause(); // หยุดเล่นวิดีโอ
      break; // แสดงคำถามที่ตรงตามเงื่อนไข
    }
  }

  if (!showQuestionPopup.value) {
    console.log('No new questions available at this time.');
  }
};



const handleEdit = async ()=>{
  emit('toEdit')
}



const handleAnswerSubmission = async (answer) => {
  console.log('Answer submitted:', answer);
  // ส่งคำตอบไปที่ backend

  // หลังจากตอบคำถามแล้ว ให้เรียก fetchQuestions ใหม่เพื่อตรวจสอบคำถามที่เหลือ
  await fetchQuestions();  

  // ตรวจสอบคำถามใหม่หลังจากการตอบ
  if (questions.value.length > 0) {
    // รีเซ็ต currentQuestionIndex และตรวจสอบคำถามใหม่
    currentQuestionIndex.value = null; // รีเซ็ตดัชนี
    checkForNewQuestions(videoElement.value.currentTime); // ตรวจสอบคำถามใหม่อีกครั้ง
  } else {
    console.log('No new questions available.');
  }

  showQuestionPopup.value = false; // ปิดป๊อปอัพ
};


const fetchVideoProgress = async () => {
  try {
    // ตรวจสอบว่าเป็น Admin หรือไม่
    if (isAdmin.value) {
      // ตั้งค่าว่าแอดมินได้ดูวิดีโอแล้วทันที
      lastWatchedTime.value = videoLength.value;
      await updateProgressVideoUser({
        user_id: userId,
        subtopic_id: props.subtopic.id,
        last_watched_time: videoLength.value,
        is_finished: true, // ตั้งค่าว่าแอดมินดูจบแล้ว
      });
      hasWatched.value = true;
      
    }
    // ถ้าไม่ใช่แอดมิน ดึงค่าประวัติวิดีโอปกติ
    const progressData = await getProgressVideoUser(userId, props.subtopic.id);
    if (progressData.success) {
      lastWatchedTime.value = progressData.data.last_watched_time;
      videoElement.value.currentTime = lastWatchedTime.value; 
      if (progressData.data.is_finished) {
        hasWatched.value = true;
      }
    }
  } catch (error) {
    console.error('Error fetching video progress:', error);
  }
};
const onVideoTimeUpdate = () => {
  const video = videoElement.value;
  const currentTime = video.currentTime;

  // ถ้าผู้ใช้เรียนจบแล้ว ไม่ต้องตรวจสอบคำถาม
  // if (hasWatched.value) {
  //   return;
  // }

  checkForNewQuestions(currentTime);

  if (currentTime > lastWatchedTime.value) {
    if (currentTime - lastWatchedTime.value <= 3) {
      lastWatchedTime.value = currentTime;
      updateVideoProgress();
    } else {
      video.currentTime = lastWatchedTime.value;
    }
  }
};

const updateVideoProgress = async () => {
  const video = videoElement.value;
  const currentTime = video.currentTime;

  lastWatchedTime.value = currentTime; 
  const isFinished = currentTime >= videoLength.value;

  try {
    const response = await updateProgressVideoUser({
      user_id: userId,
      subtopic_id: props.subtopic.id,
      last_watched_time: lastWatchedTime.value,
      is_finished: isFinished,
    });

    if (response.success) {
      if (isFinished) {
        hasWatched.value = true;
      }
    }
  } catch (error) {
    console.error('Error updating video progress:', error);
  }
};

const onVideoPauseOrEnd = () => {
  // updateVideoProgress();
};

const onVideoSeeking = () => {
  const video = videoElement.value;
  const seekTime = video.currentTime;

  if (seekTime > lastWatchedTime.value) {
    video.currentTime = lastWatchedTime.value;
  }
};

const onVideoSeeked = () => {
  const video = videoElement.value;
  if (video.currentTime > lastWatchedTime.value) {
    video.currentTime = lastWatchedTime.value;
  }
};

const onVideoPlay = () => {
  const video = videoElement.value;
  if (video.currentTime > lastWatchedTime.value) {
    video.currentTime = lastWatchedTime.value;
  }
};

const handleDeleteSubtopic= () => {
  emit("fetchTopic")
  emit("setDefault")
}

const handleEditSubTopic = () => {
  
}

onMounted(async () => {
  const userRole = localStorage.getItem("role");
  
  if (userRole === "admin") {
    isAdmin.value = true;
  }

  if (userId) {
    // await fetchVideoProgress(); 
    await fetchQuestions();
  }
});

</script>

<style scoped>
h2 {
  font-size: 1.875rem;
}

p {
  line-height: 1.75rem;
}

.relative:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}
</style>
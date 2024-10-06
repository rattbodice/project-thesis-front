<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-lg">
    <!-- หัวข้อและคำบรรยาย -->
    <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ subtopic.title }}</h2>
    <p class="text-lg text-gray-600 mb-6">{{ subtopic.description }}</p>

    <!-- ส่วนวิดีโอ -->
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

    <!-- ส่งความยาววิดีโอเป็น props -->
    <addQuestionForm class="mt-6" :subTopicId="subtopic.id" :videoLength="videoLength" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import addQuestionForm from './addQuestionForm.vue';
import { updateProgressVideoUser, getProgressVideoUser } from '@/services/progressService'; 

const config = useRuntimeConfig();

const props = defineProps({
  subtopic: {
    type: Object,
    default: () => ({}),
  },
});

// ความยาววิดีโอและข้อมูลอื่น ๆ
const videoLength = ref(0);
const videoElement = ref(null); 
const userId = localStorage.getItem('userId'); 
const lastWatchedTime = ref(0); 
const hasWatched = ref(false); 
const isSeeking = ref(false); // ใช้สำหรับตรวจสอบว่าผู้ใช้กำลังกลอวิดีโอ

// ฟังก์ชันที่เรียกใช้เมื่อโหลดข้อมูลเมตาของวิดีโอ
const onVideoLoaded = (event) => {
  videoLength.value = event.target.duration; 
  console.log('Video loaded:', videoLength.value);
};

// ฟังก์ชันที่ดึงข้อมูลความก้าวหน้าของวิดีโอ
const fetchVideoProgress = async () => {
  try {
    const progressData = await getProgressVideoUser(userId, props.subtopic.id);
    if (progressData.success) {
      lastWatchedTime.value = progressData.data.last_watched_time;
      videoElement.value.currentTime = lastWatchedTime.value;
      if (progressData.data.is_finished) {
        hasWatched.value = true;
      }
      console.log('Progress fetched:', progressData.data);
    }
  } catch (error) {
    console.error('Error fetching video progress:', error);
  }
};

// ฟังก์ชันที่อัปเดตความก้าวหน้าของวิดีโอ
const updateVideoProgress = async () => {
  const video = videoElement.value;
  const currentTime = video.currentTime;

  console.log('Updating progress, current time:', currentTime);

  // บันทึกเฉพาะเมื่อ currentTime มากกว่า lastWatchedTime
  if (currentTime > lastWatchedTime.value) {
    lastWatchedTime.value = currentTime; // อัปเดตเวลาที่เคยดู
    const isFinished = currentTime >= videoLength.value;

    try {
      await updateProgressVideoUser({
        user_id: userId,
        subtopic_id: props.subtopic.id,
        last_watched_time: lastWatchedTime.value,
        is_finished: isFinished,
      });

      console.log('Progress updated, last watched time:', lastWatchedTime.value, 'isFinished:', isFinished);

      if (isFinished) {
        hasWatched.value = true;
      }
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  }
};

// เรียก updateVideoProgress ทุกครั้งที่มีการอัปเดตเวลา
const onVideoTimeUpdate = () => {
  const video = videoElement.value;
  const currentTime = video.currentTime;

  console.log('Time updated, current time:', currentTime);

  // อัปเดต progress ถ้า currentTime มากกว่า lastWatchedTime
  if (!isSeeking.value) {
    // บันทึกเมื่อ currentTime มากกว่า lastWatchedTime
    if (currentTime > lastWatchedTime.value) {
      updateVideoProgress(); // อัปเดตความคืบหน้าถ้าอยู่ข้างหน้า
    }
  }
};

// เรียก updateVideoProgress เมื่อวิดีโอหยุดหรือจบ
const onVideoPauseOrEnd = () => {
  console.log('Video paused or ended');
  updateVideoProgress();
};

// ฟังก์ชันที่เรียกใช้เมื่อผู้ใช้เริ่มกลอวิดีโอ
const onVideoSeeking = () => {
  console.log('Video seeking started');
  isSeeking.value = true;
};

// ฟังก์ชันที่เรียกใช้เมื่อผู้ใช้กลอวิดีโอเสร็จสิ้น
const onVideoSeeked = () => {
  console.log('Video seeking ended');
  isSeeking.value = false;
};


onMounted(() => {
  fetchVideoProgress(); 
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

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

const videoLength = ref(0);
const videoElement = ref(null); 
const userId = localStorage.getItem('userId'); 
const lastWatchedTime = ref(0); 
const hasWatched = ref(false); 

const isSeeking = ref(false)
const isPlaying = ref(false)

const onVideoLoaded = (event) => {
  videoLength.value = event.target.duration; 
  console.log('Video loaded. Duration:', videoLength.value);
  videoElement.value.currentTime = lastWatchedTime.value; 
  console.log('Setting currentTime to last watched time:', lastWatchedTime.value);
};

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
    } else {
      console.log('Failed to fetch progress data');
    }
  } catch (error) {
    console.error('Error fetching video progress:', error);
  }
};

const onVideoTimeUpdate = () => {
  const video = videoElement.value;
  const currentTime = video.currentTime;

  console.log('Video time update. Current time:', currentTime);

  // อัปเดตความก้าวหน้าเมื่อเวลาปัจจุบันมีค่ามากกว่า lastWatchedTime
  if (currentTime > lastWatchedTime.value) {
    if (currentTime - lastWatchedTime.value <= 1) {
      // Allow small increments (up to 1 second) for smooth playback
      lastWatchedTime.value = currentTime;
      updateVideoProgress();
    } else {
      // If skipped ahead by more than 1 second, revert
      video.currentTime = lastWatchedTime.value;
      console.log('Attempted to skip ahead. Reverting to:', lastWatchedTime.value);
    }
  }
};

const updateVideoProgress = async () => {
  const video = videoElement.value;
  const currentTime = video.currentTime;

  console.log('Current Time:', currentTime, 'Last Watched Time:', lastWatchedTime.value);
  
  // อัปเดตความก้าวหน้าหากเวลาปัจจุบันมีค่ามากกว่า lastWatchedTime
  
    lastWatchedTime.value = currentTime; 
    const isFinished = currentTime >= videoLength.value;

    console.log('Updating progress to:', lastWatchedTime.value, 'Is Finished:', isFinished);

    try {
      const response = await updateProgressVideoUser({
        user_id: userId,
        subtopic_id: props.subtopic.id,
        last_watched_time: lastWatchedTime.value,
        is_finished: isFinished,
      });

      if (response.success) {
        console.log('Progress updated, last watched time:', lastWatchedTime.value, 'isFinished:', isFinished);

        if (isFinished) {
          hasWatched.value = true;
        }
      } else {
        console.log('Failed to update progress:', response.message);
      }
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  
};

const onVideoPauseOrEnd = () => {
  console.log('Video paused or ended at:', videoElement.value.currentTime);
  // updateVideoProgress();
  isPlaying.value = false;
};

const onVideoSeeking = () => {
  const video = videoElement.value;
  const seekTime = video.currentTime;
  console.log('Video seeking started at:', seekTime);

  if (seekTime > lastWatchedTime.value) {
    // Prevent seeking forward beyond the last watched time
    video.currentTime = lastWatchedTime.value;
    console.log('Attempted to seek ahead. Reverting to:', lastWatchedTime.value);
  }
};

const onVideoSeeked = () => {
  const video = videoElement.value;
  console.log('Video seeking ended. Current time:', video.currentTime);
  
  if (video.currentTime > lastWatchedTime.value) {
    video.currentTime = lastWatchedTime.value;
    console.log('Enforcing last watched time:', lastWatchedTime.value);
  }
};

const onVideoPlay = () => {
  const video = videoElement.value;
  console.log('Video played. Current time:', video.currentTime);

  if (video.currentTime > lastWatchedTime.value) {
    video.currentTime = lastWatchedTime.value;
    console.log('Enforcing last watched time on play:', lastWatchedTime.value);
  }

  isPlaying.value = true;
};

onMounted(() => {
  if (userId) {
    fetchVideoProgress(); 
  } else {
    console.log('User is not logged in. Skipping progress fetch.');
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
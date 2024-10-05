<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-lg">
    <!-- หัวข้อและคำบรรยาย -->
    <h2 class="text-4xl font-bold mb-2 text-gray-800">{{ subtopic.title }}</h2>
    <p class="text-lg text-gray-600 mb-6">{{ subtopic.description }}</p>

    <!-- ส่วนวิดีโอ -->
    <div class="relative w-full h-[75vh] bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <video
        v-if="subtopic.video"
        class="w-full h-full object-cover"
        controls
        :key="subtopic.video.file_path"
      >
        <source :src="`${config.public.baseURL}/${subtopic.video.file_path}`" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const props = defineProps({
  subtopic: {
    type: Object,
    default: () => ({}),
  },
});

// Watch for changes in subtopic to trigger updates
watch(
  () => props.subtopic,
  (newSubtopic) => {
    console.log("Subtopic changed:", newSubtopic);
    // You can perform additional actions if needed when subtopic changes
  },
  { deep: true }
);
</script>

<style scoped>
/* Styles for the main content */
h2 {
  font-size: 1.875rem;
}

p {
  line-height: 1.75rem;
}

/* ปรับแต่งวิดีโอ */
.video-container video {
  border-radius: 0.5rem;
}

.relative {
  position: relative;
}

.relative:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}
</style>

<template>
  <div v-if="props.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute inset-0" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        ✖ Close
      </button>

      
      <ul v-if="answers" class="mt-4">
        <li
          v-for="(question, index) in answers.data"
          :key="question.id"
          class="mb-4 border p-4 rounded-lg bg-gray-50"
        >
          <h3 class="font-semibold text-lg mb-2">Question {{ index + 1 }}:</h3>
          <p class="text-gray-700 mb-2">{{ question.question_text }}</p>
          <p class="text-gray-700"><strong>Options:</strong> {{ question.options }}</p>
          <p class="text-gray-700"><strong>Correct Answer:</strong> {{ question.correct_answer }}</p>

          <div v-if="question.answers.length > 0" class="mt-2">
            <p class="font-semibold text-gray-700">User Answers:</p>
            <ul>
              <li
                v-for="(answer, answerIndex) in question.answers"
                :key="answer.id"
                class="mt-2 p-2 border rounded-lg bg-gray-100"
              >
                <p><strong>Selected Option:</strong> {{ answer.selected_option }}</p>
                <p><strong>Status:</strong> {{ answer.is_correct ? 'Correct' : 'Incorrect' }}</p>
              </li>
            </ul>
          </div>

          <p v-else class="text-gray-500">No answers recorded for this question.</p>
        </li>
      </ul>
      <div v-else class="mt-4">
        <p class="text-center text-gray-500">No answers available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  answers: Object,
  show: Boolean,
  subTopicId: Number,
});

// Watch สำหรับการเปลี่ยนแปลงของ props.show
watch(() => props.show, async (newShow) => {
  if (newShow) {
    console.log(props.answers); 
  }
});
</script>

<style scoped>
/* ไม่จำเป็นต้องมีการปรับแต่งเพิ่มเติม เนื่องจากใช้ Tailwind CSS */
</style>

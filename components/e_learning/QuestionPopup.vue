<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">{{ questionText }}</h2>
      <div class="mb-4">
        <p class="text-gray-600">โปรดเลือกคำตอบ :</p>
        <div v-for="(option, index) in options" :key="index" class="mb-2 mt-2 flex-grow items-center">
          <input type="radio" :id="'option' + index" :value="option" v-model="selectedAnswer" class="hidden peer" />
          <label :for="'option' + index" class="flex items-center cursor-pointer p-2 rounded-lg border border-gray-300 transition-colors duration-200 peer-checked:bg-blue-100 peer-checked:border-blue-500 hover:bg-gray-100">
            <span class="w-4 h-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center peer-checked:bg-blue-500">
              <span v-if="selectedAnswer === option" class="w-2 h-2 bg-white rounded-full"></span>
            </span>
            {{ option }}
          </label>
        </div>
      </div>
      <div class="flex justify-center">
        <button 
          @click="onSubmitAnswer" 
          :disabled="!selectedAnswer" 
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { submitAnswer } from '@/services/answerService'; // Import ฟังก์ชัน submitAnswer จาก services

const props = defineProps({
  show: Boolean,
  questionText: String,
  options: Array,
  questionId: Number, // ต้องมี ID ของคำถามเพื่อส่งคำตอบ
  subTopicId: Number, // ต้องใช้ ID ของ subTopic
});

const selectedAnswer = ref(null); // เก็บคำตอบที่เลือก
const emit = defineEmits(['close', 'answerSubmitted']); // สำหรับการปิดป๊อปอัพและแจ้งการส่งคำตอบ

// ฟังก์ชันบันทึกคำตอบ
const onSubmitAnswer = async () => {
  const answerData = {
    question_id: props.questionId,
    subtopic_id: props.subTopicId,
    selected_option: selectedAnswer.value,
    user_id: localStorage.getItem('userId'), // ดึง userId จาก localStorage
  };

  // เรียกฟังก์ชันจาก services เพื่อลงคำตอบ
  const response = await submitAnswer(answerData);

  if (response.success) {
    emit('answerSubmitted', selectedAnswer.value); // แจ้งให้รู้ว่าคำตอบส่งแล้ว
    emit('fetchQuestions')
    emit('close'); // ปิดป๊อปอัพ
  } else {
    console.error('Error submitting answer:', response.error);
  }
};
</script>

<style scoped>
/* ปรับ CSS ตามต้องการ */
label {
  transition: background-color 0.3s ease;
}
</style>

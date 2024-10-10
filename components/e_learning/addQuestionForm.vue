<template>
  <div class="p-6 bg-white rounded-lg shadow-lg">
    <h3 class="text-2xl font-semibold mb-4">Questions</h3>
    <form @submit.prevent="submitQuestions">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="mb-6 border p-4 rounded"
      >
        <h4 class="text-xl font-semibold mb-2">Question {{ index + 1 }}</h4>

        <!-- Time in Video -->
        <div class="mb-4">
          <label class="block text-lg font-medium">Time in Video:</label>
          <div class="flex space-x-2">
            <input
              v-model="question.minutes"
              type="number"
              placeholder="Minutes"
              class="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
            <span>:</span>
            <input
              v-model="question.seconds"
              type="number"
              placeholder="Seconds"
              class="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="question_text" class="block text-lg font-medium">Question:</label>
          <textarea
            v-model="question.question_text"
            class="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-lg font-medium">Options:</label>
          <div class="flex space-x-4">
            <input
              v-model="question.options[0]"
              type="text"
              placeholder="Option 1"
              class="flex-1 p-2 border border-gray-300 rounded"
              required
            />
            <input
              v-model="question.options[1]"
              type="text"
              placeholder="Option 2"
              class="flex-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="correct_answer" class="block text-lg font-medium">Correct Answer:</label>
          <select
            v-model="question.correct_answer"
            class="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>Select correct answer</option>
            <option
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Remove Question Button -->
        <button
          type="button"
          @click="removeQuestion(index)"
          class="bg-red-500 text-white font-semibold py-1 px-2 rounded hover:bg-red-700"
        >
          Remove Question
        </button>
      </div>

      <button
        type="button"
        @click="addQuestion"
        class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 mb-4"
      >
        Add Another Question
      </button>

      <button
        type="submit"
        class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
      >
        Submit Questions
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createQuestion, getQuestionsBySubTopic, clearQuestions } from '@/services/questionService'; // Import the service

const props = defineProps({
  subTopicId: {
    type: Number,
    required: true,
  },
  videoLength: {  // ความยาวของวิดีโอ (ในวินาที)
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['fetchQuestions'])

// State for questions
const questions = ref([]);

// Function to add a new question
const addQuestion = () => {
  questions.value.push({
    question_id: null,  // แก้ไขเพิ่ม question_id
    time_in_video: 0,
    question_text: '',
    options: ['', ''],
    correct_answer: '',
    subTopic_id: props.subTopicId,
    minutes: 0,
    seconds: 0,
  });
};

// Function to remove a question by index
const removeQuestion = (index) => {
  questions.value.splice(index, 1);
};

// Function to convert time to seconds
const convertTimeToSeconds = (mins, secs) => {
  return (Number(mins) * 60) + (Number(secs) || 0);
};

// Function to submit questions to the server
const submitQuestions = async () => {
  // Check if questions array is empty
  if (questions.value.length === 0) {
    const response = await clearQuestions(props.subTopicId); // Call clearQuestions if empty
    if (response.success) {
      alert('All questions cleared successfully!'); // Success message
    } else {
      alert(`Failed to clear questions: ${response.error}`); // Error message
      console.error('Error:', response.error);
    }
    return; // Stop further execution
  }

  // If questions are present, map and convert them
  const submittedQuestions = questions.value.map(question => ({
    question_id: question.question_id, // เพิ่ม question_id ที่มีอยู่
    time_in_video: convertTimeToSeconds(question.minutes, question.seconds),
    question_text: question.question_text,
    options: question.options,
    correct_answer: question.correct_answer,
    subTopic_id: question.subTopic_id,
  }));

  // Validate that time does not exceed video length
  for (const question of submittedQuestions) {
    if (question.time_in_video > props.videoLength) {
      alert(`Time in video for question "${question.question_text}" exceeds video length.`);
      return; // Stop submission
    }
  }

  // Log submitted questions
  console.log('Submitted Questions:', submittedQuestions);

  // Call the createQuestion service to submit the questions
  const response = await createQuestion({ questions: submittedQuestions });
  
  if (response.success) {
    alert('Questions created successfully!'); // Success message
    console.log('Created Questions:', response.data);
    emit("fetchQuestions")
  } else {
    alert(`Failed to create questions: ${response.error}`); // Error message
    console.error('Error:', response.error);
  }
};

// ดึงคำถามเมื่อโหลด component
onMounted(async () => {
  const response = await getQuestionsBySubTopic(props.subTopicId);
  
  if (response.success) {
    // หากดึงคำถามสำเร็จ
    questions.value = response.data.map(question => ({
      ...question,
      minutes: Math.floor(question.time_in_video / 60),
      seconds: question.time_in_video % 60,
    }));
  } else {
    console.error('Error fetching questions:', response.error);
  }
});
</script>

<style scoped>
/* เพิ่มการตกแต่งฟอร์มตามต้องการ */
</style>

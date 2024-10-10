<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-xl font-bold mb-4">จัดเรียงหัวข้อย่อย</h1>
    <draggable v-if="subTopics.length > 0" v-model="subTopics" @end="onDragEnd" class="space-y-4">
      <div
        v-for="(subTopic, index) in subTopics"
        :key="subTopic.id"
        class="p-4 border rounded-md bg-white shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold">{{ subTopic.title }}</h2>
            <p>หมายเลข: {{ subTopic.no }}</p>
            <label for="level" class="block">ระดับ:</label>
            <input
              type="number"
              v-model.number="subTopic.level"
              class="border rounded-md p-1 w-16"
              min="1"
            />
          </div>
          <button @click="deleteSubTopic(subTopic.id)" class="text-red-600 hover:text-red-800">
            ลบ
          </button>
        </div>
      </div>
    </draggable>
    <p v-else>ยังไม่มีหัวข้อย่อย</p>
    <button @click="saveOrder" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      บันทึกการจัดเรียง
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { deleteSubTopic as deleteSubTopicService, orderUpdateCourse } from '@/services/courseSubTopicService';

const props = defineProps({
  initialSubTopics: {
    type: Array,
    required: true,
    default: () => [] // ตั้งค่าเริ่มต้นเป็น array ว่าง
  },
});

const emit = defineEmits(['orderUpdated']);

const subTopics = ref([...props.initialSubTopics]);

const onDragEnd = () => {
  // เมื่อเสร็จสิ้นการลากและจัดเรียง
};

const deleteSubTopic = async (id) => {
  const { success } = await deleteSubTopicService(id);
  if (success) {
    subTopics.value = subTopics.value.filter((subTopic) => subTopic.id !== id);
  }
};

const saveOrder = async () => {
  const order = subTopics.value.map((subTopic, index) => ({
    id: subTopic.id,
    no: index + 1,
    level: subTopic.level,
  }));

  const { success } = await orderUpdateCourse(order);
  if (success) {
    emit('orderUpdated');
  }
};
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.transition-colors {
  transition: background-color 0.3s ease;
}
</style>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-xl font-bold mb-4">จัดเรียงหัวข้อย่อย</h1>
    <draggable 
      v-if="subTopics.length > 0" 
      v-model="subTopics" 
      @end="onDragEnd" 
      class="space-y-4" 
      tag="div" 
      :item-key="'id'" 
      :move="onMove" 
    >
      <template #item="{ element, index }">
        <div :class="{ dragging: isDragging }"> <!-- เพิ่ม class dragging -->
          <div class="card">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-lg font-semibold">{{ element.title }}</h2>
                <p>หมายเลข: {{ element.no }}</p>
                <label for="level" class="block">ระดับ:</label>
                <input
                  type="number"
                  v-model.number="element.level"
                  class="border rounded-md p-1 w-16"
                  min="1" 
                />
              </div>
              <button @click="deleteSubTopic(element.id)" class="text-red-600 hover:text-red-800">
                ลบ
              </button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <p v-else>ยังไม่มีหัวข้อย่อย</p>
    <button @click="saveOrder" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      บันทึกการจัดเรียง
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { deleteSubTopic as deleteSubTopicService, orderUpdateCourse } from '@/services/courseSubTopicService';
import { useToast } from 'vue-toastification';
const toast = useToast();
const props = defineProps({
  initialSubTopics: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const emit = defineEmits(['orderUpdated']);

const Topics = ref({});
const subTopics = ref([]);

watch(() => props.initialSubTopics, (newSubTopics) => {
  Topics.value = { ...newSubTopics };
  subTopics.value = Array.isArray(Topics.value.subTopics) ? Topics.value.subTopics : [];
}, { immediate: true });

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
    toast.success('จัดเรียงหัวข้อย่อยสำเร็จ!');
    emit("submitted")
    emit('orderUpdated');
  }else{
    toast.error('จัดเรียงหัวข้อย่อยไม่สำเร็จ!');
  }
};

const isDragging = ref(false);

const onMove = (evt) => {
  isDragging.value = true; // ตั้งค่าสถานะเป็น true เมื่อมีการลาก
  return true; // คืนค่า true เพื่ออนุญาตให้ลาก
};

const onDragEnd = () => {
  console.log('การลากและจัดเรียงเสร็จสิ้น');
  isDragging.value = false; // ตั้งค่าสถานะกลับเป็น false เมื่อการลากเสร็จสิ้น
};
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.transition-colors {
  transition: background-color 0.3s ease;
}
.dragging {
  opacity: 0.5; /* ทำให้รายการโปร่งแสงเมื่อถูกลาก */
  background-color: #e0e0e0; /* เปลี่ยนสีพื้นหลัง */
}
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  background-color: #ffffff; /* เปลี่ยนให้พื้นหลังเป็นสีขาว */
  transition: transform 0.2s, box-shadow 0.2s; /* เพิ่มการเปลี่ยนแปลงสำหรับเงา */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาให้การ์ด */
}

.card:hover {
  transform: scale(1.02); /* เพิ่มขนาดเมื่อ hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* เพิ่มเงาเมื่อ hover */
}
</style>

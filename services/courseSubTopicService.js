import axios from 'axios';

export const createSubTopic = async (formData, onUploadProgress) => {
  try {
    const config = useRuntimeConfig(); // ดึงค่าการตั้งค่า runtimeConfig

    // เรียก axios เพื่อสร้าง SubTopic และติดตาม progress
    const response = await axios.post(
      `${config.public.baseURL}/api/course/create-subtopic`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress, // ส่งฟังก์ชันสำหรับติดตามการอัปโหลด
      }
    );

    // ตรวจสอบผลลัพธ์
    if (response.status === 201) {
      return { success: true, data: response.data }; // ส่งข้อมูลกลับเมื่อสำเร็จ
    } else {
      return { success: false, error: response.data }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
    }
  } catch (error) {
    return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
  }
};

// ฟังก์ชันสำหรับแก้ไข SubTopic
export const editSubTopic = async (formData, onUploadProgress) => {
  try {
    const config = useRuntimeConfig(); // ดึงค่าการตั้งค่า runtimeConfig

    // เรียก axios เพื่อแก้ไข SubTopic และติดตาม progress
    const response = await axios.post(
      `${config.public.baseURL}/api/course/edit-subtopic`,
      formData,
      {
        onUploadProgress, // ส่งฟังก์ชันสำหรับติดตามการอัปโหลด
      }
    );

    // ตรวจสอบผลลัพธ์
    if (response.status === 200) {
      return { success: true, data: response.data }; // ส่งข้อมูลกลับเมื่อสำเร็จ
    } else {
      return { success: false, error: response.data }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
    }
  } catch (error) {
    return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
  }
};

export const orderUpdateCourse = async (order) => {
  try {
    const config = useRuntimeConfig();

    // เรียก axios เพื่ออัปเดตลำดับและระดับ
    const response = await axios.put(
      `${config.public.baseURL}/api/course/order-subtopic`,
      order,
    );   

    // ตรวจสอบผลลัพธ์
    if (response.status === 200) {
      return { success: true, message: response.data.message }; // ส่งข้อมูลกลับเมื่อสำเร็จ
    } else {
      return { success: false, error: response.data }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
    }
  } catch (error) {
    return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
  }
};


export const deleteSubTopic = async (subTopicId) => {
  try {
    const config = useRuntimeConfig(); // ดึงค่าการตั้งค่า runtimeConfig

    // เรียก axios เพื่อส่งคำขอลบ SubTopic
    const response = await axios.delete(
      `${config.public.baseURL}/api/course/delete-subtopic`,
      {
        data: { subTopic_id: subTopicId }, // ส่ง subTopic_id ใน body ของ request
      }
    );

    // ตรวจสอบผลลัพธ์
    if (response.status === 200) {
      return { success: true, message: response.data.message }; // ส่งข้อมูลกลับเมื่อสำเร็จ
    } else {
      return { success: false, error: response.data }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
    }
  } catch (error) {
    return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
  }
};

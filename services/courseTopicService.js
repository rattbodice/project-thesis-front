

export const createTopicCourse = async (
  payload
) => {
    
  try {
    const config = useRuntimeConfig();
    const { data, error } = await useFetch(
      `${config.public.baseURL}/api/course/create-topic-course`,
      {
        method: "POST",
        body: payload,
      }
    );

    if (error.value) {
      console.error("Error creating topic course:", error.value);
      return { success: false, error: error.value };
    }

    return { success: true, data: data.value };
  } catch (err) {
    console.error("An error occurred:", err);
    return { success: false, error: err };
  }
};

export const editTopicCourse = async (id, payload) => {
  try {
    const config = useRuntimeConfig();
    
    // Log เพื่อเช็คว่า id และ payload ถูกต้อง
    console.log("Editing topic with ID:", id, "and payload:", payload);
    
    // ทำการ request แบบ PUT เพื่อแก้ไขหัวข้อ
    const { data, error } = await useFetch(
      `${config.public.baseURL}/api/course/edit-topic-course/${id}`,
      {
        method: "PUT",
        body: payload,
      }
    );

    if (error.value) {
      console.error("Error editing topic course:", error.value);
      return { success: false, error: error.value };
    }

    return { success: true, data: data.value };
  } catch (err) {
    console.error("An error occurred:", err);
    return { success: false, error: err };
  }
};


export const getAllTopicInCourse = async (courseId,userId) => {
  try {
    const config = useRuntimeConfig();
    
    // Log to ensure courseId is correct
    console.log("Fetching topics for courseId:", courseId);
    
    // Perform fetch request
    const response = await fetch(
      `${config.public.baseURL}/api/course/getAllTopicCourse?courseId=${courseId}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', // อาจจะมีหรือไม่มีก็ได้ แต่จะดีถ้าระบุ
        }
      }
    );

    if (response.ok){
      const data = await response.json();
      console.log("หัวข้อของบทเรียนถูกสร้าง:", data);
      return { success: true, data };
    } else{
      const errorData = await response.json();
      console.error("เกิดข้อผิดพลาดในการเรียกหัวข้อของบทเรียน:", errorData);
      return { success: false, error: errorData };
    }
    // Return fetched data
    
  } catch (error) {
    console.error("An error occurred:", error.message);
    return [];
  }
};

export const orderUpdateTopic = async (order) => {
  try {
    const config = useRuntimeConfig();

    // เรียก fetch เพื่ออัปเดตลำดับและระดับ
    const response = await fetch(`${config.public.baseURL}/api/course/order-topic`, {
      method: 'PUT', // ใช้เมธอด PUT
      headers: {
        'Content-Type': 'application/json', // กำหนดประเภทเนื้อหาเป็น JSON
      },
      body: JSON.stringify(order), // แปลง order เป็น JSON string
    });

    // ตรวจสอบผลลัพธ์
    if (response.ok) {
      const data = await response.json(); // แปลงข้อมูลเป็น JSON
      return { success: true, message: data.message }; // ส่งข้อมูลกลับเมื่อสำเร็จ
    } else {
      const errorData = await response.json(); // แปลงข้อผิดพลาดเป็น JSON
      return { success: false, error: errorData }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
    }
  } catch (error) {
    return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
  }
};


export const deleteTopicCourse = async (topicId) => {
  try {
    const config = useRuntimeConfig();

    // Log เพื่อเช็คว่า topicId ถูกต้อง
    console.log("Deleting topic with ID:", topicId);

    // ทำการ request แบบ DELETE เพื่อทำการลบหัวข้อ
    const response = await fetch(
      `${config.public.baseURL}/api/course/delete-topic-course/${topicId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const data = await response.json(); // แปลงข้อมูลเป็น JSON
      return { success: true, message: data.message }; // ส่งข้อมูลกลับเมื่อสำเร็จ
    } else {
      const errorData = await response.json(); // แปลงข้อผิดพลาดเป็น JSON
      return { success: false, error: errorData }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
    }

  } catch (error) {
    return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
  }
};




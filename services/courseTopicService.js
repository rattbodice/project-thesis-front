

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


export const getAllTopicInCourse = async (courseId) => {
  try {
    const config = useRuntimeConfig();
    
    // Log to ensure courseId is correct
    console.log("Fetching topics for courseId:", courseId);
    
    // Perform fetch request
    const response = await fetch(
      `${config.public.baseURL}/api/course/getAllTopicCourse?courseId=${courseId}`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', // อาจจะมีหรือไม่มีก็ได้ แต่จะดีถ้าระบุ
        }
      }
    );

    if (response.ok){
      const data = await response.json();
      console.log("หัวข้อของคอร์สถูกสร้าง:", data);
      return { success: true, data };
    } else{
      const errorData = await response.json();
      console.error("เกิดข้อผิดพลาดในการเรียกหัวข้อของคอร์ส:", errorData);
      return { success: false, error: errorData };
    }
    // Return fetched data
    
  } catch (error) {
    console.error("An error occurred:", error.message);
    return [];
  }
};



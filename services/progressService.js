export const updateProgressVideoUser = async (data) => {
  try {
    const config = useRuntimeConfig();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !data.user_id ||
      !data.subtopic_id ||
      data.last_watched_time < 0 ||
      typeof data.is_finished !== "boolean"
    ) {
      throw new Error(
        "Invalid data: user_id, subtopic_id, last_watched_time, and is_finished are required."
      );
    }

    const response = await fetch(
      `${config.public.baseURL}/api/progressVideo/user-video-progress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // ส่งข้อมูลที่ได้รับกลับ
  } catch (error) {
    console.error("Error creating video progress:", error);
    throw error; // ยกข้อผิดพลาดเพื่อให้สามารถจัดการต่อไป
  }
};

export const getProgressVideoUser = async (userId, subtopicId) => {
  try {
    const config = useRuntimeConfig();

    // ใช้ URL ที่มี userId และ subtopicId
    const response = await fetch(
      `${config.public.baseURL}/api/progressVideo/get-video-progress/${userId}/${subtopicId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // ส่งข้อมูลที่ได้รับกลับ
  } catch (error) {
    console.error("Error fetching video progress:", error);
    throw error; // ยกข้อผิดพลาดเพื่อให้สามารถจัดการต่อไป
  }
};

export const checkProgressSubtopic = async (userId, subtopicId) => {
  try {
    const config = useRuntimeConfig();

    // ใช้ URL ที่มี userId และ subtopicId
    const response = await fetch(
      `${config.public.baseURL}/api/users/checkProgressSubtopic/${userId}/${subtopicId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // ส่งข้อมูลที่ได้รับกลับ
  } catch (error) {
    console.error("Error fetching video progress:", error);
    throw error; // ยกข้อผิดพลาดเพื่อให้สามารถจัดการต่อไป
  }
};

export const checkProgressTopic = async (userId, subtopicId) => {
  try {
    const config = useRuntimeConfig();

    // ใช้ URL ที่มี userId และ subtopicId
    const response = await fetch(
      `${config.public.baseURL}/api/users/checkProgressTopic/${userId}/${subtopicId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // ส่งข้อมูลที่ได้รับกลับ
  } catch (error) {
    console.error("Error fetching video progress:", error);
    throw error; // ยกข้อผิดพลาดเพื่อให้สามารถจัดการต่อไป
  }
};

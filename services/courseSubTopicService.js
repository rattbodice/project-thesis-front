export const createSubTopic = async (formData) => {
    try {
      const config = useRuntimeConfig(); // ดึงค่าการตั้งค่า runtimeConfig
      
      // Log เพื่อตรวจสอบข้อมูลที่กำลังจะถูกส่ง
      console.log("Creating SubTopic with data:", formData);
      
      // เรียก fetch request เพื่อสร้าง SubTopic
      const response = await fetch(
        `${config.public.baseURL}/api/course/create-subtopic`,
        {
          method: "POST",
          headers: {
            // ไม่ระบุ Content-Type เพราะ formData จะตั้งค่าให้โดยอัตโนมัติ
          },
          body: formData, // ส่ง formData ที่ประกอบไปด้วย title, description และไฟล์วิดีโอ
        }
      );
  
      // ตรวจสอบผลลัพธ์
      if (response.ok) {
        const data = await response.json();
        console.log("SubTopic ถูกสร้างสำเร็จ:", data);
        return { success: true, data }; // ส่งข้อมูลกลับเมื่อสำเร็จ
      } else {
        const errorData = await response.json();
        console.error("เกิดข้อผิดพลาดในการสร้าง SubTopic:", errorData);
        return { success: false, error: errorData }; // ส่งข้อผิดพลาดกลับเมื่อไม่สำเร็จ
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // ส่งข้อผิดพลาดกลับ
    }
  };
  
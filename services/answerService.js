export const createAnswers = async (formData) => {
    try {
      const config = useRuntimeConfig(); // ดึงข้อมูลจาก runtimeConfig settings
  
      // Log เพื่อเช็คข้อมูลที่ถูกส่ง
      console.log("Creating answers with data:", formData);
  
      // ส่ง request เพื่อสร้างคำตอบ
      const response = await fetch(
        `${config.public.baseURL}/api/answer/create-answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // ส่งคำตอบในรูปแบบ JSON
        }
      );
  
      // ตรวจสอบผลลัพธ์
      if (response.ok) {
        const data = await response.json();
        console.log("Answers created successfully:", data);
        return { success: true, data }; // ส่งคืนข้อมูลเมื่อสำเร็จ
      } else {
        const errorData = await response.json();
        console.error("Error creating answers:", errorData);
        return { success: false, error: errorData }; // ส่งคืนข้อผิดพลาดเมื่อไม่สำเร็จ
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // ส่งคืนข้อผิดพลาดในกรณีเกิด exception
    }
  };
  
  export const getAnswerByQuestion = async (userId, questionId) => {
    try {
      const config = useRuntimeConfig(); // ดึงข้อมูลจาก runtimeConfig settings
  
      // Log เพื่อเช็ค userId และ questionId ที่ถูกส่ง
      console.log(`Fetching answer for userId: ${userId}, questionId: ${questionId}`);
  
      // ส่ง request เพื่อดึงคำตอบ
      const response = await fetch(
        `${config.public.baseURL}/api/answer/getAnswerByQuestion?user_id=${userId}&question_id=${questionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // ตรวจสอบผลลัพธ์
      if (response.ok) {
        const data = await response.json();
        console.log("Answer fetched successfully:", data);
        return { success: true, data }; // ส่งคืนข้อมูลเมื่อสำเร็จ
      } else {
        const errorData = await response.json();
        console.error("Error fetching answer:", errorData);
        return { success: false, error: errorData }; // ส่งคืนข้อผิดพลาดเมื่อไม่สำเร็จ
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // ส่งคืนข้อผิดพลาดในกรณีเกิด exception
    }
  };
  
  export const submitAnswer = async (answerData) => {
    try {
      const config = useRuntimeConfig(); // Retrieve runtime config settings
      console.log(answerData)
      // ทำ request ไปยัง backend เพื่อบันทึกคำตอบ
      const response = await fetch(`${config.public.baseURL}/api/answer/create-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData),
      });
  
      // ตรวจสอบผลลัพธ์
      if (response.ok) {
        const data = await response.json();
        console.log('Answer submitted successfully:', data);
        return { success: true, data }; // ส่งกลับผลลัพธ์สำเร็จ
      } else {
        const errorData = await response.json();
        console.error('Error submitting answer:', errorData);
        return { success: false, error: errorData }; // ส่งกลับข้อผิดพลาด
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      return { success: false, error: error.message }; // ส่งกลับข้อผิดพลาดกรณีมีข้อยกเว้น
    }
  };
export const createCourse = async (courseName, courseDescription,userId, imageFile,level, baseURL) => {
    try {
      // สร้าง formData เพื่อส่งข้อมูลแบบ multipart/form-data
      console.log("level is "+level)
      const formData = new FormData();
      formData.append("title", courseName);
      formData.append("description", courseDescription);
      formData.append("level", parseInt(level));
      formData.append("created_by",userId);
      if (imageFile) {
        formData.append("image", imageFile); // ไม่ต้องตั้งค่า Content-Type
      }

      const response = await fetch(`${baseURL}/api/course/create-course`, {
        method: "POST",
        body: formData,
      });
      // ตรวจสอบสถานะของ response
      if (response.ok) {
        const data = await response.json();
        console.log("คอร์สถูกสร้างสำเร็จ:", data);
        return { success: true, data };
      } else {
        const errorData = await response.json();
        console.error("เกิดข้อผิดพลาดในการสร้างคอร์ส:", errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์:", error);
      return { success: false, error };
    }
  };
  
  export const getCourseById = async (courseId) => {
    try {
      const config = useRuntimeConfig();
      const response = await fetch(
        `${config.public.baseURL}/api/course/getCourseById?courseId=${courseId}`,
        {
          method: "GET",
        }
      );
  
      if (response.ok){
        const data = await response.json();
        return { success: true, data };
      } else{
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.log(error)
    }
  }

  export const fetchAllCourses = async (baseURL) => {
    try {
      const response = await fetch(`${baseURL}/api/course/getAllCourses`, {
        method: "GET", // เปลี่ยนจาก POST เป็น GET
        headers: {
          'Content-Type': 'application/json', // อาจจะมีหรือไม่มีก็ได้ แต่จะดีถ้าระบุ
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("ดึงข้อมูลคอร์สสำเร็จ:", data);
        return { success: true, data };
      } else {
        const errorData = await response.json();
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคอร์ส:", errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์:", error);
      return { success: false, error };
    }
  };

  export const deleteCourseById = async (courseId) =>{
    try {
      const config = useRuntimeConfig();
      const response = await fetch(`${config.public.baseURL}/api/course/deleteCourseById?courseId=${courseId}`,{
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json();
        console.log("Course deleted successfully:", data);
        return { success: true, data };
      } else {
        // Handle server error
        const errorData = await response.json();
        console.error("Error deleting course:", errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      // Handle client-side error
      console.error("An error occurred while deleting the course:", error);
      return { success: false, error: error.message };
    }
  }
  
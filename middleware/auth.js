export default defineNuxtRouteMiddleware((to, from) => {
  // ตรวจสอบว่าทำงานบน client-side เท่านั้น
  if (process.client) {
    // ตรวจสอบว่า token อยู่ใน localStorage หรือไม่
    const token = localStorage.getItem('token');

    if (!token) {
      return navigateTo('/login'); // ถ้าไม่มี token ให้ไปที่หน้า login
    }

    // Optional: เช็คข้อมูลภายใน token หรือส่ง token ไปตรวจสอบที่ backend
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('User info from token:', decodedToken);
    } catch (error) {
      console.error('Invalid token format');
      return navigateTo('/login');
    }
  }
});

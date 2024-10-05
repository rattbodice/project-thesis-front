import jwt_decode from 'jwt-decode';

export default defineNuxtRouteMiddleware((to, from) => {
  // ตรวจสอบว่าทำงานบน client-side เท่านั้น
  if (process.client) {
    // ตรวจสอบว่า token อยู่ใน localStorage หรือไม่
    const token = localStorage.getItem('token');

    if (!token) {
      return navigateTo('/login'); // ถ้าไม่มี token ให้ไปที่หน้า login
    }

    // Decode JWT token และตรวจสอบข้อมูลภายใน
    try {
      const decodedToken = jwt_decode(token);
      console.log('User info from token:', decodedToken);

      // ตรวจสอบว่า token หมดอายุหรือไม่ (exp เป็นเวลาในหน่วยวินาที)
      const currentTime = Math.floor(Date.now() / 1000); // เวลาปัจจุบันในหน่วยวินาที
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.log('Token expired');
        localStorage.removeItem('token'); // ลบ token ที่หมดอายุออกจาก localStorage
        return navigateTo('/login');
      }

    } catch (error) {
      console.error('Invalid token format or decoding error');
      return navigateTo('/login');
    }
  }
});

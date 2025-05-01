import { io } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const socket = io('http://localhost:8001') // ใส่ URL จริงของ backend ที่ใช้

  // เพิ่ม socket เข้า context
  nuxtApp.provide('socket', socket)
})

const { verifyToken } = require('../../my-elearning-app/middleware/auth');

router.get('/profile', verifyToken, (req, res) => {
  // ข้อมูลผู้ใช้จะถูกดึงจาก req.user
  res.json({ message: 'Profile data', user: req.user });
});



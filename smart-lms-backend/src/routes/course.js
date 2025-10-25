// routes/course.js
const router = require('express').Router();
router.get('/', async (req, res) => { ... }); // lấy danh sách khóa học
router.post('/', async (req, res) => { ... }); // thêm mới
router.get('/:id/materials', async (req, res) => { ... }); // lấy materials
module.exports = router;

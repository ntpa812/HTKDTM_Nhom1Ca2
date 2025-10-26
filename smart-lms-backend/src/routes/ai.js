// routes/ai.js
const router = require('express').Router();
router.post('/recommend', async (req, res) => {
  // Nhận thông tin user, điểm số, history và trả về suggestion giả lập
  res.json([
    { id: 2, title: 'Python nâng cao', match: 88 },
    { id: 3, title: 'Deep Learning', match: 85 }
  ]);
});
module.exports = router;

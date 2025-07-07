const express = require('express');
const router = express.Router();
const {
    getMyList,
    toggleMyList,
    updateWatchHistory
} = require('../controllers/userStateController');
const { protect } = require('../middleware/authMiddleware');

// Toutes les routes sont protégées
router.use(protect);

// Routes pour "Ma Liste"
router.route('/:profileId/mylist')
    .get(getMyList)      // GET /api/state/42/mylist
    .post(toggleMyList); // POST /api/state/42/mylist (avec { contentId: 1 })

// Route pour l'historique
router.post('/:profileId/watch', updateWatchHistory); // POST /api/state/42/watch

module.exports = router;
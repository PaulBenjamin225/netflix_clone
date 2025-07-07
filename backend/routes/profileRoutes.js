const express = require('express');
const router = express.Router();
const {
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Toutes les routes de ce fichier sont protégées
router.use(protect);

router.route('/')
    .get(getProfiles)       // GET /api/profiles
    .post(createProfile);   // POST /api/profiles

router.route('/:id')
    .put(updateProfile)     // PUT /api/profiles/123
    .delete(deleteProfile); // DELETE /api/profiles/123

module.exports = router;
const express = require('express');
const router = express.Router();
const { getBrowseContent, getSingleContent, getSeriesContent, getMoviesContent } = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');


router.get('/browse', protect, getBrowseContent);
router.get('/series', protect, getSeriesContent);
router.get('/movies', protect, getMoviesContent);
router.get('/:id', protect, getSingleContent);

module.exports = router;
// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getSubscriptionPlans, // <-- La fonction doit être importée
    initiatePayment,
    paymentWebhook 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// LA ROUTE QUI MANQUE EST PROBABLEMENT CELLE-CI
router.get('/plans', getSubscriptionPlans); // <-- La route doit être définie avec GET

router.post('/initiate-payment', protect, initiatePayment);
router.post('/webhook', paymentWebhook);

module.exports = router;
// backend/controllers/paymentController.js (Nouvelle Version avec Axios)

const axios = require('axios'); // On utilise axios pour les requêtes HTTP
const pool = require('../config/db');

// URL de l'API de CinetPay
const CINETPAY_API_URL = 'https://api-checkout.cinetpay.com/v2/payment';

// Vos clés depuis le fichier .env
const API_KEY = process.env.CINETPAY_API_KEY;
const SITE_ID = process.env.CINETPAY_SITE_ID;

/**
 * @desc    Obtenir la liste des plans d'abonnement
 */
exports.getSubscriptionPlans = async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT id, name, price, quality, screens FROM subscription_plans');
        res.json(plans);
    } catch (error) {
        console.error('Erreur lors de la récupération des plans:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * @desc    Initier une transaction de paiement avec CinetPay via une requête API directe
 */
exports.initiatePayment = async (req, res) => {
    const { planId } = req.body;
    const { id: userId, email: userEmail } = req.user;

    try {
        const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
        if (plans.length === 0) {
            return res.status(404).json({ message: "Plan non trouvé." });
        }
        const plan = plans[0];

        const transaction_id = `NETFLIX-${userId}-${Date.now()}`;

        // Préparer le corps de la requête pour CinetPay
        const paymentData = {
            apikey: API_KEY,
            site_id: SITE_ID,
            transaction_id: transaction_id,
            amount: plan.price,
            currency: 'XOF',
            description: `Abonnement Netflix Clone - Plan ${plan.name}`,
            customer_id: userId,
            customer_name: `User ${userId}`,
            customer_surname: '',
            customer_email: userEmail,
            return_url: `${process.env.CLIENT_URL}/payment-status`,
            notify_url: 'URL_PUBLIQUE_DE_VOTRE_WEBHOOK', // Utilisez Ngrok pour les tests
            metadata: JSON.stringify({ userId: userId, planId: planId })
        };

        // Faire l'appel API à CinetPay avec axios
        const response = await axios.post(CINETPAY_API_URL, paymentData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.code === '201') {
            res.json({ payment_url: response.data.data.payment_url });
        } else {
            console.error("Erreur CinetPay:", response.data.message);
            res.status(400).json({ message: response.data.message || "Impossible d'initier le paiement." });
        }

    } catch (error) {
        console.error('Erreur serveur lors de l\'initiation du paiement:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

/**
 * @desc    Webhook pour gérer les notifications de CinetPay
 */
exports.paymentWebhook = async (req, res) => {
    // Cette fonction reste complexe car elle doit revérifier le statut
    // Pour l'instant, nous la laissons vide pour nous concentrer sur le démarrage.
    // Nous la compléterons plus tard.
    console.log("Webhook CinetPay reçu:", req.body);
    // Le code pour vérifier le statut de la transaction (comme avant) viendra ici.
    res.status(200).send("OK");
};
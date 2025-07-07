const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    // Le token est envoyé dans l'en-tête "Authorization" sous la forme "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Extraire le token
            token = req.headers.authorization.split(' ')[1];

            // 2. Vérifier le token avec notre clé secrète
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Récupérer l'utilisateur depuis la DB sans le mot de passe
            // et l'attacher à l'objet `req` pour qu'il soit disponible dans les routes protégées
            const [users] = await pool.query('SELECT id, email, subscription_plan_id FROM users WHERE id = ?', [decoded.id]);
            
            if (users.length === 0) {
                return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé' });
            }

            req.user = users[0];
            next(); // Passer au prochain middleware/contrôleur

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, pas de token' });
    }
};

module.exports = { protect };
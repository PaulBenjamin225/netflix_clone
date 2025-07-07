const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez entrer tous les champs' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer l'utilisateur
        const [result] = await pool.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        const userId = result.insertId;
        
        // Créer un profil par défaut "Utilisateur"
        await pool.query(
            'INSERT INTO profiles (user_id, name) VALUES (?, ?)',
            [userId, 'Utilisateur']
        );


        // Créer un token JWT
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: { id: userId, email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier l'email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            message: 'Connexion réussie',
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
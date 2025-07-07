const pool = require('../config/db');

// @desc    Obtenir tous les profils de l'utilisateur connecté
// @route   GET /api/profiles
// @access  Private
exports.getProfiles = async (req, res) => {
    try {
        const [profiles] = await pool.query(
            'SELECT id, name, avatar_url, is_kid FROM profiles WHERE user_id = ?',
            [req.user.id] // req.user.id est fourni par le middleware `protect`
        );
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Créer un nouveau profil
// @route   POST /api/profiles
// @access  Private
exports.createProfile = async (req, res) => {
    const { name, avatar_url, is_kid } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Le nom du profil est requis' });
    }

    try {
        // Netflix a une limite de 5 profils par compte
        const [existingProfiles] = await pool.query('SELECT COUNT(*) as count FROM profiles WHERE user_id = ?', [userId]);
        if (existingProfiles[0].count >= 5) {
            return res.status(400).json({ message: 'Limite de 5 profils atteinte' });
        }

        const [result] = await pool.query(
            'INSERT INTO profiles (user_id, name, avatar_url, is_kid) VALUES (?, ?, ?, ?)',
            [userId, name, avatar_url, is_kid || false]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            avatar_url,
            is_kid: is_kid || false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Modifier un profil
// @route   PUT /api/profiles/:id
// @access  Private
exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { name, avatar_url, is_kid } = req.body;
    const userId = req.user.id;

    try {
        // Vérifier que le profil appartient bien à l'utilisateur connecté
        const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ? AND user_id = ?', [id, userId]);
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profil non trouvé ou non autorisé' });
        }

        // Construire la requête de mise à jour dynamiquement
        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (avatar_url) fieldsToUpdate.avatar_url = avatar_url;
        if (is_kid !== undefined) fieldsToUpdate.is_kid = is_kid;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: 'Aucun champ à mettre à jour' });
        }
        
        await pool.query('UPDATE profiles SET ? WHERE id = ?', [fieldsToUpdate, id]);

        res.json({ message: 'Profil mis à jour avec succès' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// @desc    Supprimer un profil
// @route   DELETE /api/profiles/:id
// @access  Private
exports.deleteProfile = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Vérifier que le profil appartient bien à l'utilisateur connecté
        const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ? AND user_id = ?', [id, userId]);
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profil non trouvé ou non autorisé' });
        }
        
        // Bonus : ne pas autoriser la suppression du dernier profil
        const [allProfiles] = await pool.query('SELECT COUNT(*) as count FROM profiles WHERE user_id = ?', [userId]);
        if (allProfiles[0].count <= 1) {
            return res.status(400).json({ message: 'Impossible de supprimer le dernier profil' });
        }

        await pool.query('DELETE FROM profiles WHERE id = ?', [id]);

        res.json({ message: 'Profil supprimé avec succès' });

    } catch (error) {
        // Si la suppression échoue à cause de clés étrangères (ex: my_list), 
        // c'est que la suppression en cascade fonctionne bien.
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
const pool = require('../config/db');

// --- MA LISTE ---

// @desc    Obtenir "Ma Liste" pour un profil
// @route   GET /api/state/:profileId/mylist
// @access  Private
exports.getMyList = async (req, res) => {
    const { profileId } = req.params;

    try {
        // Sécurité : Vérifier que le profil appartient bien à l'utilisateur connecté
        const [profiles] = await pool.query('SELECT id FROM profiles WHERE id = ? AND user_id = ?', [profileId, req.user.id]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'Accès non autorisé à ce profil' });
        }

        const query = `
            SELECT c.* FROM contents c
            JOIN my_list ml ON c.id = ml.content_id
            WHERE ml.profile_id = ?
        `;
        const [myList] = await pool.query(query, [profileId]);
        res.json(myList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Ajouter/Retirer un contenu de "Ma Liste"
// @route   POST /api/state/:profileId/mylist
// @access  Private
exports.toggleMyList = async (req, res) => {
    const { profileId } = req.params;
    const { contentId } = req.body;

    if (!contentId) {
        return res.status(400).json({ message: 'contentId est requis' });
    }

    try {
        // Sécurité : Vérifier l'appartenance du profil
        const [profiles] = await pool.query('SELECT id FROM profiles WHERE id = ? AND user_id = ?', [profileId, req.user.id]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        
        // Vérifier si le contenu existe déjà dans la liste
        const [existing] = await pool.query('SELECT * FROM my_list WHERE profile_id = ? AND content_id = ?', [profileId, contentId]);
        
        if (existing.length > 0) {
            // Le contenu est dans la liste, on le retire
            await pool.query('DELETE FROM my_list WHERE profile_id = ? AND content_id = ?', [profileId, contentId]);
            res.json({ message: 'Contenu retiré de Ma Liste', inList: false });
        } else {
            // Le contenu n'est pas dans la liste, on l'ajoute
            await pool.query('INSERT INTO my_list (profile_id, content_id) VALUES (?, ?)', [profileId, contentId]);
            res.json({ message: 'Contenu ajouté à Ma Liste', inList: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// --- HISTORIQUE DE VISIONNAGE ---

// @desc    Mettre à jour la progression de visionnage
// @route   POST /api/state/:profileId/watch
// @access  Private
exports.updateWatchHistory = async (req, res) => {
    const { profileId } = req.params;
    // contentId pour un film, episodeId pour une série
    const { contentId, episodeId, progressSeconds } = req.body;

    if ((!contentId && !episodeId) || progressSeconds === undefined) {
        return res.status(400).json({ message: 'contentId ou episodeId et progressSeconds sont requis' });
    }
    
    try {
        // Sécurité : Vérifier l'appartenance du profil
        const [profiles] = await pool.query('SELECT id FROM profiles WHERE id = ? AND user_id = ?', [profileId, req.user.id]);
        if (profiles.length === 0) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        
        // Utilisation de INSERT ... ON DUPLICATE KEY UPDATE pour créer ou mettre à jour la ligne
        const query = `
            INSERT INTO viewing_history (profile_id, content_id, episode_id, progress_seconds)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE progress_seconds = VALUES(progress_seconds), last_watched_at = CURRENT_TIMESTAMP
        `;

        await pool.query(query, [profileId, contentId || null, episodeId || null, progressSeconds]);
        
        res.json({ message: 'Progression sauvegardée' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Obtenir la section "Continuer à regarder"
// @route   GET /api/state/:profileId/history
// @access  Private
exports.getContinueWatching = async(req, res) => {
    // Cette query est plus complexe, elle doit joindre plusieurs tables
    // pour récupérer les détails du contenu à partir de l'historique
    // A implémenter plus tard pour rester concis ici.
    res.json({ message: "Endpoint pour 'Continuer à regarder' à implémenter."});
}
const pool = require('../config/db');

// @desc    Obtenir les contenus pour la page d'accueil, groupés par genre
// @route   GET /api/content/browse
// @access  Private
exports.getBrowseContent = async (req, res) => {
    try {
        // 1. Récupérer tous les genres
        const [genres] = await pool.query('SELECT * FROM genres');

        // 2. Pour chaque genre, récupérer une liste de contenus associés (ex: les 10 premiers)
        const contentByGenrePromises = genres.map(genre => {
            const query = `
                SELECT c.*
                FROM contents c
                JOIN content_genres cg ON c.id = cg.content_id
                WHERE cg.genre_id = ?
                LIMIT 10
            `;
            return pool.query(query, [genre.id]);
        });
        
        const results = await Promise.all(contentByGenrePromises);

        // 3. Formater la réponse pour qu'elle ressemble à l'UI de Netflix
        // [{ title: "Action", contents: [...] }, { title: "Comédie", contents: [...] }]
        const browseData = genres.map((genre, index) => ({
            genre: genre.name,
            contents: results[index][0] // results[index] est [rows, fields], on veut rows
        }));

        res.json(browseData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// @desc    Obtenir les détails d'un contenu spécifique (film ou série)
// @route   GET /api/content/:id
// @access  Private
exports.getSingleContent = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Récupérer les informations de base du contenu
        const [contentRows] = await pool.query('SELECT * FROM contents WHERE id = ?', [id]);
        if (contentRows.length === 0) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }
        const content = contentRows[0];

        // 2. Si c'est une série, récupérer les saisons et les épisodes
        if (content.content_type === 'series') {
            const [seasons] = await pool.query('SELECT * FROM seasons WHERE series_id = ? ORDER BY season_number ASC', [id]);
            
            if (seasons.length > 0) {
                const seasonIds = seasons.map(s => s.id);
                const [episodes] = await pool.query(
                    'SELECT * FROM episodes WHERE season_id IN (?) ORDER BY season_id, episode_number ASC', 
                    [seasonIds]
                );

                // Attacher les épisodes à leurs saisons respectives
                content.seasons = seasons.map(season => ({
                    ...season,
                    episodes: episodes.filter(ep => ep.season_id === season.id)
                }));
            } else {
                content.seasons = [];
            }
        }

        res.json(content);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * @desc    Obtenir UNIQUEMENT les séries pour la page "Séries", groupées par genre
 * @route   GET /api/content/series
 * @access  Private
 */
exports.getSeriesContent = async (req, res) => {
    try {
        // 1. On récupère d'abord TOUTES les séries
        const [allSeries] = await pool.query(
            "SELECT * FROM contents WHERE content_type = 'series'"
        );

        if (allSeries.length === 0) {
            return res.json([]); // Si pas de séries du tout, on renvoie un tableau vide
        }

        // 2. On récupère tous les genres
        const [allGenres] = await pool.query('SELECT * FROM genres');

        // 3. On récupère toutes les liaisons contenu-genre
        const [allContentGenres] = await pool.query('SELECT * FROM content_genres');

        // 4. On construit le résultat manuellement en JavaScript (plus fiable que du SQL complexe)
        const seriesByGenre = allGenres.map(genre => {
            // Pour ce genre, on trouve les ID des contenus qui lui sont associés
            const contentIdsForThisGenre = allContentGenres
                .filter(cg => cg.genre_id === genre.id)
                .map(cg => cg.content_id);

            // Parmi toutes les séries, on ne garde que celles qui sont dans ce genre
            const seriesForThisGenre = allSeries.filter(series => 
                contentIdsForThisGenre.includes(series.id)
            );

            return {
                genre: genre.name,
                contents: seriesForThisGenre
            };
        }).filter(row => row.contents.length > 0); // On ne garde que les genres qui ont au moins une série

        res.json(seriesByGenre);

    } catch (error) {
        console.error("Erreur dans getSeriesContent:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * @desc    Obtenir UNIQUEMENT les films pour la page "Films", groupés par genre
 * @route   GET /api/content/movies
 * @access  Private
 */
exports.getMoviesContent = async (req, res) => {
    try {
        // On utilise la même logique que pour les séries, mais en filtrant sur 'movie'
        const [allMovies] = await pool.query(
            "SELECT * FROM contents WHERE content_type = 'movie'"
        );

        if (allMovies.length === 0) {
            return res.json([]);
        }

        const [allGenres] = await pool.query('SELECT * FROM genres');
        const [allContentGenres] = await pool.query('SELECT * FROM content_genres');

        const moviesByGenre = allGenres.map(genre => {
            const contentIdsForThisGenre = allContentGenres
                .filter(cg => cg.genre_id === genre.id)
                .map(cg => cg.content_id);

            const moviesForThisGenre = allMovies.filter(movie => 
                contentIdsForThisGenre.includes(movie.id)
            );

            return {
                genre: genre.name,
                contents: moviesForThisGenre
            };
        }).filter(row => row.contents.length > 0);

        res.json(moviesByGenre);

    } catch (error) {
        console.error("Erreur dans getMoviesContent:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
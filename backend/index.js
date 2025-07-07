const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userStateRoutes = require('./routes/userStateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
    'http://localhost:5173', // frontend en local
    'https://netflix-clone-khyp.onrender.com' // L'URL du site sur Render
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


app.use(express.json());

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/state', userStateRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
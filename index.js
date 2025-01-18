const express = require('express');
const nodemailer = require('nodemailer');
const moviesController = require('./controllers/moviesController');
require('dotenv').config();
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors'); // Import the cors package

// Vérification des variables d'environnement essentielles
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'PORT'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Erreur : La variable d'environnement ${varName} n'est pas définie.`);
        process.exit(1); // Arrête l'application si une variable essentielle est manquante
    }
});

// Création de l'application Express
const app = express();
const port = process.env.PORT || 8080;

// Middleware pour parser le JSON
app.use(express.json());

// Configure CORS to allow requests from http://localhost:3000
const corsOptions = {
    origin: [
        'http://localhost:3000',       // Accès direct (dev)
        'http://localhost:8081',       // Accès direct (dev)
        'http://tanguy-domergue.fr/portfolio',  // Via le reverse proxy (prod)
        'http://tanguy-domergue.fr/movies'     // Via le reverse proxy (prod)
      ],
       // Liste des origines autorisées
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false, // Utilisez true pour le port 465, false pour les autres ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Vérification de la connexion SMTP
const verifySMTPConnection = async () => {
    try {
        await transporter.verify();
        console.log('Le serveur SMTP est prêt à envoyer des messages');
    } catch (error) {
        console.error('Erreur de connexion au serveur SMTP :', error.message);
        process.exit(1); // Arrête l'application en cas d'échec de la connexion SMTP
    }
};
verifySMTPConnection();

// Fonction pour envoyer un e-mail
const sendEmail = async (name, senderEmail, message) => {
    const recipientEmail = 'tanguy.professionnel@outlook.fr';

    const mailOptions = {
        from: `"${name}" <${recipientEmail}>`, // Expéditeur
        to: recipientEmail, // Destinataire
        subject: `Nouveau message de ${name}`,
        text: `${message}\n\nContact : ${senderEmail}`,
    };

    try {
        await transporter.sendMail(mailOptions); // Envoi de l'e-mail
        return 'Message envoyé avec succès';
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        throw new Error("Échec de l'envoi de l'e-mail");
    }
};

// Route pour envoyer un e-mail
app.post('/email/sendEmail', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Veuillez fournir le nom, l\'e-mail et le message' });
    }

    try {
        const response = await sendEmail(name, email, message);
        res.status(200).json({ success: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes des films
app.use('/movies', moviesController);

// Documentation Swagger
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Gestion des erreurs pour les routes non définies
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    console.log(`Documentation Swagger disponible sur http://localhost:${port}/api-docs`);
});

app.options('*', cors(corsOptions));


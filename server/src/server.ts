import express from 'express';
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import './models/index.js'; // Import all models to sync them

// import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get('/test', (_req, res) => {
    console.log('Test route hit');
    res.send('Test route hit');
});

// app.use('/api/test/me', authMiddleware, (_req, res) => {
//     console.log('Test route hit');
//     res.send('Test route hit');
// });


app.use((req, _res, next) => {
    console.log(`Request: ${req.method} ${req.path}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    next();
})

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
    })
    .catch((err: unknown) => console.error('Error syncing database:', err));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
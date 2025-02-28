import express from 'express';
import { connectToDb, applySchema, resetDatabase } from './db/connection.js';
import routes from './routes/index.js';

await connectToDb();
await applySchema();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Route to reset the database
app.post('/reset-database', async (_req, res) => {
    await resetDatabase();
    res.json({ message: 'Database reset successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
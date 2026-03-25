import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import router from '../backend/routes/auth.js'
import data from './routes/auth.js'


dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json())
app.get('/', (req,res) => {
    res.json(data);
})

app.use('/', router)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

export default router;
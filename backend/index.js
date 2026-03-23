import express from 'express';
import dotenv from "dotenv";
import router from '../backend/routes/auth.js'
// const router = express.Router();

dotenv.config();
const app = express();

app.use(express.json())
// app.get('/', (req,res) => {
//     res.send("Hello World!");
// })

app.use('/', router)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


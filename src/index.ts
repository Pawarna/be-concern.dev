import express, {Express, Request, Response} from 'express';
import cors from 'cors'
import router from './routes'
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})

app.use('/api', router)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
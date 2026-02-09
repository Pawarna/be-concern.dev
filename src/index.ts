import express, {Express, Request, Response} from 'express';
import cors from 'cors'
import path from 'node:path';
import router from './routes'
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', router)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

import dotenv from 'dotenv';
import https from 'https';
import path from 'path';
import express from "express";

dotenv.config();
const app = express();
const __dirname = path.resolve();
const publicDir = path.join(__dirname, 'src/public')

const apiKey = process.env.UNSPLASH_API_KEY;

let count = 10;
let initialLoad = true;

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

app.get('/api', async (req, res) => {
    const options = {
        hostname: 'api.unsplash.com',
        path: `/photos/random?count=${count}&client_id=${apiKey}`
    }
    if (initialLoad) {
        initialLoad = false;
        count = 30;
    }

    let body = '';
    https.get(options, (response) => {
        try {
            if (response.statusCode !== 200) {
                throw new Error('Error fetching images!');
            }
            response.on('data', chunk => {
                body += chunk;
            })
            response.on('end', () => {
                res.json(body);
            })
        }
        catch (e) {
            res.status(500).json({err: e.message});
        }

    })

})

app.listen(process.env.PORT || 3000);

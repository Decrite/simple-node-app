import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app: Express = express();
const port = 3001;



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(session({ resave: true, secret: 'SECRET', saveUninitialized: true }));



app.get('/stream_game', async (req: Request, res: Response) => {

  res.send({ start: 'ok' });
});

app.get('/end_stream_game', async (_req: Request, res: Response) => {
  res.send({ end: 'ok' });
});

app.get('/move', async (req: Request, res: Response) => {

  res.send("");
});

app.get('/challenge_ai', async (req: Request, res: Response) => {
  res.send("");
});

app.get('/event', async (_req: Request, res: Response) => {
  res.send('Start');
});

app.get('/end_stream_event', async (_req: Request, res: Response) => {
  res.send({ end: 'ok' });
});



app.get('/', (_req: Request, res: Response) => {
  res.send(`ApiKey:`);
});

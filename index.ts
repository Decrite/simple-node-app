import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import { Picture } from './src/types';

dotenv.config();


const app: Express = express();

let pictures: Picture[] = [];

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

// Example usage:
const randomString = generateRandomString(10); // Generates a random string of length 10
console.log(randomString);


app.listen();

app.use(session({ resave: true, secret: 'SECRET', saveUninitialized: true }));

app.use(express.json());

app.delete('/deletePicture/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  pictures = pictures.filter(picture => picture.id !== id);
  res.send("Picture deleted successfully.");
});

app.get('/getPictures', (_req: Request, res: Response) => {
  res.json(pictures);
});

app.post('/setPicture', (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data ) {
    res.status(400).send("Bad request: 'data' and 'id' fields are required.");
    return;
  }
  const picture: Picture = { data, id: generateRandomString(10) };
  pictures.push(picture);
  res.send({ message: 'Picture added successfully.' });
});

app.get('/', (_req: Request, res: Response) => {
  res.send(`ApiKey:`);
});

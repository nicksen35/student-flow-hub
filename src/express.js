import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { access } from 'fs';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/save-token', (req, res) => {
  const accessToken = req.body.accessToken;
  if (!accessToken) {
    return res.status(400).send({ error: 'Access token is required' });
  }
  // TODO: Save the access token to the database
  res.status(200).send({ message: accessToken });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
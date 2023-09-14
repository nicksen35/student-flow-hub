import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { gapi } from 'gapi-script'


const app = express();
app.use(cors({ origin: 'http://localhost:5173'}));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

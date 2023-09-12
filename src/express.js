import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios'

let accessToken = '';

const app = express();
app.use(cors({ origin: 'http://localhost:5173'}));
app.use(bodyParser.json());


app.post('/api/save-token', (req, res) => {
  accessToken = req.body.accessToken;
  if (!accessToken) {
    return res.status(400).send({ error: 'Access token is required' });
  }
  // TODO: Save the access token to the database
  res.status(200).send({ message: accessToken });
});

app.post('/api/drive-files', (req, res) => {
  console.log("hello")
  // Use the access token from the request object to make an authenticated request to the Drive API
    axios.get('https://www.googleapis.com/drive/v3/files', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      // Handle the Drive API response here
      res.status(200).send(response.data);
    })
    .catch((error) => {
      console.error(error);
    })
  
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
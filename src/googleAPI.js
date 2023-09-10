import express from 'express'
import cors from 'cors' 
import google from 'googleapis'
import { OAuth2Client } from 'google-auth-library';
const app = express();
const port = 5000;

app.use(cors());


app.listen(port, () => console.log("Backend server live on " + port));

app.get("/", (req, res) => {
  res.send({ message: "We did it!" });
});

const oauth2Client = new OAuth2Client(
  "389992701916-753vivjpdsjn0fk6r292gdhjldei82s7.apps.googleusercontent.com",
  "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",
  "http://localhost:5173/dashboard"
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/blogger',
  'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes, // Define your desired scopes here
});



// Assuming you have a route handling the OAuth callback URL, and you can access the 'code' parameter.
  app.get("/oauthcallback", async (req, res) => {
    const authorizationCode = req.query.code;
    if (authorizationCode) {
      try {
        res.json({ loggedIn: true });
        const { tokens } = await oauth2Client.getToken(authorizationCode);
        oauth2Client.setCredentials(tokens);
      } catch (error) {
        res.json({ loggedIn: false });
        console.error('Error fetching tokens:', error);
        console.error(res)
        
      }
    } else {
      res.json({ loggedIn: false });
    }
  });

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // Store the refresh_token in your database!
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
  oauth2Client.setCredentials({
    refresh_token: tokens.refresh_token
  });
});







import express, { query } from "express";
import axios from "axios";
import querystring from "query-string";
import cors from "cors";
import dotenv from "dotenv";
import cookieparser from 'cookie-parser'

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
// Define your OAuth 2.0 client credentials
const clientId = process.env.VITE_CLIENTID;
const clientSecret = process.env.VITE_CLIENTSECRET;
const redirectUri = "http://localhost:5173";

app.post("/exchange-tokens", async (req, res) => {
  const authorizationCode = req.body.code;
  console.log(authorizationCode);
  console.log(clientId, clientSecret);

  try {
    // Exchange the authorization code for tokens, including a refresh token
    const tokenResponse = await exchangeAuthorizationCodeForTokens(
      authorizationCode
    );

    // Handle the token response (store tokens, etc.)
    console.log("Token Response:", tokenResponse.data);
    res.send(tokenResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/refresh-token-exchange", async (req, res) => {
  console.log("hello!")
  const refreshToken = req.body.refreshtoken; // Use req.body.refreshtoken
  res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true,  });
  console.log("cookie:" + res.get('Set-Cookie'))
  console.log("Refresh Token: " + req.cookies.refresh_token + "DOne")
  try {
    const newAccessToken = await exchangeRefreshTokenForAccessToken(
      refreshToken
    );
    //console.log("Access Token: ", newAccessToken.data);
    // Send the new access token in the response
    res.json({ access_token: newAccessToken.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Helper function to exchange authorization code for tokens, including a refresh token
async function exchangeAuthorizationCodeForTokens(code) {
  try {
    const tokenEndpoint = "https://oauth2.googleapis.com/token";

    const tokenRequestData = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };
    //console.log(querystring.stringify(tokenRequestData));
    const response = await axios.post(
      tokenEndpoint,
      querystring.stringify(tokenRequestData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    //console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function exchangeRefreshTokenForAccessToken(refreshtoken) {
  try {
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const requestData = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshtoken,
      redirect_uri: redirectUri,
      grant_type: "refresh_token",
    };
    const response = await axios.post(
      tokenEndpoint,
      querystring.stringify(requestData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    //console.log(response);
    
    return response;
  } catch (error) {
    //console.log(error);
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

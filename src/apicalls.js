import express, { query } from "express";
import axios from "axios";
import querystring from "query-string";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


const corsOptions = {
  origin: 'http://localhost:5173', // Specify the exact origin
  credentials: true, // Allow credentials (cookies)
};

const app = express();
const port = 3000;
dotenv.config();
console.log(cookieParser)
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err) {
    console.error('Cookie parsing error:', err);
    // Handle the error or send an error response if needed
  }
  next();
});



app.get("/set-cookie", (req, res) => {
  res.cookie("test_cookie", "cookie_value");
  res.send("Cookie set!");
});

app.get("/get-cookie", (req, res) => {
  const testCookieValue = req.cookies.test_cookie;
  res.send(`Test Cookie Value: ${testCookieValue}`);
});

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
app.get("/get-refresh-token", function(req, res) {
  console.log(req.cookies)
  const refreshTokenValue = req.cookies.refresh_token;
  console.log(refreshTokenValue)
  if (refreshTokenValue) {
    console.log("Refresh Token: " + refreshTokenValue);
    res.send(refreshTokenValue);
  } else {
    console.log("Refresh Token not found in the cookies.");
    res.status(404).send("Refresh Token not found");
  }
});


app.get("/refresh-token-exchange", async function(req, res) {
  console.log("hello!");
  const refreshToken = req.query.refreshtoken; // Use req.body.refreshtoken
  console.log(refreshToken);
  
  try {
    await res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true });
    const newAccessToken = await exchangeRefreshTokenForAccessToken(
      refreshToken
    );
    const expirySeconds = (newAccessToken.data.expires_in)
    const expiryDate = new Date(Date.now() + expirySeconds* 1000)
    console.log(expiryDate)
    res.cookie("access_token", newAccessToken.data.access_token, {httpOnly: true, secure: true, expires: expiryDate});
    console.log(req.cookies)
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

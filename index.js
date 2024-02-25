require("dotenv").config();

const apiUrl2 = "https://api-sandbox.anbima.com.br";
const apiUrl = "https://api.anbima.com.br";

(async () => {
  const tokenResp = await obterAccessToken();
  const accessToken = tokenResp?.access_token;

  console.log("accessToken", accessToken);

  if (accessToken) {
    const debentures = await obterDebentures(accessToken);
    console.log("debentures", debentures);
  }
})();

async function obterAccessToken() {
  const base64encoded = btoa(
    `${process.env.AMBIMA_CLIENT_ID}:${process.env.AMBIMA_CLIENT_SECRET}`
  );

  const response = await fetch(apiUrl + "/oauth/access-token", {
    method: "POST",
    body: JSON.stringify({ grant_type: "client_credentials" }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64encoded}`,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.log("response obterAccessToken", response);
  }

  return data;
}

async function obterDebentures(accessToken) {
  const response = await fetch(apiUrl + "/feed/fundos/v1/fundos", {
    method: "GET",
    headers: {
      accept: "application/json",
      access_token: `${accessToken}`,
      client_id: `${process.env.AMBIMA_CLIENT_ID}`,
    },
  });

  console.log("response obterDebentures", response);

  const data = await response.json();

  console.log("data", data);

  return data;
}

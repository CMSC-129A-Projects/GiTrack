const env = process.env.NODE_ENV === 'PROD' ? 'PROD_' : 'DEV_';

const keys = {
  ACCESS_TOKEN_SECRET: process.env[`${env}ACCESS_TOKEN_SECRET`],
  REFRESH_TOKEN_SECRET: process.env[`${env}REFRESH_TOKEN_SECRET`],
  GH_API_CLIENT_ID: process.env[`${env}GH_API_CLIENT_ID`],
  GH_API_SECRET: process.env[`${env}GH_API_SECRET`],
  AES_SECRET: process.env[`${env}AES_SECRET`],
  NGROK_AUTH_TOKEN: process.env[`${env}AES_SECRET`],
};

module.exports = keys;

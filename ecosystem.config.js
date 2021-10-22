module.exports = {
  apps: [
    {
      name: "FlexOffers Shopify App",
      script: "server/index.js",
      env: {
        PORT: 443,
      },
    },
  ],
};

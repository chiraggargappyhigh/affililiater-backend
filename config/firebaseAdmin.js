const admin = require("firebase-admin");
const path = require("path");

const serviceAccunt = path.join(
  __dirname,
  "..",
  "secrets",
  "firebaseServiceAccount.json"
);

// const stockServiceAccount = path.join(
//   __dirname,
//   '..',
//   'secrets',
//   'firebaseStockAccount.json'
// );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccunt),
});

// const stockAIAdmin = admin.initializeApp(
//   {
//     credential: admin.credential.cert(stockServiceAccount),
//   },
//   'stockAI'
// );

module.exports = { admin };

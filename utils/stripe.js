const Stripe = require('stripe');

// Function to initialize Stripe with a provided secret key
function initializeStripe(secretKey) {
  return new Stripe(secretKey, {
    apiVersion: "2022-11-15",
  });
}

module.exports = {
  initializeStripe
};

const axios = require('axios');
const sendSlackMsg = async (message) => {
    try {
        const slackWebhookUrl = ''; // Replace with your Slack webhook URL

        const payload = {
            text: message
        };

        await axios.post(slackWebhookUrl, payload);
    } catch (error) {
        console.error('Error sending Slack alert:', error);
    }
}

module.exports = { sendSlackMsg }
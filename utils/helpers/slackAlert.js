const { default: axios } = require('axios');

const sendSlackAlert = async (message) => {
  try {
    const slackWebhookUrl =
      'https://hooks.slack.com/services/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'; // Replace with your Slack webhook URL

    const payload = {
      text: message,
    };

    await axios.post(slackWebhookUrl, payload);

    console.log('Slack alert sent successfully');
  } catch (error) {
    console.error('Error sending Slack alert:', error);
  }
};

module.exports = sendSlackAlert;

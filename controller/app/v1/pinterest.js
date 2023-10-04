const AuthPinterest = (req, res) => {
  try {
    const authUrl = `https://api.pinterest.com/oauth/?response_type=code&client_id=${process.env.PINTEREST_CLIENT_ID}&redirect_uri=${process.env.PINTEREST_CLIENT_SECRET}&scope=user_accounts:read`;
    res.redirect(authUrl);
  } catch (err) {}
};

module.exports = {
  AuthPinterest,
};

const { SESClient } = require( "@aws-sdk/client-ses" );
// console.log(process.env);
const ses = new SESClient( {
    apiVersion: "2010-12-01",
    region: process.env.SES_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    },
} );
module.exports = ses;
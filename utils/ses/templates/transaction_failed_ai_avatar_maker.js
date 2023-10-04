const { SendRawEmailCommand, SESClient, CreateTemplateCommand, DeleteTemplateCommand, GetTemplateCommand, SendEmailCommand } = require( "@aws-sdk/client-ses" );
const createCreateTemplateCommand = (TEMPLATE_NAME) => {
    return new CreateTemplateCommand( {
        /**
         * The template feature in Amazon SES is based on the Handlebars template system.
         */
        Template: {
            /**
             * The name of an existing template in Amazon SES.
             */
            TemplateName: TEMPLATE_NAME,
            HtmlPart: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="description" content="WAVA Responsive Bootstrap App Landing Page Template" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Inter&family=Rubik:wght@500&display=swap" rel="stylesheet" />
                <title></title>
                <style>
                  .main {
                    max-width: 616px;
                    margin: 10px auto;
                    text-align: center;
                  }
                  .logo {
                    text-align: left;
                    margin: 10px 0 70px 0;
                  }
                  .body {
                    max-width: 422px;
                    margin: 0 auto;
                  }
                  .name {
                    font-family: 'Rubik', sans-serif;
                    font-size: 24px;
                    font-weight: 500;
                    line-height: 28px;
                  }
                  .text {
                    margin: 10px auto;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 15px;
                    color: #313131;
                  }
                  .avatar {
                    background: linear-gradient(90deg, #161d3f 0%, #111a4d 32.81%, #11194d 70.83%, rgba(11, 18, 58, 0.932292) 100%);
                    border-radius: 16px;
                    margin: 30px 0;
                  }
                  .statusbtn {
                    font-family: 'Rubik', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 17px;
                    margin: 20px 0;
                    border-radius: 8px;
                    background-color: #000;
                    color: #fff;
                    border: none;
                    padding: 15px 60px;
                  }
            
                  .rule {
                    border: 1px solid #0000004d;
                    width: 80%;
                    margin: 20px auto;
                  }
                  .footer {
                    font-family: Inter;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 16px;
                    color: #949494;
                  }
                </style>
              </head>
            
              <body>
                <div class="main">
                  <div class="logo">
                    <img src="https://i.ibb.co/bFrHvJy/Frame-37450.png" alt="logo" />
                  </div>
                  <main class="body">
                    <img src="images/failedIcon.png" alt="check icon" />
                    <h1 class="name">Hi Mayank,</h1>
                    <p class="text">Your Transaction Failed</p>
                    <p class="text">
                      We regret to inform you that your recent transaction for AI avatar creation has failed. Please try again; we
                      assure you that our payment system is secure and reliable.
                    </p>
            
                    <button class="statusbtn">Try Again</button>
                    <p class="text">
                      Your account has not been charged, and any debited amount from your account will be refunded shortly.
                    </p>
            
                    <p class="text">
                      If you have any further questions or concerns, please reply to this mail. We are more than happy to help you!
                    </p>
            
                    <p class="text">Thank you for choosing  AI Avatar Maker.</p>
                    <hr class="rule" />
                  </main>
                  <footer>
                    <p class="footer">
                      Thanks & Regards<br />
                      Gabriel Torres<br />
                      Marketing Manager, AI Avatar Maker
                    </p>
                  </footer>
                </div>
              </body>
            </html>
            
      `,
            SubjectPart: "Test Template Upload",
        },
    } );
};
module.exports = createCreateTemplateCommand;
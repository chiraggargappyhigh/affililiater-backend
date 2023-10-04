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
                    max-width: 500px;
                    margin: 10px auto;
                    text-align: center;
                  }
                  .logo {
                    text-align: left;
                    margin: 10px 0 70px 0;
                  }
                  .name {
                    font-family: 'Rubik', sans-serif;
                    font-size: 24px;
                    font-weight: 500;
                    line-height: 28px;
                  }
                  .text {
                    width: 85%;
                    margin: 15px auto;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 15px;
                    color: #313131;
                  }
                  .avatar {
                    position: relative;
                    width: fit-content;
                    margin: 30px auto;
                    border-radius: 16px;
                    border: 1px solid #dadada;
                    padding: 10px;
                  }
                  .icon {
                    position: absolute;
                    top: -10px;
                  }
                  .statusbtn {
                    font-family: 'Rubik', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 17px;
                    margin: 10px 0;
                    border-radius: 8px;
                    background-color: #000;
                    color: #fff;
                    border: none;
                    padding: 15px 60px;
                    cursor: pointer;
                  }
            
                  .rule {
                    border: 1px solid #0000004d;
                    width: 80%;
                    margin-top: 10px;
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
                    <img src="https://i.ibb.co/mFB94h3/image.png" alt="wave icon" />
                    <h1 class="name">Hi Mayank,</h1>
                    <p class="text">Your AI Avatars are about to expire!</p>
                    <div class="avatar">
                      <img src="images/image_0.png" alt="avatar" />
                      <img src="images/image_1.png" alt="avatar" />
                      <img src="images/image_2.png" alt="avatar" />
                      <img src="images/image_3.png" alt="avatar" />
                      <img src="images/image_4.png" alt="avatar" />
                      <img src="images/resetIcon.png" class="icon" alt="avatar" />
                    </div>
                    <p class="text">Our records show that you recently created AI avatars and are yet to download them. </p>
                    <p class="text">Your fantastic avatars are<b> expiring in just 2 days!</b> </p>
                    <p class="text">
                      Log in to your AI Avatar Maker account now & download your avatars before they disappear forever.
                    </p>
                    <button class="statusbtn">Download Now</button>
                    <p class="text">If you need any assistance, please don't hesitate to reply to this email.</p>
            
                    <p class="text">Thank you for choosing AI Avatar Maker!</p>
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
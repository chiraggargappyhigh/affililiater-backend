const { SendEmailCommand } = require( "@aws-sdk/client-ses" );
const createSendEmailCommand = ( toAddress, fromAddress, template, user, url, userDetails, couponCode) => {
    console.log("sending wemail to", toAddress)
    let temp = template.HtmlPart;
    temp = temp.replace("{{user}}", user)
    temp = temp.replace("{{contact}}", "Gabriel Torres")
    temp = temp.replace("{{position}}", "Marketing Manager")
    temp = temp.replace("{{url}}", url)
    temp = temp.replace("{{email}}", toAddress)
    temp = temp.replace("{{email}}", toAddress)
    temp = temp.replace("{{couponCode}}", couponCode)
    if(userDetails){
        const { userEmail, message, name, mobile , company, website } = userDetails; 
        temp = temp.replace("{{message}}", message)
        temp = temp.replace("{{name}}", name)
        temp = temp.replace("{{mobile}}", mobile)
        temp = temp.replace("{{company}}", company)
        temp = temp.replace("{{website}}", website)
        temp = temp.replace("{{userEmail}}", userEmail)
    }
    // console.log(temp)

    return new SendEmailCommand( {
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                Data: temp
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "TEXT_FORMAT_BODY",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: template.SubjectPart,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    } );
};
module.exports =  createSendEmailCommand;
const SES_ENUMS = require( './enums' );
const { SEND_EMAIL_FROM  } = require( './constants' );
// const createCreateTemplateCommand = require( './actions/createTemplate' );
// const createDeleteTemplate = require( './actions/deleteTemplate' );
const createGetTemplate = require( './getTemplate' );
// const createUpdateTemplateCommand = require( './actions/updateTemplate' );
const createSendEmailCommand = require( './send' );
const ses = require( './sesClient' );
// console.log(process.env);
const run = async ( type, templateName, template, sendTo, user, url, userDetails, couponCode) => {
    // const createTemplateCommand = createCreateTemplateCommand( TEMPLATE_NAME );
    // const deleteTemplateCommand = createDeleteTemplate( TEMPLATE_NAME );
    
    // const updateTemplateCommand = createUpdateTemplateCommand( TEMPLATE_NAME );
    try {
        if ( type == SES_ENUMS.CREATE )
            return await ses.send( createTemplateCommand );
        if ( type == SES_ENUMS.DELETE )
            return await ses.send( deleteTemplateCommand );
        if ( type == SES_ENUMS.GET ) {
            const getTemplateCommand = createGetTemplate( templateName );
            console.log("sending and jsahj getting wemail to", sendTo)
            return await ses.send( getTemplateCommand );
        }
        if ( type == SES_ENUMS.SEND && sendTo){
            const sendEmailCommand = createSendEmailCommand(
                sendTo,
                SEND_EMAIL_FROM,
                template,
                user,
                url,
                userDetails,
                couponCode
            );

            console.log("sending and getting wemail to", sendTo, url)
        
            return await ses.send( sendEmailCommand );
        }
        if ( type == SES_ENUMS.UPDATE_TEMPLATE )
            return await ses.send( updateTemplateCommand );
    } catch ( err ) {
        console.log( "Failed to create template.", err );
        return err;
    }
};
const sendEmail = async (templateName, sendTo, user, url, userDetails, couponCode) => {
    let result;
    console.log("sending & getting wemail to", sendTo)

    result = await run( SES_ENUMS.GET, templateName, "", "", "", "", "" );
    // result = awaitrun( SES_ENUMS.CREATE );
    // result = awaitrun( SES_ENUMS.DELETE );
    result = await run( SES_ENUMS.SEND,"", result.Template, sendTo, user, url, userDetails, couponCode);
    // result = awaitrun( SES_ENUMS.UPDATE_TEMPLATE );
    console.log( result );
};

module.exports = sendEmail


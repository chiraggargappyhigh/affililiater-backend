const {  GetTemplateCommand } = require( "@aws-sdk/client-ses" );
const createGetTemplate = ( templateName ) => new GetTemplateCommand( { TemplateName: templateName } );
module.exports = createGetTemplate;
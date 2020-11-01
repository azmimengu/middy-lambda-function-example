const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const secretsManager = require('@middy/secrets-manager');

const repository = require('./repository');

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const { MONGO_DB_URI } = context.SECRETS;
    const dbConn = await repository.initiliazeDb(MONGO_DB_URI);

    try {

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
            })
        };

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

const lambdaHandler = middy(handler);
lambdaHandler.use(secretsManager({
    cache: true,
    secrets: {
        SECRETS: 'development/backend'
    }
}));


lambdaHandler.use(cors());
lambdaHandler.use(httpJsonBodyParser());

exports.lambdaHandler = lambdaHandler;

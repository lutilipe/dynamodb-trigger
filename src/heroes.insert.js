const uuid = require("uuid")
const JOI = require("joi")
const Decorators = require("./decorators");

class Handler {
    constructor(config) {
        this.dynamoDbSvc = config.dynamoDbSvc;
        this.dynamoDbTable = process.env.DYNAMODB_TABLE;
    }

    static validator() {
        return JOI.object({
            name: JOI.string().max(100).min(2).required(),
            power: JOI.string().max(20).required()
        })
    }

    async main(event) {
        try {
            const data = event.body;
            const dbParams = this.parseData(data);
            await this.insertData(dbParams);
            return this.handleSuccess(dbParams);
        } catch (err) {
            return this.handleError({ message: err });
        }
    }

    parseData(data) {
        return {
            TableName: this.dynamoDbTable,
            Item: {
                ...data,
                id: uuid.v4(),
                createdAt: new Date().toISOString()
            }
        }
    }

    async insertData(data) {
        return this.dynamoDbSvc.put(data).promise();
    }

    handleSuccess(data) {
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }

    handleError(data) {
        console.error(data.message)
        return {
            statusCode: data.statusCode || 500,
            header: { "Content Type": "text/plain" },
            body: "Unable to create item",
            message: data.message
        }
    }
}

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const handler = new Handler({
    dynamoDbSvc: dynamoDb
});

module.exports = Decorators.validator(
    handler.main.bind(handler),
    Handler.validator(),
    "body"
)
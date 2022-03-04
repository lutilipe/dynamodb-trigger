class Handler {
    async main(event) {
        console.log(
            "*Event*",
            JSON.stringify(
                event,
                null,
                4
            )
        );
        return {
            statusCode: 200,
        }
    }
}

const handler = new Handler();

module.exports = handler.main.bind(handler);

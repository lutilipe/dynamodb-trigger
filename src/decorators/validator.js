const validator = (fn, schema, argsTypes) => {
    return async function(event) {
        const data = JSON.parse(event[argsTypes]);
        const { error, value } = await schema.validate(data);

        event[argsTypes] = value;

        if (!error) {
            return fn.apply(this, arguments);
        }

        return {
            statusCode: 422,
            message: error.message
        }
    }
}

module.exports = validator;
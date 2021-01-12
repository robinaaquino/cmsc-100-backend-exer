/**
 * 
 * @param {*} error 
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply<Response>} response
 */
exports.errorHandler = (error, request, response) => {
    let statusCode = error.statusCode || 500; //500 if there's no status code
    let errorCode = error.message;
    let errorMessage = error.message;
    const errors = {
        'todo/not-found': 'Todo cannot be found using the given ID',
        'todo/unauthorized': 'You are not authorized to use this path',
        'todo/forbidden': 'As an admin, you can\'t update text',
        'user/unauthorized': 'You are not authorized to use this path',
        'user/not-found': 'User cannot be found using the given username',
        'user/username-not-found': 'User cannot be found using the givern username',
        'user/forbidden': 'You are not allowed to do this',
        'user/forbidden/get-many': 'Only choose one sort',
        'user/bad-request': 'Password should not contain numbers and special characters, and must be longer than 12 characters',
        'request/malformed': 'Payload doesn\'t have the necessary properties',
        'auth/wrong-password': 'Password is not correct',
        'auth/no-authorization-header': 'No authorization header found',
        'auth/no-user': 'No user is found using username',
        'auth/expired': 'Token has expired',
        'auth/unauthorized': 'You are not authorized to use this path',
        'auth/discarded': 'The token has been already logged out'
    }

    if(error.validation && error.validation.length && error.validationContext === 'body'){
        statusCode = 400;
        errorCode = 'request/malformed';
    }

    if (errorMessage === errorCode){
        errorMessage = errors[errorCode];
    }

    return response
        .code(statusCode)
        .send({
            success: false,
            code: errorCode,
            message: errorMessage
        });
}
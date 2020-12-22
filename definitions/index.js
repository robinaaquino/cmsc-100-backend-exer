const UniqueIDData = {
    type: 'string',
    description: "A unique identifier",
    value: '3b84349f-a82e-4a17-a711-e25afaaf69ef',
    example: '3b84349f-a82e-4a17-a711-e25afaaf69ef'
};

const JWTData = {
    type: 'string',
    description: "A JSON web token",
    value: '3b84349f-a82e-4a17-a711-e25afaaf69ef',
    example: '3b84349f-a82e-4a17-a711-e25afaaf69ef'
}

const UsernameData = {
    type: 'string',
    description: "A unique username",
    value: 'rrmaquino',
    example: 'rrmaquino'
};

const FirstNameData = {
    type: 'string',
    description: "A string first name",
    value: 'Robina',
    example: 'Robina'
};

const LastNameData = {
    type: 'string',
    description: "A string last name",
    value: 'Aquino',
    example: 'Aquino'
}

const isAdminData = {
    type: 'boolean',
    description: "If a user is tagged as isAdmin",
    value: 'false',
    example: 'false'
}

const PasswordData = {
    type: 'string',
    description: "Password string",
    value: '3b84349fa82e4a17a711e25afaaf69ef',
    example: '3b84349fa82e4a17a711e25afaaf69ed12345678'    
}

const TextData = {
    type: 'string',
    description: 'Any textual string',
    value: 'Hello world',
    example: 'Hello world'
};

const isDoneData = {
    type: 'boolean',
    description: 'If a todo object is tagged as isDone',
    value: 'true',
    example: 'true'
};

const DateData = {
    type: 'number',
    description: 'A date value that is in Unix Epoch',
    value: 1603096056185,
    example: 1603096056185
};

const SuccessData = {
    type: 'boolean',
    description: 'State of a response',
    value: 'true',
    example: 'true'
};

const LimitData = {
    type: 'number',
    description: 'Limit of how many items we should query',
    value: 4,
    example: 4
};

const SuccessResponse = {
    type: 'object',
    description: 'Response with a success state only',
    properties:{
        success: SuccessData
    }
};

const TodoFullData = {
    type: 'object',
    description: 'Todo object data coming from the database',
    properties: {
        id: UniqueIDData,
        text: TextData,
        isDone: isDoneData,
        username: UsernameData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const TodoListData = {
    type: 'array',
    description: 'A list of todos',
    items: TodoFullData
};

const GetManyTodoQuery = {
    type: 'object',
    description: 'Query parameters for getting many todos',
    properties: {
        limit: LimitData,
        startDate: DateData,
        endDate: DateData
    }
}

const GetOneTodoParams = {
    type: 'object',
    description: 'Parameters for getting one todo',
    properties: {
        id: UniqueIDData
    }
}

const GetOneUserParams = { //for getting one user, implementing, get one user
    type: 'object',
    description: 'Parameters for getting a user',
    properties: {
        userId: UsernameData
    }
}

const UserFullData = {
    type: 'object',
    description: 'User data for response without the password',
    properties: {
        username: UsernameData,
        firstName: FirstNameData,
        lastName: LastNameData,
        isAdmin: isAdminData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
}

const UserListData = { //for getting many users, not implemented
    type: 'array',
    description: 'A list of users',
    items: UserFullData
}

const GetOneUserResponse = {
    type: 'object',
    description: 'Returns a user',
    required: ['success','data'],
    properties: {
        success: SuccessData,
        data: UserFullData
    }
}

const GetManyTodoResponse = {
    type: 'object',
    description: 'Returns a list of todos',
    required: ['success','data'],
    properties: {
        success: SuccessData,
        data: TodoListData
    }
}

const PostUserRequest = {
    type: 'object',
    description: 'User object data for creation',
    required: [
        'username',
        'password'
    ],
    properties: {
        username: UsernameData,
        password: PasswordData,
        firstName: FirstNameData,
        lastName: LastNameData
    }   
}

const PostUserRequestLogin = {
    type: 'object',
    description: 'User object data for login',
    required: [
        'username',
        'password'
    ],
    properties: {
        username: UsernameData,
        password: PasswordData
    }   
}

const PostTodoRequest = {
    type: 'object',
    description: 'Todo object data for creation',
    required: [
        'text',
    ],
    properties: {
        text: TextData,
        isDone: isDoneData
    }
}

const PutTodoRequest = {
    type: 'object',
    description: 'Todo object data for update',
    properties: {
        text: TextData,
        isDone: isDoneData
    }
}

const GetOneTodoResponse = {
    type: 'object',
    description: 'Returns a todo',
    required: ['success','data'],
    properties: {
        success: SuccessData,
        data: TodoFullData
    }
}

const GetOneUserReponse = {
    type: 'object',
    description: 'Returns a user',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: UserFullData
    }
}

const LoginResponse = {
    type: 'object',
    description: 'Returns a JWT data',
    required: ['success','data'],
    properties: {
        success: SuccessData,
        data: JWTData
    }
}

exports.definitions = {
    SuccessResponse,
    GetManyTodoResponse,
    GetManyTodoQuery,
    GetOneTodoParams,
    GetOneTodoResponse,
    PostTodoRequest,
    PutTodoRequest,
    PostUserRequest,
    GetOneUserResponse,
    LoginResponse,
    GetOneUserParams,
    PostUserRequestLogin
} //13:30 //openssl command incomplete at 6:24
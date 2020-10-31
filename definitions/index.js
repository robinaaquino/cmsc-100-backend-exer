const UniqueIDData = {
    type: 'string',
    description: "A unique identifier",
    value: '3b84349f-a82e-4a17-a711-e25afaaf69ef',
    example: '3b84349f-a82e-4a17-a711-e25afaaf69ef'
};

const UsernameData = {
    type: 'string',
    description: "A unique username",
    value: 'rrmaquino',
    example: 'rrmaquino'
};

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

const DoneData = {
    type: 'boolean',
    description: 'If a todo object is tagged as done',
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
        done: DoneData,
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

const UserFullData = {
    type: 'object',
    description: 'User data for response without the password',
    properties: {
        username: UsernameData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
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
        done: DoneData
    }
}

const PutTodoRequest = {
    type: 'object',
    description: 'Todo object data for update',
    properties: {
        text: TextData,
        done: DoneData
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

exports.definitions = {
    SuccessResponse,
    GetManyTodoResponse,
    GetManyTodoQuery,
    GetOneTodoParams,
    GetOneTodoResponse,
    PostTodoRequest,
    PutTodoRequest,
    PostUserRequest,
    GetOneUserResponse
}
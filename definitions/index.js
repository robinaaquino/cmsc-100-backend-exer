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
    value: 'passwordpassword',
    example: 'passwordpassword'    
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

const ifSortByDateCreatedData = {
    type: 'boolean',
    description: 'If to be sorted by date created',
    value: 'true',
    example: 'true'
}

const ifSortByDateUpdatedData = {
    type: 'boolean',
    description: 'If to be sorted by date updated',
    value: 'true',
    example: 'true'
}

const ifSortByUsernameData = {
    type: 'boolean',
    description: 'If to be sorted by username',
    value: 'true',
    example: 'true'
}

const isAscendingData = {
    type: 'boolean',
    description: 'If to be sorted in an ascending order',
    value: 'true',
    example: 'true'
}

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
    description: 'Limit of how many items we should query. Any number higher than 50 is automatically turned into 50',
    value: 10,
    example: 10
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
        username: UsernameData,
        text: TextData,
        isDone: isDoneData,
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
        startDateCreated: DateData,
        endDateCreated: DateData,
        startDateUpdated: DateData,
        endDateUpdated: DateData,
        isDone: isDoneData,
        usernameFilter: UsernameData
    }
}

const GetManyUserQuery = {
    type: 'object',
    description: 'Query parameters for getting many todos',
    properties: {
        limit: LimitData,
        startDateCreated: DateData,
        endDateCreated: DateData,
        startDateUpdated: DateData,
        endDateUpdated: DateData,
        isAdminFilter: isAdminData,
        startUsername: UsernameData,
        endUsername: UsernameData,
        ifSortByDateCreated: ifSortByDateCreatedData,
        ifSortByDateUpdated: ifSortByDateUpdatedData,
        ifSortByUsername: ifSortByUsernameData,
        isAscendingElseDescending: isAscendingData
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
    description: 'User data for get one response without the password',
    properties: {
        username: UsernameData,
        firstName: FirstNameData,
        lastName: LastNameData,
        isAdmin: isAdminData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
}

const PutUserRequest = {
    type: 'object',
    description: 'User data for updating a user',
    properties: {
        password: PasswordData,
        firstName: FirstNameData,
        lastName: LastNameData,
        isAdmin: isAdminData
    }
}

const GetManyUserFullData = {
    type: 'object',
    description: 'User data for get many response without first name, last name and isAdmin',
    properties: {
        username: UsernameData,
        isAdmin: isAdminData,
        dateCreated: DateData,
        dateUpdated: DateData
    }
}

const GetManyUserListData = {
    type: 'array',
    description: 'A list of users',
    items: GetManyUserFullData
}

const UserListData = { //for getting many users, not implemented
    type: 'array',
    description: 'A list of users',
    items: UserFullData
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

const GetManyUserResponse = {
    type: 'object',
    description: 'Returns a list of todos',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: GetManyUserListData
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

const GetOneTodoResponseCreate = {
    type: 'object',
    description: 'Returns a todo',
    required: ['success'],
    properties: {
        success: SuccessData
    }
}

const ownerUserData = {
    type: 'object',
    description: 'Returns user information for owner update',
    properties: {
        username: UsernameData,
        firstName: FirstNameData,
        lastName: LastNameData,
        isAdmin: isAdminData,
        dateCreated: DateData,
        dateUpdated: DateData 
    }
}

const adminUserData = {
    type: 'object',
    description: 'Returns user information for admin update',
    properties: {
        username: UsernameData,
        isAdmin: isAdminData,
        dateCreated: DateData,
        dateUpdated: DateData 
    }
}

const UpdateOneUserResponse = {
    type: 'object',
    description: 'Returns a user',
    properties: {
        ownerUser: ownerUserData,
        adminUser: adminUserData
    }
}

const GetOneUserResponse = {
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

const JWTResponse = {
    type: 'object',
    description: 'Returns a success and JWT Token',
    require: ['success'],
    properties: {
        success: SuccessData,
        data: JWTData
    }
}

const AuthQuery = {
    type: 'object',
    description: 'Accepts tokens',
    properties: {
        tokenQuery: JWTData
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
    PostUserRequestLogin,
    GetOneTodoResponseCreate,
    GetManyUserQuery,
    GetManyUserResponse,
    GetManyUserFullData,
    GetManyUserListData,
    PutUserRequest,
    UpdateOneUserResponse,
    JWTResponse,
    AuthQuery
} //13:30 //openssl command incomplete at 6:24
let initialState = {
    auth: false
}
var userSignUp = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case "signup_success":
            newState.auth = true;
            newState.error = false;
            newState.message = "User SignUp Success"
            return newState;
        case "signup_failed":
            newState.auth = false;
            newState.error = true;
            newState.message = "User already Exist!"
            return newState;
        default:
            return newState;
    }
}

export default userSignUp
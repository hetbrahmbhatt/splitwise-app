let initialState = {
    id: "",
}
var login = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case "login_success":
            newState.id = action.payload.response.data.id
            newState.error = false;
            newState.message = "Login Success";
            return newState;
        case "login_failed":
            newState.error = true;
            newState.message = "Invalid credentials!"
            return newState;
        default:
            return newState;
    }
}

export default login
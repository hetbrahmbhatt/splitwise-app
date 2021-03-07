import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";

const LOGIN_SUCCESS = "login_success";
const LOGIN_FAILED = "login_failed";

var successUser = ( response, data ) => {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

var errorUser = ( err, data ) => {
    return {
        type: LOGIN_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}


var loginAction = (data) => (dispatch) => {
    axios
        .post(BACKEND_URL + '/users/login', data)
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                cookie.save("auth", true, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("id", response.data.id, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("name", response.data.name, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("email", response.data.email, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("defaultcurrency", response.data.currency, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                cookie.save("timezone", "UTC", {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                console.log("Over here")
                dispatch(successUser(response,data));

            }
        })
        .catch((err) => {
            dispatch(errorUser(err, data))
        });
}

export default loginAction
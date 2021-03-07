import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";

const SIGNUP_SUCCESS = "signup_success";
const SIGNUP_FAILED = "signup_failed";

var successUser = (response, data) => {
    return {
        type: SIGNUP_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

var errorUser = (err, data) => {
    return {
        type: SIGNUP_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}


var SignUpAction = (data) => (dispatch) => {
    axios
        .post(BACKEND_URL + '/users/signup', data)
        .then((response) => {
            if (response.status === 200) {
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
                    cookie.save("timezone", " ", {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    dispatch(successUser(response, data))
                }
            }
        }).catch((err) => {
            dispatch(errorUser(err, data))
        });
}

export default SignUpAction
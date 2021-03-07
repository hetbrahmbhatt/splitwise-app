import SignUpReducer from './sign-up-reducer';
import { combineReducers } from 'redux';
import loginReducer from './login-reducer';

var rootReducer = combineReducers( {
    SignUpReducer: SignUpReducer,
    loginReducer: loginReducer,

});

export default rootReducer

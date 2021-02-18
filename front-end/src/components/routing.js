import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { landingPage } from './landing-page/landing-page';
import { SignUp } from './sign-up/sign-up';
import {Login} from './login/login'

export class Routing extends Component {
    render() {
        return (
            <div>
                <Route exact path='/' component={landingPage} />
                <Route path='/signup' component={SignUp} />
                <Route path='/login' component={Login} />

            </div>
        )
    }
}

export default Routing
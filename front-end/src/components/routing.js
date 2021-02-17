import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { landingPage } from './landing-page/landing-page';
import { SignUp } from './sign-up/sign-up';

export class Routing extends Component {
    render() {
        return (
            <div>
                <Route exact path='/' component={landingPage} />
                <Route path='/signup' component={SignUp} />

            </div>
        )
    }
}

export default Routing
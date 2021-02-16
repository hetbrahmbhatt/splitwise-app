import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {landingPage} from './landing-page/landing-page';

export class Routing extends Component {
    render () {
        return (
            <div>
                <Route path='/' component={ landingPage } />
            </div>
        )
    }
}

export default Routing
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import splitwiselogo from '../../images/splitwise-logo.png'

export class Navbar extends Component {
    render() {
        if (cookie.load('auth')) {
            var name = cookie.load('name')
            return (
                <div>
                    <nav class="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#20BF9F' }}>
                        <img style={{ "marginLeft": "100px" }} src={splitwiselogo} width="60" height="40" alt="" />
                        <h2 style={{ "color": "black", "marginTop": "5px", "marginLeft": "5px", "color": "white" }}><strong>Splitwise</strong></h2>
                        <li class="nav-item dropdown" style={{ "margin-left": '950px', "margin-top": "-20px", "color": "#20BF9F" }}>
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ "color": "white" }}>
                                <strong>{name}</strong>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="/profile">Profile</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/new-group">Create a New Group</a>
                                <a class="dropdown-item" href="/all-group">Groups / Invitations</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/recent-activity">Recent Activities</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/logout">
                                    Logout
                                </a>
                            </div>
                        </li>
                        {/* <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav ml-auto" >
                                <li class="nav-item">
                                    <Link class="nav-link" to="/users/dashboard" style={ { color: 'white' } }>Dashboard</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to="/users/orders" style={ { color: 'white' } }>Orders</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to="/users/events" style={ { color: 'white' } }>Events</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to="/users/about" style={ { color: 'white' } }>About</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to="/logout" style={ { color: 'white' } }>Logout</Link>
                                </li>
                            </ul>
                        </div> */}
                    </nav>

                </div>
            )
        }
        else {
            return (
                <div>
                    <nav class="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'white' }}>
                        <a class="navbar-brand" href="">
                            <img style={{ "marginLeft": "170px" }}
                                src={splitwiselogo} width="60" height="50" alt="" />
                        </a>
                        <p style={{ "margin-top": "20px" }}><strong>Splitwise</strong></p>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav ml-auto" >
                                <li class="nav-item" >
                                    <Link class="nav-link" to="/login" style={{ color: 'green', "margin-right": "0px" }}>Login</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to="/signup" style={{ color: 'green', "margin-right": "100px" }}>Signup</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                </div>
            )
        }
    }
}

export default Navbar

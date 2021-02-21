import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../../config/config';
import splitwiselogo from '../../images/splitwise-logo.png'
import cookie from "react-cookies";

export class signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            error: false,
            errorMessage: "",
            emailError: false
        }
    }

    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

    }

    handleEmailChange = inp => {
        console.log(inp.target.name, inp.target.value);
        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inp.target.value)) {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "
            })
        } else {
            this.setState({
                error: true,
                errorMessage: "Please correct email",
                [inp.target.name]: ""
            })
        }
    }
    //handle input change
    handleInputChange = inp => {
        // console.log( inp.target.name, inp.target.value );
        if (/[~`!#$@%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inp.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Special characters not allowed",
                [inp.target.name]: ""
            })
        } else {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "

            })
        }
    }
    //handle submit
    handleSubmit = e => {
        if (!this.state.error) {
            e.preventDefault();
            axios
                .post(BACKEND_URL + '/users/signup', this.state)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        this.setState({
                            error: false
                        })
                        this.setState({
                            emailError: true
                        })
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
                        window.location.assign('/users/dashboard');
                    }
                    console.log(response.status);
                })
                .catch((err) => {
                    console.log("Error");
                    this.setState({
                        errorMessage: err.response.data,
                        emailError: true
                    })
                });
        };
    }
    render() {
        let renderError = null
        let emailError = null;
        if (this.state.emailError) {
            emailError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        return (
            <div>
                <div className="row" style={{ height: "100vh", "padding": "10%" }}>
                    <div className="col-5" style={{ "paddingLeft": "10%" }}>
                        <div className='row' style={{ "height": "90%" }}>
                            <div className="col-12">
                                <img src={splitwiselogo} width="80" height="60" alt="" />
                                <h4 >Please Introduce Yourself</h4>
                                <form onSubmit={this.handleSubmit} style={{ "margin": "10px" }} id="Signup">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="name" autoFocus required
                                            placeholder="Enter Name" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="email" required
                                            placeholder="Enter Email" onChange={this.handleEmailChange} />
                                        {emailError}
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="password" required
                                            placeholder="Enter Password" onChange={this.handlePasswordChange} />
                                    </div>
                                    <div className="form-group">
                                        {this.state.type === 'restaurants' ? <input type="text" className="form-control" name="address" required
                                            placeholder="Enter location" onChange={this.handleInputChange} /> : undefined}
                                    </div>
                                    <button type="submit" className="btn btn-success" onSubmit={this.handleSubmit}>Sign Up</button>
                                </form>
                                {renderError}
                                <br></br>
                                Already have an account? {<Link style={{ "color": "green" }} to="/login">Login</Link>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default signup

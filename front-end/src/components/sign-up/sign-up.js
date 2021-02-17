import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../../config/config';
import splitwiselogo from '../../images/splitwise-logo.png'

export class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            error: false,
            errorMessage: ""
        }
    }

    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

    }

    handleEmailChange = inp => {
        console.log( inp.target.name, inp.target.value );
        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inp.target.value)) {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value
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
                [inp.target.name]: inp.target.value
            })
        }
    }


    //handle submit
    handleSubmit = sub => {
        sub.preventDefault();

        console.log(this.state);

    };

    renderError = () => {
        if (this.state.error) {
            return (
                <div>
                    <h5>"User with this email already exist"</h5>
                </div>
            )
        }
    }

    render() {
        let renderError = null
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

export default SignUp

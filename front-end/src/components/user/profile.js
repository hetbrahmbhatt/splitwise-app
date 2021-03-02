import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { toast } from "react-toastify";
import cookie from 'react-cookies';
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import Select from 'react-select'
//TODO: Change the keys for dropdown
export class Profile extends Component {
    state = {
        userID: cookie.load('id'),
        name: "",
        email: "",
        phoneno: "",
        defaultcurrency: "",
        timezone: "",
        language: "",
        profileImageUpdate: false,
        updatedProfileImage: "",
        profileImagePath: "",
        emailError: false,
        error: false
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
                [inp.target.name]: inp.target.value
            })
        }
    }
    handleCurrencyChange = e => {
        this.setState({
            defaultcurrency: e.value
        })
    }
    handleTimezoneChange = e => {
        this.setState({
            timezone: e.value
        })
    }
    handleLanguageChange = e => {
        this.setState({
            language: e.value
        })
    }
    handleImageChange = e => {
        this.setState({
            updatedProfileImage: e.target.files[0],
            profileImageUpdate: true
        })
    }
    handleOnSubmit = e => {
        e.preventDefault();
        if (!this.state.error) {
            axios
                .put(BACKEND_URL + "/users/editprofile", this.state).then(response => {
                    if (response.status === 200) {
                        if (this.state.profileImageUpdate) {
                            console.log("object")
                            const formData = new FormData();
                            formData.append('profileImage', this.state.updatedProfileImage, this.state.updatedProfileImage.name + "," + this.state.userID)
                            const config = {
                                headers: {
                                    'content-type': 'multipart/form-data'
                                }
                            }
                            axios
                            .post( BACKEND_URL + '/users/uploadprofileimage', formData, config ).then( ( response ) => {
                                this.setState( {
                                    profileImagePath: BACKEND_URL + '/images/profilepics/' + cookie.load('id') + '/' + response.data.fileName
                
                                } )
                            } ).catch( err => {
                                toast.error("Error in image upload")
                            } )
                        }
                        if (cookie.load('email') !== this.state.email) {
                            cookie.remove("email", {
                                path: '/'
                            });
                            cookie.save("email", this.state.email, {
                                path: '/',
                                httpOnly: false,
                                maxAge: 90000
                            })
                        }
                        if (cookie.load('name') !== this.state.name) {
                            cookie.remove("name", {
                                path: '/'
                            });
                            cookie.save("name", this.state.name, {
                                path: '/',
                                httpOnly: false,
                                maxAge: 90000
                            })
                        }
                        if (cookie.load('defaultcurrency') !== this.state.defaultcurrency) {
                            cookie.remove("defaultcurrency", {
                                path: '/'
                            });
                            cookie.save("defaultcurrency", this.state.defaultcurrency, {
                                path: '/',
                                httpOnly: false,
                                maxAge: 90000
                            })
                        }
                        if (cookie.load('timezone') !== this.state.timezone) {
                            cookie.remove("timezone", {
                                path: '/'
                            });
                            cookie.save("timezone", this.state.timezone, {
                                path: '/',
                                httpOnly: false,
                                maxAge: 90000
                            })
                        }
                        window.location.assign( "/profile" );
                    }

                }).catch(err => {
                    this.setState({
                        errorMessage: err.response.data,
                        emailError: true
                    })
                })
        }

    }
    async componentDidMount() {
        try {
            const userID = cookie.load("id")
            const response = await axios.get(BACKEND_URL + "/users/userbyid/" + userID);
            this.setState({
                userID: response.data.userid,
                name: response.data.name,
                email: response.data.email,
                defaultcurrency: response.data.defaultcurrency,
                phoneno: response.data.phoneno,
                timezone: response.data.timezone,
                language: response.data.language,

            })
            if(response.data.image == null)
            { 
                this.setState({
                    profileImagePath : BACKEND_URL + '/images/avatar.png'
                })            }
            else{
                this.setState({
                profileImagePath : BACKEND_URL + '/images/profilepics/' + cookie.load('id') + '/' + response.data.image
            })
            }
        }
        catch (err) {
            console.log(err)
        }

    }

    render() {
        console.log(this.state);
        var redirectTo = null;
        var emailError = null;
        const currency = [
            { value: '$', label: 'USD($)' },
            { value: 'KWD', label: 'KWD(KWD)' },
            { value: 'BHD', label: 'BHD(BD)' },
            { value: '£', label: 'GBP(£)' },
            { value: '€', label: 'EUR(€)' },
            { value: '$', label: 'CAD($)' }
        ]
        const timezone = [
            { value: 'PST', label: 'Pacific Standard Time' },
            { value: 'MST', label: 'Mountain Standard Time' },
            { value: 'CST', label: 'Central Standard Time' },
            { value: 'EST', label: 'Eastern Standard Time' },
        ]
        const language = [
            { value: 'EN', label: 'English' },
            { value: 'ESP', label: 'Spanish' },

        ]
        if (!(cookie.load("auth"))) {
            redirectTo = <Redirect to="/" />
        }
        if (this.state.emailError) {
            emailError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        let renderError = null
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red', 'marginLeft': '-200px' }}>{this.state.errorMessage}</div>
        }
        return (
            <div>
                { redirectTo}
                <div class="container" style={{ "marginLeft": '250px', "marginTop": '20px' }}>
                    <div class="row">
                        <div class="col-sm">
                            <div className="row"><h2 style={{ "marginLeft": '20px' }}>
                                Your Account</h2></div>
                            <img src={this.state.profileImagePath}  width="200" height="200" alt="" />

                            <div className="row"><p style={{ "margin-left": '20px' }}>Change your Avatar</p></div>
                            <div className="row">
                                <input style={{ "marginLeft": '20px' }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                            </div>
                        </div>
                        <div class="col-sm">
                            <form onSubmit={this.handleOnSubmit}>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3">
                                        <label>Your Name:</label>
                                        <input type="text" className="form-control" name="name"
                                            placeholder={this.state.name} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <Select
                                            options={currency}
                                            placeholder={this.state.defaultcurrency}
                                            onChange={this.handleCurrencyChange} />
                                    </div>
                                </div>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3">
                                        <label>Your Email:</label>
                                        <input type="text" className="form-control" name="email"
                                            placeholder={this.state.email } onChange={this.handleEmailChange} />
                                        {emailError}
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <Select
                                            options={timezone}
                                            placeholder={this.state.timezone}
                                            onChange={this.handleTimezoneChange} />
                                    </div>
                                </div>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3">
                                        <label>Your Phone No:</label>
                                        <input type="number" className="form-control" name="phoneno"
                                            placeholder={this.state.phoneno} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <Select
                                            options={language}
                                            placeholder={this.state.language}
                                            onChange={this.handleLanguageChange} />
                                    </div>
                                </div>
                                {renderError}

                                <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "100px", "marginLeft": "-100px" }} onSubmit={this.handleSubmit}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Profile

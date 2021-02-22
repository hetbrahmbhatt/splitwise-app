import React, { Component } from 'react'
import splitwiselogo from '../../images/splitwise-logo.png'
import axios from 'axios';
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import { ToastContainer, toast } from 'react-toastify';
import AsyncSelect from 'react-select/async'
import 'react-toastify/dist/ReactToastify.css';

export class NewGroup extends Component {


    state = {
        userID : cookie.load('id'),
        groupName: "",
        selectedUsers: [],
        groupError: false,
        emailRadioButton: false,
        nameRadioButton: false,
        error : false,
        errorMessage : ""
    }
    loadOptionsForName = async (inp, callback) => {
        const response = await axios.get(BACKEND_URL + "/users/searchbyname?name_like=" + inp);
        callback(response.data.map(i => ({
            label: i.name,
            value: i.userID
        })));
    }
    loadOptionsForEmail = async (inp, callback) => {
        const response = await axios.get(BACKEND_URL + "/users/searchbyemail?email_like=" + inp);
        console.log(response.data);
        callback(response.data.map(i => ({
            label: i.email,
            value: i.userID
        })));
    }
    

    handleRadioButtonChange = (event) => {
        console.log(event.target.value);
        if (event.target.value == "email") {
            this.setState({
                emailRadioButton: true,
                nameRadioButton : false
            })
        }
        else {
            this.setState({
                nameRadioButton: true,
                emailRadioButton : false
            })
        }
    }
    handleInputChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value
            })
        }
    }
    handleSelectChange = (selectedUsers) => {
        this.setState({
            selectedUsers: selectedUsers

        })
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        if(this.state.groupName == "" ){
            toast.error("Please enter group name");
            return;
        }
        if(this.state.selectedUsers.length == 0 ){
            toast.error("Please enter group members");
            return;
        }
        if (!this.state.error) {
            console.log(this.state);
            axios
                .post(BACKEND_URL + "/groups/new", this.state).then(response => {
                    console.log(response);
                    toast.success(" Group created succesfully");

                }).catch(err => {
                    toast.error(err.response.data);
                })
        }
    }

    render() {
        let gError = null
        let emailDivision = null
        let nameDivision = null
        if (this.state.groupError) {
            gError = <div style={{ 'color': 'red' }}>{this.state.groupErrorMessage}</div>
        }
        if (this.state.name) {
            gError = <div style={{ 'color': 'red' }}>""</div>
        }
        if (this.state.nameRadioButton) {
            nameDivision = <AsyncSelect
                isMulti
                value={this.state.selectedUsers}
                onChange={this.handleSelectChange}
                placeholder={'Type group members...'}
                loadOptions={this.loadOptionsForName}
            />
        }
        if (this.state.emailRadioButton) {
            emailDivision = <AsyncSelect
                isMulti
                value={this.state.selectedUsers}
                onChange={this.handleSelectChange}
                placeholder={'Type group members...'}
                loadOptions={this.loadOptionsForEmail}
            />
        }
        return (
            <div>
                <div className="row" style={{ "height": "10vh" }}>
                </div>
                <div className="row" style={{ "height": "100vh" }}>
                    <div className="col-3"></div>
                    <div className="col-2">
                        <img src={splitwiselogo} style={{ "paddingLeft": "0%" }} width="200px" height="200px" alt="" />

                    </div>
                    <div className="col-6">
                        <h5>Start a new group</h5>
                        <h3>My group shall be called...</h3>
                        <form onSubmit={this.handleSubmit} id="Login">
                            <input type="text" id="groupName" name="groupName" style={{ "width": "300px", "marginBottom": "40px" }} onChange={this.handleInputChange} ></input>
                            <div onChange={this.handleRadioButtonChange}>
                                <input type="radio" value="email" name="search" /> Search by email
                                <input type="radio" value="name" name="search" /> Search by name
                            </div>
                            {nameDivision}
                            {emailDivision}
                            {gError}
                            <ToastContainer />
                            <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "100px", "marginLeft": "0px" }} onSubmit={this.handleSubmit}>Save</button>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}
export default NewGroup

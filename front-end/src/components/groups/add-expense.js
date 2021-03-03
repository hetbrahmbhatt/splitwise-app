import React, { Component } from 'react'
import BACKEND_URL from '../../config/config'
import description from '../../images/desrciption.png'
import cookie from "react-cookies";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


export class AddExpense extends Component {
    constructor(props) {
        super(props);
        if (this.props.groupData.groupImagePath == null) {
            console.log("object")
            this.state = {
                groupID: this.props.groupData.groupID,
                groupName: this.props.groupData.groupName,
                groupImagePath: BACKEND_URL + '/images/avatar.png',
                currency : cookie.load('defaultcurrency'),
                userID : cookie.load('id'),
                description: "",
                amount : ""
            }
        }
        else {
            this.state = {
                groupID: this.props.groupData.groupID,
                groupName: this.props.groupData.groupName,
                groupImagePath: this.props.groupData.groupImagePath,
                currency : cookie.load('defaultcurrency'),
                userID : cookie.load('id'),
                description: "",
                amount : ""
            }
        }
    }
    handleInputChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value
            })
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        if (this.state.groupName == "") {
            toast.error("Please enter group name");
            return;
        }
        var currency = {
            currency : cookie.load("defaultcurrency")
        };
        axios
            .post(BACKEND_URL + "/groups/expenses",this.state).then(response => {
                if (response.status === 200) {
                    window.location.reload();
                    toast.success("Group Updated Successfully");
                    //window.location.assign("/users/dashboard")
                }
            }).catch(err => {
                if (err.response == null) {

                }
                else {

                }
                // toast.error(err.response.data);
            })
    }
    render() {
        return (
            <div>
                <div class="container">
                    <div class="row" style={{ backgroundColor: "#20BF9F", color: 'white' }}>
                        <p style={{ "marginLeft": "160px", marginTop: "10px", fontWeight: "100px" }}>
                            Add an Expense</p>
                    </div>
                    <div class="row" style={{ "backgroundColor": "whitesmoke" }} >
                        <p style={{ "margin": "10px" }}>
                            With <b>you</b> and:
                            <img style={{ marginLeft: "10px", "borderRadius": "200px" }} src={this.state.groupImagePath} width="20" height="20" alt="" />
                            All of <b>{this.state.groupName}</b>
                        </p>
                    </div>
                    <div class="row" >
                        <h1></h1>
                    </div>
                    <div class="row" >
                        <h1></h1>
                    </div>
                    <div class="row" >
                        <h1></h1>
                    </div>
                    <div class="row" >
                        <div className="col-1">
                        </div>
                        <div className="col-3">
                            <img src={description} width="100px" height="100px" alt="" />
                        </div>
                        <div className="col-5">
                            <form onSubmit={this.handleSubmit} id="Login">
                                <input placeholder="Enter Description" type="text" id="description" name="description" style={{ border: "0", borderBottom: "2px dotted" }} onChange={this.handleInputChange} ></input>
                                <div className="row">
                                    <input value={cookie.load('defaultcurrency')} size="1" style={{ marginTop: "10px", marginLeft: "20px", marginRight: "5px", border: "0", marginBottom: "-13px" }}></input>  <input placeholder="0.00" type="text" size="17" id="amount" name="amount" style={{ border: "0", borderBottom: "2px dotted", marginTop: "20px" }} onChange={this.handleInputChange} ></input>
                                </div>
                                <button type="submit" className="btn btn-amber" style={{ "backgroundColor": "#20BF9F", "marginTop": "150px", "marginLeft": "10px" }} onSubmit={this.handleSubmit}>Save</button>
                                <button className="btn btn-danger" style={{"marginLeft" : "10px","marginTop" : "150px"}}onClick={ this.props.closePopUp }>Back</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddExpense

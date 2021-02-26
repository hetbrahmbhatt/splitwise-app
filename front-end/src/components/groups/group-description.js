import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import Modal from 'react-modal';
import _ from 'lodash';
import AddExpense from './add-expense'
const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        height: '460px',
        width: '500px',
        transform: 'translate(-50%, -50%)'
    }
};

export class GroupDescription extends Component {

    constructor(props) {
        super(props)
        console.log(this.props.location.state.groupData)
        if (this.props.location.state) {
            if (this.props.location.state.groupData.image == null) {
                this.state = {
                    groupID: this.props.location.state.groupData.groupID,
                    groupName: this.props.location.state.groupData.groupName,
                    profileImageUpdate: false,
                    newProfileImage: "",
                    groupImagePath: BACKEND_URL + '/images/avatar.png',
                    error: false,
                    errorMessage: "",
                    groupPopUp: false

                }
            }
            else {
                console.log("object")
                this.state = {
                    groupID: this.props.location.state.groupData.groupID,
                    groupName: this.props.location.state.groupData.groupName,
                    profileImageUpdate: false,
                    newProfileImage: "",
                    groupImagePath: BACKEND_URL + '/images/grouppics/' + this.props.location.state.groupData.groupID + '/' + this.props.location.state.groupData.image,
                    error: false,
                    errorMessage: "",
                    groupPopUp: false

                }
            }
        }
    }
    toggleGroupPopUp = (e) => {
        this.setState({
            groupPopUp: !this.state.groupPopUp
        })
    }

    render() {

        return (
            <div>
                <div class="container">

                    <div class="row">
                        <div class="col-3">
                        </div>
                        <div class="col-7">
                            <div style={{ backgroundColor: "whitesmoke", "height": "10vh" }} className="row">
                                <img style={{ margin: "20px", borderRadius: "200px" }} src={this.state.groupImagePath} width="40px" height="40px" alt="" />
                                <h1 style={{ marginTop: "20px" }}>{this.state.groupName}</h1>
                                <button type="submit" className="btn btn-amber" onClick={this.toggleGroupPopUp} style={{ marginLeft: "70px", marginTop: "25px", height: "40px", width: "250px", backgroundColor: "#FF7F50", color: "white" }} >Add an Expense</button>
                                <div style={{ height: "200px" }}>
                                    <Modal style={customStyles} isOpen={this.state.groupPopUp} ariaHideApp={false}>
                                        <AddExpense groupData = {this.state}/>
                                    </Modal>
                                </div>

                            </div>
                            <hr />
                            <div className="row">
                            </div>
                        </div>
                        <div class="col-2">
                            One of three columns
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GroupDescription

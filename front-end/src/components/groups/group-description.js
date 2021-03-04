import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import Modal from 'react-modal';
import _ from 'lodash';
import axios from 'axios';
import AddExpense from './add-expense'
import moment from 'moment';
import grocerylogo from '../../images/grocery.png'
import camera from '../../images/camera.png'

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
// TODO: Placeholder in expenses
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
                    groupPopUp: false,
                    groupDescription: []

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
                    groupPopUp: false,
                    groupDescription: []
                }
            }
        }
    }
    async componentDidMount() {
        const groupID = this.state.groupID;
        const response = await axios.get(BACKEND_URL + "/groups/description/" + groupID);
        console.log(response.data);
        response.data.map((groupDescription) => {
            this.setState({
                groupDescription: [...this.state.groupDescription, groupDescription]
            })
        })
        const individualData = await axios.get(BACKEND_URL + "/groups/individualdata/" + groupID);
        // console.log(individualData.data);
        const individualExpense = await axios.post(BACKEND_URL + "/groups/individualexpense/" + groupID,individualData.data);
        // console.log(individualExpense.data);
        // console.log(this.state);
    }
    toggleGroupPopUp = (e) => {
        this.setState({
            groupPopUp: !this.state.groupPopUp
        })
    }

    render() {
        
        let redirectVar = null
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        let groupDescriptionDetails = this.state.groupDescription.map((group, index) => {
            return (
                <div className="row" style={{ height: "100px", borderBottom: "0.01px solid lightgrey", borderLeft: "0.01px solid lightgrey", borderRight: "0.01px solid lightgrey", borderWidth: "thin", marginBottom: "1px" }}>
                    <div className="col-1" style={{ margin: "20px", color: "grey" }}>
                        <div className="row">
                            {moment(group.createdat).format("MMM")}
                        </div>
                        <div className="row" style={{ fontSize: "30px", marginTop: "-10px" }}>
                            {moment(group.createdat).format("D")}
                        </div>
                    </div>
                    <div className="col-2">
                        <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "-20px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                    </div>
                    <div className="col-6" style={{ marginLeft: "-60px", marginTop: "30px" }}>
                        <div className="row">
                            <h3>{group.description}</h3>
                            <img src={camera} style={{ margin: "8px" }} width="20px" height="20px" alt="" />
                        </div>
                    </div>
                    <div className="col-3" style={{ marginLeft: "60px", marginTop: "15px", marginRight: "-40px" }}>
                        <div className="row" style={{color : "grey"}}>
                            {group.name}
                        </div>
                        <div className="row">
                            <h3><b>{group.currency}{group.amount}</b></h3>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div>
                {redirectVar}
                <div class="container">
                    <div class="row">
                        <div class="col-2">
                        </div>
                        <div class="col-7">
                            <div style={{ backgroundColor: "whitesmoke", "height": "10vh" }} className="row">
                                <img style={{ margin: "20px", borderRadius: "200px" }} src={this.state.groupImagePath} width="40px" height="40px" alt="" />
                                <h1 style={{ marginTop: "20px" }}>{this.state.groupName}</h1>
                                <button type="submit" className="btn btn-amber" onClick={this.toggleGroupPopUp} style={{ marginLeft: "70px", marginTop: "25px", height: "40px", width: "250px", backgroundColor: "#FF7F50", color: "white" }} >Add an Expense</button>
                                <div style={{ height: "200px" }}>
                                    <Modal style={customStyles} isOpen={this.state.groupPopUp} ariaHideApp={false}>
                                        <AddExpense groupData={this.state} closePopUp={this.toggleGroupPopUp}/>
                                    </Modal>
                                </div>

                            </div>
                            {groupDescriptionDetails}

                        </div>
                        <div class="col-2">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GroupDescription

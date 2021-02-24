import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import IndividualGroup from './individual-group';
import AcceptedGroup from './accepted-groups';

export class MyGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            acceptedGroups: []
        }
    }
    async componentDidMount() {
        const userID = cookie.load("id")
        console.log(userID);
        const response = await axios.get(BACKEND_URL + "/groups/invitedgroups/" + userID);
        const acceptedResponse = await axios.get(BACKEND_URL + "/groups/acceptedgroups/" + userID);
        console.log(acceptedResponse);
        acceptedResponse.data.map((acceptedGroups) => {
            this.setState({
                acceptedGroups: [...this.state.acceptedGroups, acceptedGroups]
            })
        })
        console.log("object");
        console.log(response.data);
        response.data.map((group) => {
            this.setState({
                groups: [...this.state.groups, group]
            })

        })
        console.log("get groups", this.state)
    }
    render() {
        var redirectVar = null;
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        let groupInvitationDetails = this.state.groups.map((group) => {
            return (
                <div>
                    <IndividualGroup groupData={group} />
                </div>

            )
        })
        let groupAcceptedDetails = this.state.acceptedGroups.map((group) => {
            return (
                <div>
                    <AcceptedGroup acceptedGroupData={group} />
                </div>

            )
        })
        return (
            <div>
                { redirectVar}

                <div className="row">
                    <div className="col-6">
                        <h1 style={{ marginLeft: "50px", "marginBottom": "40px", "marginLeft": "150px" }}>Group Invitations</h1>
                        {groupInvitationDetails}

                        <div style={{ "borderLeft": "6px solid black", "height": "10000%", "position": "absolute", "left": "100%", "marginLeft": "-3px", "top": "0px" }}></div>

                        {/* 
                         */}
                    </div>
                    <div className="col-6">
                        <h1 style={{ marginLeft: "50px", "marginBottom": "40px", "marginLeft": "150px" }}>Your Groups</h1>
                        {groupAcceptedDetails}
                    </div>
                </div>
            </div>
        )
    }
}

export default MyGroup

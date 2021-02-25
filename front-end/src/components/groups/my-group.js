import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import IndividualGroup from './individual-group';
import AcceptedGroup from './accepted-groups';


//TODO: Empty placeholder for no records
export class MyGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            acceptedGroups: [],
            searchInput: ""
        }
    }
    handleSearch = (e) => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async componentDidMount() {
        const userID = cookie.load("id")
        console.log(userID);
        const response = await axios.get(BACKEND_URL + "/groups/invitedgroups/" + userID);
        const acceptedResponse = await axios.get(BACKEND_URL + "/groups/acceptedgroups/" + userID);
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
        console.log(this.state);
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
        let searchedGroups = this.state.acceptedGroups.filter((group) => {
            if (group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase())) {
                return group;
            }
            // console.log(group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase()))
            // return group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase())
        })

        // let groupAcceptedDetails = searchedGroups.map(group => {
        //     return (
        //         <div>
        //             <AcceptedGroup acceptedGroupData={group} />
        //         </div>
        //     )
        // })
        let groupAcceptedDetails = searchedGroups.map(group => {
            return (
                <AcceptedGroup acceptedGroupData={group} />
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
                        <div className="col-6 m-4">
                            <input type="text" style={{ "width": "400px", "marginLeft": "10px" }} name="searchInput" onChange={this.handleSearch} placeholder="Search Accepted Groups"></input>
                        </div>
                        {searchedGroups.map(group => {
                            // return console.log(group);
                           return  <AcceptedGroup acceptedGroupData={group} />

                        })}
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default MyGroup

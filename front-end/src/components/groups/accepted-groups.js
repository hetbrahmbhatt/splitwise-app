import React, { Component } from 'react'
import { Redirect } from 'react-router'
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import cookie from "react-cookies";
import _ from 'lodash';
export class AcceptedGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupID: this.props.acceptedGroupData.ref_groupid,
            groupName: this.props.acceptedGroupData.name,
            image: this.props.acceptedGroupData.image,
        }
        console.log(this.state);
    }
    displayPicture = (name, groupID) => {
        console.log(groupID);
        if (name == null) {
            var groupImagePath = BACKEND_URL + "/images/avatar.png"

        }
        else {
            var groupImagePath = BACKEND_URL + "/images/grouppics/" + groupID + '/' + name
        }
        return (

            <img src={groupImagePath} width="80px" height="80px" alt="" />

        )
    }
    render() {
        if ( !( cookie.load( "auth" )) ) {
            return <Redirect to='/login' />
        }
        return (
            <div>
                <div className="row" style={{ "width": "80%", "height": "200px", "background": "whitesmoke", "marginLeft": "50px" }}>
                    <div className="col-2 " style={{ marginTop: "10px" }}>
                        <div className="row p-1 m-2"><h4></h4></div>
                        <div className="row p-1 m-2"><h4></h4></div>
                        {this.displayPicture(this.state.image, this.state.ref_groupid)}
                    </div>
                    <div className='col-4'>
                        <div className="row p-1 m-3"><h6>Group Name</h6></div>
                        <div className="row p-1 m-3" ></div>
                        <div className="row p-1 m-3"><h2>{this.state.groupName}</h2></div>
                    </div>
                    <div className='col-2'>
                        <div className="row p-1 m-3" ><h6>Invited By</h6></div>
                        <div className="row p-1 m-3"><h3>{this.state.invitedBy}</h3></div>
                    </div>
                </div>
                <div className="row p-4" style={{ marginLeft: "160px" }}>
                    <div className="col-2">
                        <div className="row" ><h6>hi</h6></div>
                    </div>
                    <div className="col-2" style={{ marginLeft: "40px" }}>
                        <div className="row" ><h6>hi</h6></div>
                    </div>
                </div>
            </div >
        )
    }
}

export default AcceptedGroup

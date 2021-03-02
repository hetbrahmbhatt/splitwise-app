import React, { Component } from 'react';
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config';
import axios from 'axios';
import grocerylogo from '../../images/grocery.png'

export class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recentactivity: []
        }
    }
    //TODO: Add the group image at bottom right corner

    async componentDidMount() {
        const userID = cookie.load("id");
        const response = await axios.get(BACKEND_URL + "/groups/recentactivity/" + userID);

        console.log(response.data);
        response.data.map((recentactivity) => {
            this.setState({
                recentactivity: [...this.state.recentactivity, recentactivity]
            })
        })
        console.log(this.state);

        // console.log(this.state);
    }
    render() {
        let recentactivityDetails = this.state.recentactivity.map((group, index) => {
            let groupDivision = null;
            let groupPayingDivision = null;
            let amount = group.amount/group.count;
            
            if (group.ref_paidby == cookie.load('id')) {
                groupDivision = <p style={{ fontSize: "20px" }}><b>You</b> updated <b>"{group.description}"</b> in <b>"{group.name}".</b></p>
                groupPayingDivision = <div style={{ 'color': '#20BF9F',fontSize : "18px" }}><b>You get back {group.currency} {amount}</b></div>

            }
            else {
                groupDivision = <p style={{ fontSize: "18px" }}><b>"{group.username}"</b> added <b>"{group.description}"</b> in <b>"{group.name}".</b></p>
                groupPayingDivision = <div style={{ 'color': '#FF8C00',fontSize : "18px" }}><b>You owe {group.currency} {amount}</b></div>

            }
            return (
                <div>
                    <div className="row" className="row" style={{ height: "100px", borderBottom: "0.01px solid lightgrey", borderLeft: "0.01px solid lightgrey", borderRight: "0.01px solid lightgrey", borderWidth: "thin", marginLeft: "-14px" }}>
                        <div className="col-2">
                            <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "10px", marginTop: "20px" }} width="60%" height="60%" alt="" />

                        </div>
                        <div className="col-9" style={{ marginTop: "20px", marginLeft: "5px" }}>
                                {/* <p style={{fontSize: "18px"}}><b>"{group.username}"</b> added <b>"{group.description}"</b> in <b>"{group.name}"</b></p> */}
                                {groupDivision}
                                <div style={{ marginTop : "-10px"}}>
                                {groupPayingDivision}

                                </div>
                            
                        </div>
                    </div>

                </div>
            )
        });
        return (
            <div className="row">
                <div className="col-3">

                </div>
                <div className="col-6">
                    <div className="row" style={{ height: "80px", backgroundColor: "whitesmoke" }}>
                        <strong style={{ margin: "20px", fontSize: "30px" }}>Recent Activity</strong>
                    </div>
                    {recentactivityDetails}
                </div>
            </div>
        )
    }
}

export default RecentActivity

import React, { Component, useRef } from 'react';
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config';
import axios from 'axios';
import grocerylogo from '../../images/grocery.png'
import emptyplaceholder from '../../images/empty-placeholder.png'
import moment from 'moment';
import Select from 'react-select';

export class RecentActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            recentactivity: [],
            emptyStateFlag: false,
            selectedOption: "",
            groups: [],
            groupsFlag: false,
            activitiesValue: "",
            activitiesFlag: false,
            orderByValue: "",
            orderByFlag: false
        }
    }
    handleChange = e => {
        console.log("here")
        console.log(e.value);
        this.setState({
            activitiesValue: e.value,
            activitiesFlag: true
        })
        var obj = {
            userID: cookie.load('id'),
            groupID: e.value,
            orderBy: 'DESC'
        };
        axios
            .post(BACKEND_URL + "/groups/recentactivitybygroups", obj).then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    if (response.data.length == 0) {
                        this.setState({
                            emptyStateFlag: true
                        })
                    }
                    else {
                        this.setState({
                            recentactivity: response.data,
                            emptyStateFlag: false
                        })
                    }
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
    handleOrderByChange = e => {
        this.setState({
            orderByFlag: true,
            orderByValue: e.value
        })
        if (this.state.activitiesFlag) {
            var obj = {
                userID: cookie.load('id'),
                groupID: this.state.activitiesValue,
                orderBy: e.value
            }
            axios
                .post(BACKEND_URL + "/groups/recentactivitybygroups", obj).then(response => {
                    if (response.status === 200) {
                        console.log(response.data);
                        if (response.data.length == 0) {
                            this.setState({
                                emptyStateFlag: true
                            })
                        }
                        else {
                            this.setState({
                                recentactivity: response.data,
                                emptyStateFlag: false
                            })
                        }
                        //window.location.assign("/users/dashboard")
                    }
                });
            console.log("------------------>")
        }
        else {
            var obj = {
                userID: cookie.load('id'),
                groupID: null,
                orderBy: e.value
            }
            axios
                .post(BACKEND_URL + "/groups/recentactivitybygroups", obj).then(response => {
                    if (response.status === 200) {
                        console.log(response.data);
                        if (response.data.length == 0) {
                            this.setState({
                                emptyStateFlag: true
                            })
                        }
                        else {
                            this.setState({
                                recentactivity: response.data,
                                emptyStateFlag: false
                            })
                        }
                        //window.location.assign("/users/dashboard")
                    }
                });
        }
    }
    async componentDidMount() {
        const userID = cookie.load("id");
        const response = await axios.get(BACKEND_URL + "/groups/recentactivity/" + userID);
        const groupResponse = await axios.get(BACKEND_URL + "/groups/totalgroups/" + userID);
        groupResponse.data.map((groups) => {
            this.setState({
                groups: [...this.state.groups, groups]
            })
        })
        response.data.map((recentactivity) => {
            this.setState({
                recentactivity: [...this.state.recentactivity, recentactivity]
            })
        })
        if (this.state.recentactivity.length == 0) {
            this.setState({
                emptyStateFlag: true
            })
        }
        // console.log(this.state);
    }
    onClear = () => {
        window.location.reload();
    };
    render() {
        let orderByOptions = [
            { value: 'DESC', label: 'Descending' },
            { value: 'ASC', label: 'Ascending' },
        ]
        let groupOptions = this.state.groups.map(function (group) {
            return { value: group.groupid, label: group.name };
        })
        console.log(this.state);
        let recentactivityDetails = null;
        if (this.state.emptyStateFlag) {
            recentactivityDetails = (
                <div style={{ margin: "200px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>Sorry, no activities yet to display!!</h4>
                </div>
            )

        }
        else {
            recentactivityDetails = this.state.recentactivity.map((group, index) => {
                let groupDivision = null;
                let groupPayingDivision = null;
                let amount = group.amount / group.count;

                if (group.ref_paidby == cookie.load('id')) {
                    groupDivision = <p style={{ fontSize: "20px" }}><b>You</b> updated <b>"{group.description}"</b> in <b>"{group.name}".</b></p>
                    groupPayingDivision = <div style={{ 'color': '#20BF9F', fontSize: "18px" }}><b>You get back {group.currency} {amount}</b></div>

                }
                else {
                    groupDivision = <p style={{ fontSize: "18px" }}><b>"{group.username}"</b> added <b>"{group.description}"</b> in <b>"{group.name}".</b></p>
                    groupPayingDivision = <div style={{ 'color': '#FF8C00', fontSize: "18px" }}><b>You owe {group.currency} {amount}</b></div>

                }
                return (
                    <div>
                        <div className="row" className="row" style={{ height: "100px", borderBottom: "0.01px solid lightgrey", borderLeft: "0.01px solid lightgrey", borderRight: "0.01px solid lightgrey", borderWidth: "thin", marginLeft: "-14px" }}>
                            <div className="col-2">
                                <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "10px", marginTop: "20px" }} width="60%" height="60%" alt="" />

                            </div>
                            <div className="col-9" style={{ marginTop: "20px", marginLeft: "5px", zIndex: "100", position: "relative" }}>
                                {/* <p style={{fontSize: "18px"}}><b>"{group.username}"</b> added <b>"{group.description}"</b> in <b>"{group.name}"</b></p> */}
                                {groupDivision}
                                <div style={{ marginTop: "-15px", color: "grey" }}>
                                    {groupPayingDivision}
                                    {moment(group.createdat).format("MMM")}
                                    {' '}
                                    {moment(group.createdat).format("D")}

                                </div>

                            </div>
                        </div>

                    </div>
                )
            });
        }
        return (
            <div className="row">
                <div className="col-3 p-1 m-3">
                    <Select
                        style={{ width: "400px", marginLeft: "-30px" }}
                        name="form-field-name"
                        onChange={this.handleChange}
                        labelKey='name'
                        valueKey='groupid'
                        placeholder="Select a particular group for recent activities"
                        options={groupOptions}
                    />
                    <Select
                        style={{ width: "400px", marginLeft: "-30px" }}
                        name="form-field-name"
                        labelKey='name'
                        onChange={this.handleOrderByChange}
                        valueKey='groupid'
                        placeholder="Select Order by"
                        options={orderByOptions}
                    />
                    <button class="btn btn-info" style={{ marginLeft: "100px", marginTop: "20px",backgroundColor : "#20BF9F" }} onClick={this.onClear}>Clear Value</button>

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

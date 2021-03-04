import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import _ from 'lodash';
import axios from 'axios';
import BACKEND_URL from '../../config/config';

export class DashBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            totalBalance: "",
            totalNegativeBalance: [],
            totalPositiveBalance:[],
            totalBalance: []
        }
    }
    async componentDidMount() {
        var userID = cookie.load("id");
        const negResponse = await axios.get(BACKEND_URL + "/expense/negtotalbalance/" + userID);
        console.log(negResponse.data)
        if(negResponse.data == [])
        { 
            this.setState({
                totalNegativeBalance: "0.00 bucks"
            })     
        }
        else{
            this.setState({
                totalNegativeBalance: negResponse.data
            })
        }

        const posResponse = await axios.get(BACKEND_URL + "/expense/postotalbalance/" + userID);
        if(posResponse.data == [])
        { 
            this.setState({
                totalPositiveBalance: "0.00 bucks"
            })     
        }
        else{
            this.setState({
                totalPositiveBalance: posResponse.data
            })
        }

        const totalResponse = await axios.get(BACKEND_URL + "/expense/totalbalance/" + userID);
        this.setState({
            totalBalance: totalResponse.data
        })
        const totalOwingResponse = await axios.get(BACKEND_URL + "/expense/totalowing/" + userID);
        console.log(totalOwingResponse.data)
        const totalGivingResponse = await axios.get(BACKEND_URL + "/expense/totalgiving/" + userID);
        console.log(totalGivingResponse.data)


    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-3">
                    </div>
                    <div className="col-6">
                        <div style={{ backgroundColor: "whitesmoke", height: "90px" }}>
                            <div className="row">
                                <p style={{ marginLeft: "280px", marginTop: "30px" }}><h3><strong>Dashboard</strong></h3></p>
                            </div>
                        </div>
                        <div style={{ backgroundColor: "whitesmoke", height: "100px", borderTop: "0.6px solid lightgrey" }}>
                            <div className="row">
                                <div col-2 style={{ marginLeft: "70px", height: "90px", marginTop: "5px", maxWidth:"120px",marginRight: "60px", paddingRight: "60px", borderRight: "1px solid lightgrey" }}><h5>total</h5><p style={{color : "#20BF9F",fontSize:"18px",marginLeft:"-40px"}}><div style={{maxWidth:"100px"}}>{this.state.totalBalance}</div></p></div>
                                <div col-2 style={{ marginLeft: "10px", maxWidth:"180px",marginTop: "5px", marginRight: "60px", paddingRight: "90px", borderRight: "1px solid lightgrey" }}><center><h5>you owe</h5><p style={{color : "#20BF9F",fontSize:"18px",marginLeft:"0px"}}>{this.state.totalPositiveBalance}</p></center></div>
                                <div col-2 style={{ marginLeft: "10px", marginTop: "5px", maxWidth:"120px",marginRight: "60px", paddingRight: "2px" }}><h5>you are owed</h5><p style={{color : "red",fontSize: "18px",marginLeft:"0px",color: "#FF8C00" }}>{this.state.totalNegativeBalance}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    
                                </div>
                                <div className="col-3">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default DashBoard

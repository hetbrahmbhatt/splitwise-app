import React, { Component } from 'react'
import cookie from "react-cookies";
import profilePhoto from '../../images/profile-icon.png'


export class TotalGiving extends Component {
    constructor(props) {
        super(props)
            this.state = {
                groupName: this.props.totalGiveData.name,
                userid1: cookie.load('id'),
                userid2: this.props.totalGiveData.userid2,
                ref_groupid: this.props.totalGiveData.ref_groupid,
                amount: this.props.totalGiveData.amount,
                data: this.props.totalGiveData.totalOwe
        }
    };

    render() {
        console.log(this.state);
        return (
            <div style={{ margin: "50px" }} >
                <div className="row" style={{backgroundColor:"#fafafa"}}>
                    <div className="col-2">                            <img
                        src={profilePhoto} width="70px" height="70px" alt="" style={{ borderRadius: "50px" }} />
                    </div>
                    <div className="col-3">
                        <div style={{ marginTop: "20px" }}><strong>{this.state.data}</strong></div>

                    </div>
                    <div className="col-3">
                        <div style={{ marginLeft: "10px", marginTop: "20px",color:"#FF8C00" }}><strong>{this.state.amount}</strong></div>

                    </div>
                    <span style={{marginTop:"20px"}} >IN</span>
                    <div className="col-3">
                    
                    <div style={{ marginLeft: "10px", marginTop: "20px" }}><strong>{this.state.groupName}</strong></div>
                    </div>
                </div>
                <div className="row" style={{marginLeft:"200px",marginTop:"30px"}}>
                <button type="button" style={{backgroundColor: "#FF8C00"}}class="btn btn-primary btn-sm">Settle-Up</button>

                </div>
            </div>
        )
    }
}

export default TotalGiving
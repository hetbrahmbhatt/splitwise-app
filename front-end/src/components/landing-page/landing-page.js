import React, { Component } from 'react';
import './landing-page.css';
import { Link } from 'react-router-dom';
import splitwiselogo from '../../images/splitwise-logo.png'
import { BsHouseDoorFill, BsFillHeartFill } from "react-icons/bs";
import { FaRegSnowflake, FaPlaneDeparture } from "react-icons/fa";
import Typical from 'react-typical'
// TODO: Add image icon
export class landingPage extends Component {
    render() {
        return (

            <div className="main">
                <div className="top__component">
                    <div className="top__component__first">
                    </div>
                    <div className="top__component__second">
                        <img src={splitwiselogo} width="80" height="60" alt="" />
                        <div className="top__component__text">Splitwise</div>
                    </div>
                    <div className="top__component__third">
                        <Link to="/login">
                            <button type="button" style={{ "height": "50px", "width": "100px", "margin-left": "-100px", "margin-top": "20px" }} class="btn btn-outline-success">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button type="button" style={{ "height": "50px", "width": "100px", "margin-left": "10px", "margin-top": "20px" }} class="btn btn-success">Signup</button>
                        </Link>
                    </div>
                </div>
                <div className="second__component">
                    <div className="second__first__part">
                        <div className="second__text">
                            Less stress when sharing expenses{' '} with anyone.
                        {/* <Typical loop={Infinity}
                            wrapper="b"
                            steps={[
                                'with anyone', 1000,
                                '  on trips', 1000,
                                'with housemates', 1000
                            ]}
                        /> */}
                        </div>
                        <div className="Icons">
                            <ul class="second__Icons">
                                <li><FaPlaneDeparture size={40} color="green" /></li>
                                <li><FaRegSnowflake size={40} color="grey" /></li>
                                <li><BsHouseDoorFill size={40} color="purple" /></li>
                                <li><BsFillHeartFill size={40} color="maroon" /></li>
                            </ul>
                        </div>
                        <div className="second__smallText">Keep track of your shared expenses and balances with trips,groups and families. </div>

                        <Link to="/signup">
                            <button type="button" style={{ "height": "50px", "width": "170px", "margin-left": "200px", "margin-top": "20px" }} class="btn btn-success btn-lg">Sign-Up</button>
                        </Link>

                    </div>
                    <div className="second__second__part">

                        <span><FaRegSnowflake size={600} color="lightgrey" /></span>
                    </div>
                </div>
            </div>
        )
    }
}

export default landingPage

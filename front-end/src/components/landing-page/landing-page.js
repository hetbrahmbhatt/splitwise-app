import React, { Component } from 'react';
import './landing-page.css'
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
                        <div className="top__component__text">Splitwise</div>
                    </div>
                    <div className="top__component__third">
                        <button className="login-button">Login</button>
                        <button className="sign-button">Sign Up</button>

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
                        <div> 
                            <ul class="second__Icons">
                                <li><FaPlaneDeparture size={40} color="green" /></li>
                                <li><FaRegSnowflake size={40} color="grey" /></li>
                                <li><BsHouseDoorFill size={40} color="purple" /></li>
                                <li><BsFillHeartFill size={40} color="maroon" /></li>
                            </ul>
                        </div>
                        <div className="second__smallText">Keep track of your shared expenses and balances with trips,groups and families. </div>
                        <button className="signup-button">Sign Up</button>

                    </div>
                    <div className="second__second__part">

                        <span><BsHouseDoorFill size={600} color="purple" /></span>
                    </div>
                </div>
                <div className="third__component"></div>
            </div>
        )
    }
}

export default landingPage

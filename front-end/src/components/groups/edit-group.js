import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export class EditGroup extends Component {
    constructor(props) {
        super(props);
        if (this.props.groupData.image == null) {
            this.state = {
                groupID: this.props.groupData.groupID,
                groupName: this.props.groupData.groupName,
                invitedBy: this.props.groupData.invitedBy,
                groupPopUp: false,
                profileImagePath: BACKEND_URL + "/images/avatar.png",
                profileImageUpdate: false,
                updatedProfileImage: "",
            }
        }
        else {
            this.state = {
                groupID: this.props.groupData.groupID,
                groupName: this.props.groupData.groupName,
                invitedBy: this.props.groupData.invitedBy,
                groupPopUp: false,
                profileImagePath: BACKEND_URL + "/images/grouppics/" + this.props.groupData.groupID + '/' + this.props.groupData.image
            }
        }
    }
    handleInputChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value
            })
        }
    }

    handleImageChange = e => {
        this.setState({
            updatedProfileImage: e.target.files[0],
            profileImageUpdate: true
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        if (this.state.groupName == "") {
            toast.error("Please enter group name");
            return;
        }
        console.log(this.state);
        axios
            .put(BACKEND_URL + "/groups/updategroup", this.state).then(response => {

                if (response.status === 200) {
                    toast.success("Group Updated Successfully");
                    //window.location.assign("/users/dashboard");
                    const formData = new FormData();
                    formData.append('profileImage', this.state.updatedProfileImage, this.state.updatedProfileImage.name + "," + this.state.groupID)
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                    axios
                        .post(BACKEND_URL + '/groups/uploadprofileimage', formData, config).then((response) => {
                            console.log("Here");
                            this.setState({
                                profileImagePath: BACKEND_URL + '/images/grouppics/' + this.state.groupID + '/' + response.data.fileName

                            })
                            window.location.reload();
                        }).catch(err => {
                            window.location.reload();

                            toast.error("Error in image upload")
                        })
                }
            }).catch(err => {
                if (err.response == null) {

                }
                else
                    toast.error(err.response.data);
            })
        //         if (response.status === 200) {
        //             toast.success("Group Created Successfully");
        //             window.location.assign("/users/dashboard");
        //             console.log(response.data.groupID);
        //             const formData = new FormData();
        //             formData.append('profileImage', this.state.updatedProfileImage, this.state.updatedProfileImage.name + "," + response.data.groupID)
        //             const config = {
        //                 headers: {
        //                     'content-type': 'multipart/form-data'
        //                 }
        //             }
        //             axios
        //                 .post(BACKEND_URL + '/groups/uploadprofileimage', formData, config).then((response) => {
        //                     this.setState({
        //                         profileImagePath: BACKEND_URL + '/images/grouppics/' + response.data.groupID + '/' + response.data.fileName

        //                     })

        //                 }).catch(err => {
        //                     toast.error("Error in image upload")
        //                 })
        //         }

        //     }).catch(err => {
        //         if (err.response == null) {

        //         }
        //         else
        //             toast.error(err.response.data);
        //     })

    }
    render() {
        return (
            <div>
                <h1 style={{ marginLeft: "500px" }}>Edit Group Details</h1>
                <div className="row" style={{ "height": "10vh" }}>
                </div>
                <div className="row" style={{ "height": "100vh" }}>
                    <div className="col-3"></div>
                    <div className="col-2">
                        <img src={this.state.profileImagePath} width="200" height="200" alt="" />
                        <div className="row">
                            <input style={{ "marginLeft": '20px', "marginTop": "30px" }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                        </div>
                    </div>
                    <div className="col-6">
                        <h3>Group's name</h3>
                        <form onSubmit={this.handleSubmit} id="Login">
                            <input placeholder={this.state.groupName} type="text" id="groupName" name="groupName" style={{ "width": "300px", "marginTop": "30px" }} onChange={this.handleInputChange} ></input>
                            <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "200px", "marginLeft": "10px" }} onSubmit={this.handleSubmit}>Save</button>

                        </form>
                        <ToastContainer />
                    </div>
                </div >
            </div >
        )
    }
}
export default EditGroup

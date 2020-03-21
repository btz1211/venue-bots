import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const apiUrl = 'https://72g9dg6lo7.execute-api.us-east-1.amazonaws.com/Prod/';

export default class NewJobModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModalError: false,
            modalErrorMessage: "",

            jobType: "google",
            location: "",
            radius: 1,
            query: "",
            limit: 1,
        }

        this.createJob = this.createJob.bind(this);
    }

    async createJob(event) {
        this.setState({blockUserAction: true})
        event.preventDefault();

        const params = {
            jobType: this.state.jobType,
            location: this.state.location,
            radius: this.state.radius,
            query: this.state.query,
            limit: this.state.limit,
        }

        // create job
        try {
            await axios.post(apiUrl + 'job', params);

            this.props.refreshJobData();
            this.props.handleHideModal();
        } catch (error) {
            this.setState({
                showModalError: true,
                modalErrorMessage: "Failed to create job, due to: " + error.response.data.message
            });
        } finally {
            this.setState({ blockUserAction: false });
        }
        
    }

    handleHideModalError = () => { this.setState({ showModalError: false }) }
    handleChangeJobType = (e) => { this.setState({ jobType: e.target.value }) }
    handleChangeLocation = (e) => { this.setState({ location: e.target.value }) }
    handleChangeRadius = (e) => { this.setState({ radius: e.target.value }) }
    handleChangeQuery = (e) => { this.setState({ query: e.target.value }) }
    handleChangeLimit = (e) => { this.setState({ limit: e.target.value }) }

    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.handleHideModal}>
                <ModalHeader>Create Venue Bot Job</ModalHeader>
                <Alert color="danger" isOpen={this.state.showModalError} toggle={this.handleHideModalError}>
                    {this.state.modalErrorMessage}
                </Alert>
                <form onSubmit={this.createJob}>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="jobType">Job Type</label>
                            <select multiple="" className="form-control" id="jobType"
                                onChange={this.handleChangeJobType}
                                value={this.state.jobType}>
                                <option>google</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input type="text" className="form-control"
                                id="locationHelp" aria-describedby="location"
                                placeholder="example: New York"
                                onChange={this.handleChangeLocation}
                                value={this.state.location} />
                            <small id="locationHelp" className="form-text text-muted">location to search for venues, use '|' as a delimiter for multiple locations
                                Example: 'queens | brooklyn'
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="radius">Radius</label>
                            <input type="text" className="form-control"
                                id="radius" aria-describedby="radiusHelp"
                                placeholder="example:1000"
                                onChange={this.handleChangeRadius}
                                value={this.state.radius} />
                            <small id="radiusHelp" className="form-text text-muted">radius around the location to search for venues (in meters)</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="query">Venue Type</label>
                            <input type="text" className="form-control"
                                id="query" aria-describedby="queryHelp"
                                placeholder="example: Korean BBQ"
                                onChange={this.handleChangeQuery}
                                value={this.state.query} />
                            <small id="queryHelp" className="form-text text-muted">type of venues to search for, use '|' as a delimiter for multiple types of venue
                                Example: 'cafe | restaurants'
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="limit">Limit</label>
                            <input type="text" className="form-control"
                                id="limit" aria-describedby="limitHelp"
                                placeholder="example: 20"
                                onChange={this.handleChangeLimit}
                                value={this.state.limit} />
                            <small id="limitHelp" className="form-text text-muted">this value limits # of posts to upload</small>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <input type="submit" value="Submit" color="primary"
                            className="btn btn-primary" />
                        <Button color="danger" onClick={this.props.handleHideModal}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}
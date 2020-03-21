import React, {Component} from 'react';
import axios from 'axios';
import { Alert} from 'reactstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import JobListItem from './job_list_item'
import NewJobModal from './new_job_modal'
import addButton from '../../assets/add.svg'
import refreshButton from '../../assets/refresh.svg'
import previousButton from '../../assets/previous.svg'
import nextButton from '../../assets/next.svg'

const apiUrl = 'https://72g9dg6lo7.execute-api.us-east-1.amazonaws.com/Prod/';

export default class JobList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            modal: false,
            blockUserAction: false,
            // error + info banner fields
            showError: false,
            errorMessage: "",
            showModalError: false,
            modalErrorMessage: "",
            showHint: false,
            hintMessage: "",
            // page nav fields
            previousTimestamps: [],
            currentTimestamp: Number.MAX_SAFE_INTEGER,
            nextTimestamp: "",
        }

        this.startJob = this.startJob.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.refreshJobData = this.refreshJobData.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleHideError = this.handleHideError.bind(this);
        this.handleHideHint = this.handleHideHint.bind(this);
        this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
        this.handleNextPageClick = this.handleNextPageClick.bind(this);
    }

    componentDidMount() {
        this.refreshJobData();
    }

    refreshJobData() {
        // block user until action is complete
        this.setState({blockUserAction: true})

        let input = {};
        if (this.state.currentTimestamp) {
            input = {
                params: {
                    timestamp: this.state.currentTimestamp
                }
            }
        }

        axios.get(apiUrl + 'jobs/google', input)
        .then(response => {
            
            if (response.data.LastEvaluatedKey) {
                this.setState({nextTimestamp: response.data.LastEvaluatedKey.jobTimestamp.N})
            }

            this.setState({
                jobs: response.data.Items
            })
        }).catch((error) => {
            this.setState({
                showError: true,
                errorMessage: 'Failed to refresh job data, due to: ' + error.response.data.message
            });
        }).finally(() => {
            this.setState({ blockUserAction: false });
        });
    }

    deleteJob(jobId) {
        // block user until action is complete
        this.setState({blockUserAction: true})

        axios.delete(apiUrl + 'job/' + jobId)
        .then(response => {
            console.log("successfully deleted: " + jobId);
            this.refreshJobData();
        }).catch((error) => {
            this.setState({
                blockUserAction: false,
                showError: true,
                errorMessage: "Failed to delete job, due to: " + error.response.data.message
            });
        }).finally(() => {
            this.setState({ blockUserAction: false });
        });
    }

    startJob(jobId) {
        // block user until action is complete
        this.setState({blockUserAction: true})

        axios.put(apiUrl + 'job/' + jobId  + '/start')
        .then(response => {
            this.refreshJobData();
            this.setState({
                showHint: true,
                hintMessage: response.data.message
            });
        }).catch((error) => {
            this.setState({
                showError: true,
                errorMessage: "Failed to update job, due to: " + error.response.data.message
            });
        }).finally(() => {
            this.setState({ blockUserAction: false });
        });

    }

    handleShowModal = () => { this.setState({ modal: true }) }
    handleHideModal = () => { this.setState({ modal: false }) }
    handleShowHint = () => { this.setState({ showHint: true }) }
    handleHideHint = () => { this.setState({ showHint: false }) }
    handleHideError = () => { this.setState({ showError: false }) }

    handleNextPageClick = () => { 
        if (this.state.nextTimestamp) {
            this.state.previousTimestamps.push(this.state.currentTimestamp);

            this.setState((prevState) => ({
                currentTimestamp: prevState.nextTimestamp,
                nextTimestamp: ""
            }), () => {
                this.refreshJobData();
            });

        }
    }

    handlePreviousPageClick = () => {
        if (this.state.previousTimestamps.length > 0) {
            this.setState((prevState) => ({
                currentTimestamp: prevState.previousTimestamps.pop()
            }), () => {
                this.refreshJobData();
            });
        }
    }

    render() {
        return(
            <div className="JobList">
                <BlockUi tag="div" blocking={this.state.blockUserAction}>
                
                <Alert color="danger" isOpen={this.state.showError} toggle={this.handleHideError}>
                    {this.state.errorMessage}
                </Alert>
                <Alert color="success" isOpen={this.state.showHint} toggle={this.handleHideHint}>
                    {this.state.hintMessage}
                </Alert>

                <img src={addButton} alt="add job button" 
                    className="JobList-icon JobList-add-job-icon icon" 
                    onClick={this.handleShowModal} />

                <img src={refreshButton} alt="refresh job button" 
                    className="JobList-icon JobList-refresh-jobs-icon icon"
                    onClick={this.refreshJobData} />

                <NewJobModal modal={this.state.modal} 
                    handleHideModal={this.handleHideModal}
                    refreshJobData={this.refreshJobData} />
                
                <table className="table table-hover">
                    <thead className="table-success">
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Query</th>
                        <th scope="col">Location</th>
                        <th scope="col">Radius</th>
                        <th scope="col">Limit</th>
                        <th scope="col">Post Count</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.jobs.map((job) => {
                            return <JobListItem job={job} 
                                key={job.jobId.S}
                                startJob={this.startJob} 
                                deleteJob={this.deleteJob}/>
                        })
                        }
                    </tbody>
                </table>
                <div className="pageNav">
                    {this.state.previousTimestamps.length > 0 ?
                        <img src={previousButton} alt="previous button" 
                        className="JobList-nav-icon JobList-previous-icon" 
                        onClick={this.handlePreviousPageClick} /> : <span/>
                     }

                    {this.state.nextTimestamp ?
                        <img src={nextButton} alt="next button" 
                            className="JobList-nav-icon JobList-next-icon"
                            onClick={this.handleNextPageClick} /> : <span/>
                    }

                </div>
                </BlockUi>
            </div>
        )
    }
}
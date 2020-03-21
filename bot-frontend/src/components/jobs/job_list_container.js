import React, {Component} from 'react';
import JobList from './job_list';

export default class JobListContainer extends Component {
    render() {
        return (
            <div className="JobListContainer">
                <JobList />
            </div>
        ) 
    }
}
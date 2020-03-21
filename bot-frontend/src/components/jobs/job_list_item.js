import React, {Component} from 'react';
import startButton from '../../assets/start.svg';
import deleteButton from '../../assets/delete.svg';

export default class JobListItem extends Component {
    constructor(props) {
        super(props);

        this.onStartButtonClick = this.onStartButtonClick.bind(this);
        this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
    }

    getValue(fieldName) {
        if (this.props.job[fieldName]) {
            const field = this.props.job[fieldName];
            if (field.S) {
                return field.S;
            }
            if (field.N) {
                return field.N;
            }
        } 
    }

    onStartButtonClick(event) {
        this.props.startJob(this.getValue('jobId'));
    }

    onDeleteButtonClick(event) {
        this.props.deleteJob(this.getValue('jobId'));
    }
    
    convertTimestampToDatetime(timestamp) {
        if (timestamp && timestamp !== "") {
            const dateTime = new Date(parseInt(timestamp, 10));
            return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();
        } else {
            return "";
        }
    }

    displayAction() {
        return (
            <div>
                <img src={startButton} alt="start button" className="JobListItem-icon JobListItem-start-icon icon" 
                    onClick={this.onStartButtonClick} />

                <img src={deleteButton} alt="delete button" className="JobListItem-icon JobListItem-delete-icon icon"
                    onClick={this.onDeleteButtonClick} />
             </div>    
        )
    }

    render() {
        return (
            <tr className="table">
                <th scope="row">{this.getValue('jobId')}</th>
                <td>{this.convertTimestampToDatetime(this.getValue('jobTimestamp'))}</td>
                <td>{this.getValue('query')}</td>
                <td>{this.getValue('location')}</td>
                <td>{this.getValue('radius')}</td> 
                <td>{this.getValue('limit')}</td>
                <td>{this.getValue('postCount')}</td>
                <td>{this.getValue('jobStatus')}</td>
                <td>{this.displayAction()}</td>
            </tr>
        )
    }
}
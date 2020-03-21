import React from 'react';
import './App.css';

import JobListContainer from './components/jobs/job_list_container';

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <span className="navbar-brand">Venue Bots</span>
      </nav>

      <JobListContainer />
    </div>
  );
}

export default App;

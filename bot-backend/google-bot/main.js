const lambda = require('./index.js');

const event = { jobId: "google-1581788060449" };
const context = {};
lambda.handler(event, context);
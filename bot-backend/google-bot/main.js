const lambda = require('./index.js');

const event = { jobId: "google-1584818420490" };
const context = {};
lambda.handler(event, context);

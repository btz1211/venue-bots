const lambda = require('./index.js');

const event = { jobId: "google-1583978999823" };
const context = {};
lambda.handler(event, context);
const lambda = require('./index.js');

const event = { jobId: "google-1584219334994" };
const context = {};
lambda.handler(event, context);

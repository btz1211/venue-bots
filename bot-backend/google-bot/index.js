const GoogleClient = require('./google.js');
const AWSClient = require('aws-client');

const googleAPIKeySecret = 'google-api-key';

exports.handler = async function (event, context) {
    let jobDetails;
    let postCount = 0;
    const awsClient = new AWSClient();

    try {
        jobDetails = await awsClient.getJob(event.jobId);
        if (Object.entries(jobDetails).length === 0) {
            throw Error(`Cannot find job with job id: ${event.jobId}`);
        }

        console.log(`Executing google job: ${JSON.stringify(jobDetails)}`);
        const limit = Math.min(60, parseInt(jobDetails.limit.N));

        // setup clients
        const googleApiKey = await awsClient.getSecret(googleAPIKeySecret);
        const googleClient = new GoogleClient(googleApiKey);

        // get venues based on job details
        const query = jobDetails.query.S + ' in ' + jobDetails.location.S;
        const venues = await googleClient.browseVenues(query, jobDetails.radius.N, limit);

        for (let venue of venues) {

            // process only the venues with photos
            if (venue.photos && venue.photos.length > 0) {

                try {
                    const locationText = venue.name;
                    const locationAddress = venue.formatted_address;
                    const venueInfo = await googleClient.getVenueInfo(venue.place_id);

                    // console.log(venueInfo);

                    // post only if there are reviews + photos for the post
                    if (venueInfo.reviews && venueInfo.reviews.length > 0 && venueInfo.photos && venueInfo.photos.length > 0) {
                        // simply print out the venue for demonstration purposes
                        // data can be used to post to an actual API
                        console.log(`location text: ${locationText}`);
                        console.log(`location address: ${locationAddress}}`);
                        console.log(`review: ${venueInfo.reviews[0].text}`);
                        console.log("\n");

                        if (++postCount >= limit) {
                            break;
                        }                        
    
                        // break from outer for loop if postCount exceeded limit
                        if (postCount >= limit) {
                            break;
                        }
                    }
                } catch (error) {
                    console.error(`[ERROR] - failed to post venue: [${venue.name}], due to:`);
                    logError(error);                
                }
            }
        }

        console.log(`[INFO] - job: [${event.jobId}] is complete, uploaded [${postCount}] posts`);
        postCount = parseInt(jobDetails.postCount.N) + postCount;
    } catch (error) {
        logError(error);
    } finally {
        if (Object.entries(jobDetails).length !== 0) {
            await awsClient.completeJob(jobDetails.jobType.S, jobDetails.jobTimestamp.N, postCount);
        }
    }
}

function logError(error) {
    // print api error response if it's a network error
    // else print stacktrace
    if (error.response) {
        console.error(`[ERROR] - api called failed: ${error.response.config.url}`);
        console.error(error.response.data);
    } else {
        console.error(error);
    }
}

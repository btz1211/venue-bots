'use strict';

const axios = require('axios');

const placeUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const photoUrl = 'https://maps.googleapis.com/maps/api/place/photo';
const placeDetailUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
const defaultPhotoMaxWidth = 500;

module.exports = class GoogleClient {
    constructor(key) {
        this.key = key;
    }

    async browseVenues(query, radius, limit) {
        let pageToken;
        let results = [];

        do {
            const data = await this.getVenuesBatch(query, radius, pageToken);

            results = results.concat(data.results);
            pageToken = data.next_page_token;
    
            // wait for 5 seconds before calling with page token
            // it takes a few seconds before the token becomes effectivce
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
        } while (pageToken && results.length < limit);
    
        return results;
    }

    getVenueInfo(venueId) {
        const params = {
            key: this.key,
            place_id: venueId,
            fields: 'reviews,photos'
        }

        return axios.get(placeDetailUrl, { params: params })
            .then(response => {
                return response.data.result;
            })
    }

    async getPhoto(photoReference) {
        const params = {
            key: this.key,
            photoreference: photoReference,
            maxwidth: defaultPhotoMaxWidth,
        }

        return axios.get(photoUrl, { params: params, responseType: 'stream' }
        ).then(response => {
            response.data.path = photoReference.substring(0, 15) + '.jpg';
            return response.data
        });
    }

    getVenuesBatch(query, radius, pageToken) {
        // build query params
        const params = {
            key: this.key,
            query: query,
            radius: radius,
            pagetoken: pageToken,
            fields: 'name,photos,formatted_address,place_id'
        }

        return axios.get(placeUrl, { params: params })
            .then(response => {
                if (response.data.error_message) {
                    console.log(response.data);
                }
                return response.data;
            })
    }
}
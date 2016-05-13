'use strict';


var preq = require('preq');
var sUtil = require('../lib/util');
var Template = require('swagger-router').Template;

var HTTPError = sUtil.HTTPError;


/**
 * Calls the MW API with the supplied query as its body
 *
 * @param {Object} app the application object
 * @param {string} domain the domain to issue the request to
 * @param {Object} query an object with all the query parameters for the MW API
 * @return {Promise} a promise resolving as the response object from the MW API
 */
function mwApiGet(app, domain, query) {

    var request = new Template(app.conf.mwapi_req).expand({
        request: {
            params: { domain: domain },
            headers: { 'user-agent': app.conf.user_agent },
            query: query
        }
    });

    return preq(request).then(function(response) {
        if(response.status < 200 || response.status > 399) {
            // there was an error when calling the upstream service, propagate that
            throw new HTTPError({
                status: response.status,
                type: 'api_error',
                title: 'MW API error',
                detail: response.body
            });
        }
        return response;
    });
}


module.exports = {
    mwApiGet: mwApiGet
};


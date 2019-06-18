'use strict';

const BBPromise = require('bluebird');
const domino = require('domino');
const sUtil = require('../lib/util');
const apiUtil = require('../lib/api-util');

// shortcut
const HTTPError = sUtil.HTTPError;

/**
 * The main router object
 */
const router = sUtil.router();

/**
 * GET /siteinfo{/prop}
 * Fetches site info for the given domain, optionally
 * returning only the specified property. This example shows how to:
 * 1) use named URI parameters (by prefixing them with a colon)
 * 2) use optional URI parameters (by suffixing them with a question mark)
 * 3) extract URI parameters
 * 4) issue external requests
 * 5) use Promises to achieve (4) and return the result
 *
 * For more info about routing see http://expressjs.com/guide/routing.html
 *
 * There are multiple ways of calling this endpoint:
 * 1) GET /{domain}/v1/siteinfo/
 * 2) GET /{domain}/v1/siteinfo/mainpage (or other props available in
 *      the general siprop, as supported by MWAPI)
 */
router.get('/siteinfo/:prop?', (req, res) => {

    // construct the query for the MW Action API
    const apiQuery = {
        action: 'query',
        meta: 'siteinfo'
    };

    // send it
    return apiUtil.mwApiGet(req, apiQuery)
    // and then return the result to the caller
    .then((apiRes) => {
        // do we have to return only one prop?
        if (req.params.prop) {
            // check it exists in the response body
            if (apiRes.body.query.general[req.params.prop] === undefined) {
                // nope, error out
                throw new HTTPError({
                    status: 404,
                    type: 'not_found',
                    title: 'No such property',
                    detail: `Property ${req.params.prop} not found in MW API response!`
                });
            }
            // ok, return that prop
            const ret = {};
            ret[req.params.prop] = apiRes.body.query.general[req.params.prop];
            res.status(200).json(ret);
            return;
        }
        // set the response code as returned by the MW API
        // and return the whole response (contained in body.query.general)
        res.status(200).json(apiRes.body.query.general);
    });

});

/*
 *  PAGE MASSAGING SECTION
 */

/**
 * A helper function that obtains the Parsoid HTML for a given title and
 * loads it into a domino DOM document instance.
 * @param {!Object} req the incoming request
 * @return {Promise} a promise resolving as the HTML element object
 */
function getBody(req) {

    // get the page
    return apiUtil.restApiGet(req, `page/html/${req.params.title}`)
    .then((callRes) => {
        // and then load and parse the page
        return BBPromise.resolve(domino.createDocument(callRes.body));
    });

}

/**
 * GET /page/{title}
 * Gets the body of a given page.
 */
router.get('/page/:title', (req, res) => {

    // get the page's HTML directly
    return getBody(req)
    // and then return it
    .then((doc) => {
        res.status(200).type('html').end(doc.body.innerHTML);
    });

});

/**
 * GET /page/{title}/lead
 * Gets the leading section of a given page.
 */
router.get('/page/:title/lead', (req, res) => {

    // get the page's HTML directly
    return getBody(req)
    // and then find the leading section and return it
    .then((doc) => {
        let leadSec = '';
        // find all paragraphs directly under the content div
        const ps = doc.querySelectorAll('p') || [];
        for (let idx = 0; idx < ps.length; idx++) {
            const child = ps[idx];
            // find the first paragraph that is not empty
            if (!/^\s*$/.test(child.innerHTML)) {
                // that must be our leading section
                // so enclose it in a <div>
                leadSec = `<div id="lead_section">${child.innerHTML}</div>`;
                break;
            }
        }
        res.status(200).type('html').end(leadSec);
    });

});

module.exports = (appObj) => {

    return {
        path: '/',
        api_version: 1,
        router
    };

};

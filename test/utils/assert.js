'use strict';

const { assert } = require('chai');

/**
 * Asserts whether the return status was as expected
 *
 * @param {Object} res
 * @param {integer} expected
 */
function status(res, expected) {

    assert.deepEqual(res.status, expected,
        `Expected status to be ${expected}, but was ${res.status}`);

}

/**
 * Asserts whether content type was as expected
 *
 * @param {Object} res
 * @param {string} expectedRegexString
 */
function contentType(res, expectedRegexString) {

    const actual = res.headers['content-type'];
    assert.ok(RegExp(expectedRegexString).test(actual),
        `Expected content-type to match ${expectedRegexString}, but was ${actual}`);

}

function fails(promise, onRejected) {

    let failed = false;

    function trackFailure(e) {
        failed = true;
        return onRejected(e);
    }

    function check() {
        if (!failed) {
            throw new Error('expected error was not thrown');
        }
    }

    return promise.catch(trackFailure).then(check);

}

module.exports.assert = assert;
module.exports.assert.contentType = contentType;
module.exports.assert.status = status;
module.exports.assert.fails = fails;

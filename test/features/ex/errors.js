'use strict';

const preq   = require('preq');
const assert = require('../../utils/assert.js');
const Server = require('../../utils/server.js');

describe('errors', function () {
    this.timeout(20000);

    let uri = null;
    const server = new Server();

    before(() => {
        return server.start()
        .then(() => {
            uri = `${server.config.uri}ex/err/`;
        });
    });

    after(() => server.stop());

    it('array creation error', () => {
        return preq.get({
            uri: `${uri}array`
        }).then((res) => {
            // if we are here, no error was thrown, not good
            throw new Error(`Expected an error to be thrown, got status: ${res.status}`);
        }, (err) => {
            // inspect the status
            assert.deepEqual(err.status, 500);
            // check the error title
            assert.deepEqual(err.body.title, 'RangeError');
        });
    });

    it('file read error', () => {
        return preq.get({
            uri: `${uri}file`
        }).then((res) => {
            // if we are here, no error was thrown, not good
            throw new Error(`Expected an error to be thrown, got status: ${res.status}`);
        }, (err) => {
            // inspect the status
            assert.deepEqual(err.status, 500);
            // check the error title
            assert.deepEqual(err.body.title, 'Error');
        });
    });

    it('constraint check error', () => {
        return preq.get({
            uri: `${uri}manual/error`
        }).then((res) => {
            // if we are here, no error was thrown, not good
            throw new Error(`Expected an error to be thrown, got status: ${res.status}`);
        }, (err) => {
            // inspect the status
            assert.deepEqual(err.status, 500);
            // check the error title
            assert.deepEqual(err.body.title, 'Error');
        });
    });

    it('access denied error', () => {
        return preq.get({
            uri: `${uri}manual/deny`
        }).then((res) => {
            // if we are here, no error was thrown, not good
            throw new Error(`Expected an error to be thrown, got status: ${res.status}`);
        }, (err) => {
            // inspect the status
            assert.deepEqual(err.status, 403);
            // check the error title
            assert.deepEqual(err.body.type, 'access_denied');
        });
    });

    it('authorisation error', () => {
        return preq.get({
            uri: `${uri}manual/auth`
        }).then((res) => {
            // if we are here, no error was thrown, not good
            throw new Error(`Expected an error to be thrown, got status: ${res.status}`);
        }, (err) => {
            // inspect the status
            assert.deepEqual(err.status, 401);
            // check the error title
            assert.deepEqual(err.body.type, 'unauthorized');
        });
    });
});

'use strict';

const preq = require( 'preq' );
const assert = require( '../../utils/assert.js' );
const Server = require( '../../utils/server.js' );

describe( 'wiki site info', function () {

	this.timeout( 20000 );

	let uri = null;
	const server = new Server();

	before( () => server.start()
		.then( () => {
			uri = `${ server.config.uri }en.wikipedia.org/v1/siteinfo/`;
		} ) );

	after( () => server.stop() );

	it( 'should get all general enwiki site info', () => preq.get( {
		uri
	} ).then( ( res ) => {
		// check the status
		assert.status( res, 200 );
		// check the returned Content-Type header
		assert.contentType( res, 'application/json' );
		// inspect the body
		assert.notDeepEqual( res.body, undefined, 'No body returned!' );
		assert.notDeepEqual( res.body.server, undefined, 'No server field returned!' );
	} ) );

	it( 'should get the mainpage setting of enwiki', () => preq.get( {
		uri: `${ uri }mainpage`
	} ).then( ( res ) => {
		// check the status
		assert.status( res, 200 );
		// check the returned Content-Type header
		assert.contentType( res, 'application/json' );
		// inspect the body
		assert.notDeepEqual( res.body, undefined, 'No body returned!' );
		assert.deepEqual( res.body.mainpage, 'Main Page', 'enwiki mainpage mismatch!' );
	} ) );

	it( 'should fail to get a non-existent setting of enwiki', () => preq.get( {
		uri: `${ uri }dummy_wiki_setting`
	} ).then( ( res ) => {
		// if we are here, no error was thrown, not good
		throw new Error( `Expected an error to be thrown, got status: ${ res.status }` );
	}, ( err ) => {
		// inspect the status
		assert.deepEqual( err.status, 404 );
	} ) );

	it( 'should fail to get info from a non-existent wiki', () => preq.get( {
		uri: `${ server.config.uri }non.existent.wiki/v1/siteinfo/`
	} ).then( ( res ) => {
		// if we are here, no error was thrown, not good
		throw new Error( `Expected an error to be thrown, got status: ${ res.status }` );
	}, ( err ) => {
		// inspect the status
		assert.deepEqual( err.status, 504 );
	} ) );
} );

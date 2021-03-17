var chai = require( 'chai' )
var chaiHttp = require( 'chai-http' );

chai.use( chaiHttp );

var expect = chai.expect;

it( "Login Api returning correct credentials(POST)", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .post( '/users/login' )
        .send( { "email": "test@gmail.com", "password": "test"} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )

it( "Retrieve the recent activities based on values selected(data passed using POST)", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .post( '/groups/recentactivitybygroups' )
        .send( {"userID": "23", "groupID": "90","orderBy":"desc"} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
it( "Should get the data of a particular group(GET)", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .get( '/groups/groupbyid/58' )
        .send( {} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
it( "Should get the total owing of a particular user(GET)", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .get( '/expense/totalgiving/58' )
        .send( {} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
it( "Should update the type of a particular group member(PUT) ", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .put( '/groups/invite/' )
        .send({ "userID": "23", "groupID": "90","type":"accept"} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
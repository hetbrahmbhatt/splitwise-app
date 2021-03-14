var chai = require( 'chai' )
var chaiHttp = require( 'chai-http' );

chai.use( chaiHttp );

var expect = chai.expect;

it( "Login Api returning correct credentials", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .post( '/users/login' )
        .send( { "email": "babita@gmail.com", "password": "babita"} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )

it( "Should get the recent activity of a particular user in a particular group", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .post( '/groups/recentactivitybygroups' )
        .send( {"userID": "23", "groupID": "90","orderBy":"desc"} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
it( "Should get the data of a particular group", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .get( '/groups/groupbyid/58' )
        .send( {} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
it( "Should get the total owing of a particular user", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .get( '/expense/totalgiving/58' )
        .send( {} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
it( "Should update the type of a particular group member ", function ( done ) {
    chai.request( 'http://localhost:4006' )
        .put( '/groups/invite/' )
        .send({ "userID": "23", "groupID": "90","type":"accept"} )
        .end( function ( err, res ) {
            expect(err).to.be.null;
            expect( res ).to.have.status( 200 );
            done();
        } );
} )
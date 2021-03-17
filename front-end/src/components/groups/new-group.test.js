import React from 'react';
import { shallow } from 'enzyme';
import {NewGroup} from './new-group';
describe( 'NewGroup', () => {
    it( 'check if all events by  a particular restaurant are received', async ( done ) => {
        component
            .instance()
            .componentDidMount()
            .then( () => {
                // console.log( component.state().Events )
                // expect( component.state().NewGroup ).toEqual( groupsData )
                done()
            } )
        expect( component ).toMatchSnapshot();
    } );

} )

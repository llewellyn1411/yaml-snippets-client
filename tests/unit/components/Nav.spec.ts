import { shallowMount } from '@vue/test-utils';
import Nav from '../../../src/components/Nav.vue';

describe( 'Nav.vue', () => {
    test( 'should display shell if the app is not ready', () => {
        const wrapper = shallowMount( Nav, {
            stubs: [ 'router-link' ],
            propsData: {
                isAppReady: false
            }
        } );

        expect( wrapper.find( '.navbar' ).exists() ).toBe( true );
        expect( wrapper.find( '.menu-items' ).exists() ).toBe( false );
    } );

    test( 'should display the menu if the app is ready', () => {
        const wrapper = shallowMount( Nav, {
            stubs: [ 'router-link' ],
            propsData: {
                isAppReady: true
            }
        } );

        expect( wrapper.find( '.navbar' ).exists() ).toBe( true );
        expect( wrapper.find( '.menu-items' ).exists() ).toBe( true );
    } );

    test( 'should display the signed out menu', () => {
        const wrapper = shallowMount( Nav, {
            stubs: [ 'router-link' ],
            propsData: {
                isAppReady: true
            }
        } );

        expect( wrapper.find( '.btn.sign-in' ).exists() ).toBe( true );
        expect( wrapper.find( '.btn.sign-out' ).exists() ).toBe( false );
    } );

    test( 'should display the signed in menu', () => {
        const wrapper = shallowMount( Nav, {
            stubs: [ 'router-link' ],
            propsData: {
                isAppReady: true,
                isLoggedIn: true
            }
        } );

        expect( wrapper.find( '.btn.sign-in' ).exists() ).toBe( false );
        expect( wrapper.find( '.btn.sign-out' ).exists() ).toBe( true );
    } );

    test( 'should call onSignOut', () => {
        const callback = jest.fn();
        const wrapper = shallowMount( Nav, {
            stubs: [ 'router-link' ],
            propsData: {
                isAppReady: true,
                isLoggedIn: true,
                onSignOut: callback
            }
        } );

        wrapper.find( '.btn.sign-out' ).trigger( 'click' );
        expect( callback ).toHaveBeenCalled();
    } );
} );

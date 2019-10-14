import { shallowMount } from '@vue/test-utils';
import Toast from '../../../src/components/Toast.vue';

describe( 'Toast.vue', () => {
    const closeFunc = jest.fn();
    const wrapper = shallowMount( Toast, {
        propsData: {
            visible: true,
            title: 'This is a toast',
            message: 'Do as it says',
            type: 'success',
            onClose: closeFunc
        }
    } );

    test( 'should show a toast', () => {
        expect( wrapper.find( '.toast-wrapper' ).exists() ).toBe( true );
        expect( wrapper.find( '.toast.toast-success' ).exists() ).toBe( true );
        expect( wrapper.find( '.title' ).text() ).toEqual( 'This is a toast' );
        expect( wrapper.find( '.message' ).text() ).toEqual( 'Do as it says' );
        expect( wrapper.html() ).toMatchSnapshot();
    } );

    test( 'should close a toast', () => {
        wrapper.find( 'button' ).trigger( 'click' );
        expect( closeFunc ).toHaveBeenCalled();
        expect( wrapper.find( 'toast-wrapper' ).exists() ).toBe( false );
    } );
} );

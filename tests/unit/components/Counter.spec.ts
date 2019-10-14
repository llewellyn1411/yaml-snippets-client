import { shallowMount } from '@vue/test-utils';
import Counter from '../../../src/components/Counter.vue';

describe( 'Counter.vue', () => {
    const wrapper = shallowMount( Counter, {
        propsData: {
            value: 987,
            label: 'things'
        }
    } );

    test( `renders correctly`, () => {
        expect( wrapper.html() ).toMatchSnapshot();
    } );

    test( 'should have a label', () => {
        const label = wrapper.find( '.counter-label' );
        expect( label.is( 'div' ) ).toBeTruthy();
        expect( label.text() ).toEqual( 'things' );
    } );

    test( 'should have a value', () => {
        const value = wrapper.find( '.counter-value' );
        expect( value.is( 'div' ) ).toBeTruthy();
        expect( value.text() ).toEqual( '987' );
    } );
} );

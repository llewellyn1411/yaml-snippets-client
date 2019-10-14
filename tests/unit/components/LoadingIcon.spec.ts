import { shallowMount } from '@vue/test-utils';
import LoadingIcon from '../../../src/components/LoadingIcon.vue';

describe( 'LoadingIcon.vue', () => {
    test( 'should render correctly', () => {
        const wrapper = shallowMount( LoadingIcon, { propsData: { visible: true } } );
        expect( wrapper.html() ).toMatchSnapshot();
    } );

    test( 'should render when visible prop is true', () => {
        const wrapper = shallowMount( LoadingIcon, { propsData: { visible: true } } );
        expect( wrapper.find( '.loading' ).exists() ).toBe( true );
    } );

    test( 'should not render when visible prop is false', () => {
        const wrapper = shallowMount( LoadingIcon, { propsData: { visible: false } } );
        expect( wrapper.find( '.loading' ).exists() ).toBe( false );
    } );
} );

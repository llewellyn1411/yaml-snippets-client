import { shallowMount } from '@vue/test-utils';
import faker from 'faker';
import SnippetItem from '../../../src/components/SnippetItem.vue';

describe( 'SnippetItem.vue', () => {
    test( 'should display a snippet list item', () => {
        const propsData = {
            uid: faker.random.uuid(),
            id: faker.random.uuid(),
            name: faker.random.word(),
            author: faker.random.word(),
            description: faker.lorem.paragraph(),
            countStar: faker.random.number()
        };

        const wrapper = shallowMount( SnippetItem, {
            stubs: [ 'router-link' ],
            propsData
        } );

        expect( wrapper.find( '.snippet-list-item' ).exists() ).toBe( true );
        expect( wrapper.find( '.title' ).text() ).toEqual( propsData.name );
        expect( wrapper.find( '.author' ).text() ).toEqual( propsData.author );
        expect( wrapper.find( '.description' ).text() ).toEqual( propsData.description );

        expect( wrapper.find( '.btn.customise' ).exists() ).toBe( true );
        expect( wrapper.find( '.btn.edit' ).exists() ).toBe( false );
        expect( wrapper.find( '.btn.delete' ).exists() ).toBe( false );

        expect( wrapper.find( '.star' ).exists() ).toBe( false );
    } );

    test( 'should display a user created snippet list item', () => {
        const propsData = {
            uid: faker.random.uuid(),
            id: faker.random.uuid(),
            name: faker.random.word(),
            author: faker.random.word(),
            description: faker.lorem.paragraph(),
            countStar: faker.random.number(),
            editable: true
        };

        const wrapper = shallowMount( SnippetItem, {
            stubs: [ 'router-link' ],
            propsData
        } );

        expect( wrapper.find( '.btn.customise' ).exists() ).toBe( true );
        expect( wrapper.find( '.btn.edit' ).exists() ).toBe( true );
        expect( wrapper.find( '.btn.delete' ).exists() ).toBe( true );
    } );
} );

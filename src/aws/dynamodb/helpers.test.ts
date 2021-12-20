import { getUpdateExpression, getExpressionAttributeValues, getExpressionAttributeNames } from './helpers';

describe('Helpers', () => {
  describe('getUpdateExpression()', () => {
    describe('when item is an empty object', () => {
      test('it returns an empty string', () => {
        expect(getUpdateExpression({})).toBe('');
      });
    });

    describe('when item has one property', () => {
      test('it returns an update expression with that one property', () => {
        expect(
          getUpdateExpression({
            name: 'foo',
          }),
        ).toBe('SET #name = :name');
      });
    });

    describe('when item has many properties', () => {
      test('it returns an update expression with all these properties', () => {
        expect(
          getUpdateExpression({
            name: 'foo',
            content: 'bar',
          }),
        ).toBe('SET #name = :name, #content = :content');
      });
    });
  });

  describe('getExpressionAttributeValues()', () => {
    describe('when item is an empty object', () => {
      test('it returns an empty object', () => {
        expect(getExpressionAttributeValues({})).toEqual({});
      });
    });

    describe('when item a single property', () => {
      test('it returns an expression attribute value for that property', () => {
        expect(
          getExpressionAttributeValues({
            name: 'foo',
          }),
        ).toEqual({
          ':name': 'foo',
        });
      });
    });

    describe('when item has many properties', () => {
      test('it returns expression attribute values for all these properties', () => {
        expect(
          getExpressionAttributeValues({
            name: 'foo',
            content: 'bar',
          }),
        ).toEqual({
          ':name': 'foo',
          ':content': 'bar',
        });
      });
    });
  });

  describe('getExpressionAttributeNames()', () => {
    describe('when item is an empty object', () => {
      test('it returns an empty object', () => {
        expect(getExpressionAttributeNames({})).toEqual({});
      });
    });

    describe('when item a single property', () => {
      test('it returns an expression attribute name for that property', () => {
        expect(
          getExpressionAttributeNames({
            name: 'foo',
          }),
        ).toEqual({
          '#name': 'name',
        });
      });
    });

    describe('when item has many properties', () => {
      test('it returns expression attribute names for all these properties', () => {
        expect(
          getExpressionAttributeNames({
            name: 'foo',
            content: 'bar',
          }),
        ).toEqual({
          '#name': 'name',
          '#content': 'content',
        });
      });
    });
  });
});

import {
  compareDates,
  listUniqueValues,
  showAggregatedFromListUniqueValues,
} from './utils';

it('should compare dates', () => {
  expect(compareDates('2019-09-10T00:00:00~2019-09-14T00:00:00')).toEqual(-1);
  expect(compareDates('2019-09-16T00:00:00~2019-09-14T00:00:00')).toEqual(1);
  expect(compareDates('2019-09-10T00:00:00~2019-09-10T00:00:00')).toEqual(0);
});

it('should list unique values', () => {
  expect(listUniqueValues(['a', 'b', 'c', 'd', 'a', 'b', 'c'])).toEqual([
    'a',
    'b',
    'c',
    'd',
  ]);

  expect(listUniqueValues(['a', 'a', 'a'])).toEqual(['a']);
});

it('should show aggregated', () => {
  expect(
    showAggregatedFromListUniqueValues({ value: ['a', 'b', 'c'] })
  ).toEqual(JSON.stringify(['a', 'b', 'c']));

  expect(showAggregatedFromListUniqueValues({ value: ['a'] })).toEqual('a');
});

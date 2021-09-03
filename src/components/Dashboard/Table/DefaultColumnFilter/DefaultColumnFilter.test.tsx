import renderer from 'react-test-renderer';
import DefaultColumnFilter from './';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <DefaultColumnFilter
        column={{
          filterValue: 'filter',
          preFilteredRows: [],
          setFilter: () => {},
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly - some prefiltered rows', () => {
  const tree = renderer
    .create(
      <DefaultColumnFilter
        column={{
          filterValue: 'f',
          preFilteredRows: [{ a: 1 }, { b: 2 }],
          setFilter: () => {},
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

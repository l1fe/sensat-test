import renderer from 'react-test-renderer';
import Table from './';

it('renders correctly - with empty sensor readings', () => {
  const tree = renderer
    .create(<Table sensorReadings={[]} loading={false} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly - when loading', () => {
  const tree = renderer
    .create(<Table sensorReadings={[]} loading={true} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly - when error', () => {
  const tree = renderer
    .create(
      <Table
        sensorReadings={[]}
        loading={false}
        error="There is some mess going on"
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly - with some sensor readings', () => {
  const tree = renderer
    .create(
      <Table
        sensorReadings={[
          {
            id: 'Box-A1-O3',
            box_id: 'Box-A1',
            sensor_type: 'O3',
            unit: 'ppm',
            name: 'Ozone',
            range_l: 0.0,
            range_u: 1000.0,
            longitude: -0.06507,
            latitude: 51.51885,
            reading: 672,
            reading_ts: '2019-09-10T00:00:00',
          },
          {
            id: 'Box-A1-NO2',
            box_id: 'Box-A1',
            sensor_type: 'NO2',
            unit: 'ppm',
            name: 'Nitrogen dioxide',
            range_l: 0.0,
            range_u: 1000.0,
            longitude: -0.06507,
            latitude: 51.51885,
            reading: 193,
            reading_ts: '2019-09-10T00:00:00',
          },
        ]}
        loading={false}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

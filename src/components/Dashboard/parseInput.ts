import { SensorReading } from '../../types';

const parseInput = (str: string): Array<SensorReading | {}> => {
  const parsed: Array<SensorReading | {}> = str
    .split('\n')
    .filter((str) => str.length)
    .map((str) => {
      try {
        const json: SensorReading = JSON.parse(str);
        // Append Z in order to parse the date as UTC
        json.reading_ts = new Date(`${json.reading_ts}Z`);
        return json;
      } catch (err) {
        return {};
      }
    });

  return parsed;
};

export default parseInput;

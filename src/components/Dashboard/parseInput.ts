import { SensorReading } from '../../types';

const parseInput = (str: string): Array<SensorReading | {}> => {
  const parsed: Array<SensorReading | {}> = str
    .split('\n')
    .filter((str) => str.length)
    .map((str) => {
      try {
        const json: SensorReading = JSON.parse(str);
        return json;
      } catch (err) {
        return {};
      }
    });

  return parsed;
};

export default parseInput;

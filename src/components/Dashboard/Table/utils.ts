import memoize from 'fast-memoize';
import { Row } from 'react-table';

const encodeMemoArg = (a: string, b: string): string => `${a}~${b}`;
const decodeMemoArg = (str: string): string[] => str.split(`~`);

export const compareDates = memoize((compareStr: string): number => {
  const [a, b] = decodeMemoArg(compareStr);

  if (!a) {
    return -1;
  }

  if (!b) {
    return 1;
  }

  const aDate = new Date(`${a}Z`);
  const bDate = new Date(`${b}Z`);

  const aTime = aDate.getTime();
  const bTime = bDate.getTime();

  return aTime === bTime ? 0 : aTime > bTime ? 1 : -1;
});

export const datetimeCompare = (
  rowA: Row,
  rowB: Row,
  columnId: string
): number => {
  let [a, b] = [rowA.values[columnId], rowB.values[columnId]];

  return compareDates(encodeMemoArg(a, b));
};

export const listUniqueValues = memoize((values: string[]): string[] => {
  const set = new Set();
  for (const val of values) {
    set.add(val);
  }
  const res = Array.from(set) as string[];

  return res;
});

export const showAggregatedFromListUniqueValues = ({
  value,
}: {
  value: string[];
}): string => (value.length > 1 ? JSON.stringify(value) : value[0]);

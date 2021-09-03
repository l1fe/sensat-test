import React, { useMemo } from 'react';
import memoize from 'fast-memoize';
import {
  useTable,
  useBlockLayout,
  useSortBy,
  Column,
  useFilters,
  useGroupBy,
  useExpanded,
  Row,
} from 'react-table';
import { FixedSizeList } from 'react-window';

import { SensorReading } from '../../../types';
import { TContainer, THeader, TBody, Tr, Td, Th } from './styles';
import DefaultColumnFilter from './DefaultColumnFilter';
export interface TableProps {
  sensorReadings: Array<SensorReading | {}>;
  loading: boolean;
  error?: string;
}

export const compareDates = memoize((a: string, b: string): number => {
  if (!a) {
    return -1;
  }

  if (!b) {
    return 1;
  }

  const aDate = new Date(`${a}Z`);
  const bDate = new Date(`${a}Z`);

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

  return compareDates(a, b);
};

export const TABLE_HEIGHT_PX = 600;
export const ROW_HEIGHT_PX = 66;

export const Table: React.FC<TableProps> = ({
  sensorReadings,
  loading,
  error,
}) => {
  const columns = useMemo(
    () =>
      [
        {
          Header: 'ID',
          accessor: 'id',
        },
        {
          Header: 'Box ID',
          accessor: 'box_id',
        },
        {
          accessor: 'sensor_type',
          Header: 'Type of the sensor',
          disableSortBy: false,
          disableFilters: false,
          disableGroupBy: false,
        },
        {
          Header: 'Type of data',
          accessor: 'name',
          disableFilters: false,
        },
        {
          Header: 'Range',
          columns: [
            {
              Header: 'Lower bound',
              accessor: 'range_l',
            },
            {
              Header: 'Upper bound',
              accessor: 'range_u',
            },
          ],
        },
        {
          Header: 'Geolocation',
          columns: [
            {
              Header: 'Latitude',
              accessor: 'latitude',
            },
            {
              Header: 'Longitude',
              accessor: 'longitude',
            },
          ],
        },
        {
          Header: 'Measurement unit',
          accessor: 'unit',
        },
        {
          Header: 'Timestamp',
          accessor: 'reading_ts',
          sortType: datetimeCompare,
          disableSortBy: false,
          Cell: (props) => {
            if (!props.value) {
              return null;
            }

            const date = new Date(`${props.value}Z`);
            const formatted = date.toUTCString();
            return <span>{formatted}</span>;
          },
        },
      ] as Column<SensorReading | {}>[],
    []
  );

  const defaultColumn: Partial<Column<SensorReading | {}>> = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      disableFilters: true,
      disableSortBy: true,
      disableGroupBy: true,
      width: 150,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data: sensorReadings,
      defaultColumn,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    useBlockLayout
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <Tr
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell) => {
            return (
              <Td {...cell.getCellProps()}>
                {' '}
                {cell.isGrouped ? (
                  // If it's a grouped cell, add an expander and row count
                  <>
                    <span {...row.getToggleRowExpandedProps()}>
                      {row.isExpanded ? '👇' : '👉'}
                    </span>{' '}
                    {cell.render('Cell')} ({row.subRows.length})
                  </>
                ) : cell.isAggregated ? (
                  // If the cell is aggregated, use the Aggregated
                  // renderer for cell
                  cell.render('Aggregated')
                ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                  // Otherwise, just render the regular cell
                  cell.render('Cell')
                )}
              </Td>
            );
          })}
        </Tr>
      );
    },
    [prepareRow, rows]
  );

  return (
    <TContainer {...getTableProps()}>
      <THeader>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                canSort={column.canSort}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </Th>
            ))}
          </Tr>
        ))}
        {headerGroups.length > 0 && (
          <Tr {...headerGroups[1].getHeaderGroupProps()} key="Filtering">
            {headerGroups[1].headers.map((column) => (
              <Th {...column.getHeaderProps()}>
                {column.canFilter ? column.render('Filter') : null}
              </Th>
            ))}
          </Tr>
        )}

        {headerGroups.length > 0 && (
          <Tr {...headerGroups[1].getHeaderGroupProps()} key="Aggregation">
            {headerGroups[1].headers.map((column) => (
              <Th {...column.getHeaderProps()}>
                {column.canGroupBy ? (
                  <span {...column.getGroupByToggleProps()}>
                    {column.isGrouped ? 'Exit aggregation🛑 ' : 'Aggregate👊'}
                  </span>
                ) : null}
              </Th>
            ))}
          </Tr>
        )}
      </THeader>

      <TBody {...getTableBodyProps()}>
        {rows.length > 0 ? (
          <FixedSizeList
            height={TABLE_HEIGHT_PX}
            itemCount={rows.length}
            itemSize={ROW_HEIGHT_PX}
            width={totalColumnsWidth}
          >
            {RenderRow}
          </FixedSizeList>
        ) : (
          <Tr empty>
            {loading ? 'Loading' : 'No data was found'}
            {error && `[Got an error: ${error}]`}
          </Tr>
        )}
      </TBody>
    </TContainer>
  );
};

export default Table;

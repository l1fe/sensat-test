import React, { useMemo } from 'react';
import {
  useTable,
  useBlockLayout,
  useSortBy,
  Column,
  useFilters,
  useGroupBy,
  useExpanded,
} from 'react-table';
import { FixedSizeList } from 'react-window';

import { SensorReading } from '../../../types';
import { TContainer, THeader, TBody, Tr, Td, Th } from './styles';
import {
  datetimeCompare,
  listUniqueValues,
  showAggregatedFromListUniqueValues,
} from './utils';
import DefaultColumnFilter from './DefaultColumnFilter';
export interface TableProps {
  sensorReadings: Array<SensorReading | {}>;
  loading: boolean;
  error?: string;
}

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
          aggregate: 'count',
          Aggregated: ({ value }) => `${value} IDs`,
        },
        {
          Header: 'Box ID',
          accessor: 'box_id',
          aggregate: listUniqueValues,
          Aggregated: showAggregatedFromListUniqueValues,
        },
        {
          accessor: 'sensor_type',
          Header: 'Type of the sensor',
          disableGroupBy: false,
          disableSortBy: false,
          disableFilters: false,
          aggregate: listUniqueValues,
          Aggregated: showAggregatedFromListUniqueValues,
        },
        {
          Header: 'Type of data',
          accessor: 'name',
          disableFilters: false,
          aggregate: listUniqueValues,
          Aggregated: showAggregatedFromListUniqueValues,
        },
        {
          Header: 'Range',
          columns: [
            {
              Header: 'Lower bound',
              accessor: 'range_l',
              aggregate: listUniqueValues,
              Aggregated: showAggregatedFromListUniqueValues,
            },
            {
              Header: 'Upper bound',
              accessor: 'range_u',
              aggregate: listUniqueValues,
              Aggregated: showAggregatedFromListUniqueValues,
            },
          ],
        },
        {
          Header: 'Geolocation',
          columns: [
            {
              Header: 'Latitude',
              accessor: 'latitude',
              aggregate: listUniqueValues,
              Aggregated: showAggregatedFromListUniqueValues,
            },
            {
              Header: 'Longitude',
              accessor: 'longitude',
              aggregate: listUniqueValues,
              Aggregated: showAggregatedFromListUniqueValues,
            },
          ],
        },
        {
          Header: 'Measurement unit',
          accessor: 'unit',
          aggregate: listUniqueValues,
          Aggregated: showAggregatedFromListUniqueValues,
        },
        {
          Header: ({ columns }) =>
            columns.length > 0 &&
            columns.filter((column) => column.isGrouped).length > 0
              ? 'Median reading value'
              : 'Reading value',
          accessor: 'reading',
          aggregate: 'median',
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
          Aggregated: () => '',
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

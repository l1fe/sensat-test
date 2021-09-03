import React, { useMemo } from 'react';
import {
  useTable,
  useBlockLayout,
  useSortBy,
  Column,
  useFilters,
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
          sortType: 'datetime',
          disableSortBy: false,
          Cell: (props) => {
            const formatted = props.value.toUTCString();
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
    useSortBy,
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
            return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
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
          <Tr {...headerGroups[1].getHeaderGroupProps()}>
            {headerGroups[1].headers.map((column) => (
              <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.canFilter ? column.render('Filter') : null}
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

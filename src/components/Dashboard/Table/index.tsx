import React, { useMemo } from 'react';
import { useTable, useBlockLayout, useSortBy, Column } from 'react-table';
import { FixedSizeList } from 'react-window';

import { SensorReading } from '../../../types';
import { TContainer, THeader, TBody, Tr, Td, Th } from './styles';

export interface TableProps {
  sensorReadings: Array<object>;
}

export const TABLE_HEIGHT_PX = 600;
export const ROW_HEIGHT_PX = 66;

export const Table: React.FC<TableProps> = ({ sensorReadings }) => {
  const columns = useMemo(
    () =>
      [
        {
          Header: 'ID',
          accessor: 'id',
          disableSortBy: true,
        },
        {
          Header: 'Box ID',
          accessor: 'box_id',
          disableSortBy: true,
        },
        {
          Header: 'Type of the sensor',
          accessor: 'sensor_type',
        },
        {
          Header: 'Type of data',
          accessor: 'name',
          disableSortBy: true,
        },
        {
          Header: 'Range',
          columns: [
            {
              Header: 'Lower bound',
              accessor: 'range_l',
              disableSortBy: true,
            },
            {
              Header: 'Upper bound',
              accessor: 'range_u',
              disableSortBy: true,
            },
          ],
        },
        {
          Header: 'Geolocation',
          columns: [
            {
              Header: 'Latitude',
              accessor: 'latitude',
              disableSortBy: true,
            },
            {
              Header: 'Longitude',
              accessor: 'longitude',
              disableSortBy: true,
            },
          ],
        },
        {
          Header: 'Measurement unit',
          accessor: 'unit',
          disableSortBy: true,
        },
        {
          Header: 'Timestamp',
          accessor: 'reading_ts',
          sortType: 'datetime',
          Cell: (props) => {
            const formatted = props.value.toUTCString();
            return <span>{formatted}</span>;
          },
        },
      ] as Column<SensorReading | {}>[],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
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
              <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </Th>
            ))}
          </Tr>
        ))}
      </THeader>

      <TBody {...getTableBodyProps()}>
        <FixedSizeList
          height={TABLE_HEIGHT_PX}
          itemCount={rows.length}
          itemSize={ROW_HEIGHT_PX}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </FixedSizeList>
      </TBody>
    </TContainer>
  );
};

export default Table;

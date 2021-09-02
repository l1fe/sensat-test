import React, { useMemo } from 'react';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';

import { TContainer, THeader, TBody, Tr, Td, Th } from './styles';

export interface TableProps {
  sensorReadings: Array<object>;
}

export const TABLE_HEIGHT_PX = 600;
export const ROW_HEIGHT_PX = 66;

export const Table: React.FC<TableProps> = ({ sensorReadings }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Box ID',
        accessor: 'box_id',
      },
      {
        Header: 'Type of the sensor',
        accessor: 'sensor_type',
      },
      {
        Header: 'Type of data',
        accessor: 'name',
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
      },
    ],
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
              <Th {...column.getHeaderProps()} className="th">
                {column.render('Header')}
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

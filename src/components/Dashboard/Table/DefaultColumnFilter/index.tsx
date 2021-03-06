import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import { Container, Input } from './styles';

export interface DefaultColumnFilterProps {
  column: {
    filterValue: string;
    preFilteredRows: object[];
    setFilter: (val: string | undefined) => void;
  };
}

const DefaultColumnFilter: React.FC<DefaultColumnFilterProps> = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const [value, setValue] = useState(filterValue);
  const count = preFilteredRows.length;

  const onChange = debounce((val: string | undefined) => {
    setFilter(val || undefined);
  }, 200);

  return (
    <Container>
      <Input
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} records...`}
      />
    </Container>
  );
};

export default DefaultColumnFilter;

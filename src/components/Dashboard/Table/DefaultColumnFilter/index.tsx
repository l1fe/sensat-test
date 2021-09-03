import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { Container, Input } from './styles';

const DefaultColumnFilter: React.FC<{ column: any }> = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const [value, setValue] = useState(filterValue);
  const count = preFilteredRows.length;

  const onChange = useAsyncDebounce((val: string | undefined) => {
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
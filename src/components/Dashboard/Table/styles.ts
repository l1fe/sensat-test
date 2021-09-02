import styled from 'styled-components';

export const TContainer = styled.div`
  display: inline-block;
  border-spacing: 0;
  border: 1px solid black;
`;

export const THeader = styled.div`
  border-bottom: 1px solid black;
  background-color: papayawhip;
`;

export const TBody = styled.div``;

export const Th = styled.div`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  font-weight: 600;
`;

export const Td = styled.div`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
`;

export const Tr = styled.div`
  &:last-child {
    .${Td.selector} {
      border-bottom: 0;
    }
  }
`;

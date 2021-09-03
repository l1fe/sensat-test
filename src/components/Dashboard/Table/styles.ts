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

export const Th = styled.div<{ canSort?: boolean }>`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  font-weight: 600;

  ${(p) =>
    p.canSort &&
    `
  background-color: yellow;

  &:hover {
    opacity: 0.5;
  }
  `}
`;

export const Td = styled.div`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
`;

export const Tr = styled.div<{ empty?: boolean }>`
  &:last-child {
    .${Td.selector} {
      border-bottom: 0;
    }
  }

  ${(p) =>
    p.empty &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
  `}
`;

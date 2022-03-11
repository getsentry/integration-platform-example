import styled from '@emotion/styled';
import React from 'react';

import Item, {ItemType} from './Item';

type ColumnProps = {
  title: string;
  items?: ItemType[];
};

const Column = ({title, items = []}: ColumnProps) => (
  <StyledColumn>
    <Title>{title}</Title>
    {items.map((item, index) => (
      <Item key={index} item={item} />
    ))}
  </StyledColumn>
);

const StyledColumn = styled.div`
  background: ${p => p.theme.gray100};
  box-shadow: 2px 2px 8px ${p => p.theme.purple200};
  max-width: 400px;
  margin: 2rem 1rem;
  border-radius: 5px;
  flex: 1;
`;

const Title = styled.h2`
  color: ${p => p.theme.gray300};
  text-transform: uppercase;
  font-style: italic;
  font-size: 18px;
  margin: 1rem;
  padding-left: 1rem;
`;

export default Column;

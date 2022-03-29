import styled from '@emotion/styled';
import React from 'react';

import {Item} from '../types';

type ItemCardProps = {
  item: Item;
};

const ItemCard = ({item: {title, description, complexity}}: ItemCardProps) => (
  <Card>
    <Title>{title}</Title>
    {description && <Description>{description}</Description>}
    <BadgeDisplay>{complexity && <Complexity>{complexity}</Complexity>}</BadgeDisplay>
  </Card>
);

const Card = styled.div`
  background: ${p => p.theme.surface100};
  margin: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
`;

const Title = styled.h3`
  font-size: 14px;
  color: ${p => p.theme.gray400};
  margin: 0;
`;

const Description = styled.p`
  color: ${p => p.theme.gray300};
  font-size: 12px;
  margin: 0.5rem 0;
`;

const BadgeDisplay = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 0.5px solid ${p => p.theme.gray200};
  padding-top: 0.5rem;
`;

const Complexity = styled.span`
  color: ${p => p.theme.surface100};
  padding: 0.25rem 0.75rem;
  border-radius: 1000px;
  background: ${p => p.theme.purple200};
`;

export default ItemCard;

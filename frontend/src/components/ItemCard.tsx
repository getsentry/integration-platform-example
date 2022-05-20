import styled from '@emotion/styled';
import React from 'react';

import {Item} from '../types';
import ItemCardCommentSection from './ItemCardCommentSection';

type ItemCardProps = {
  item: Item;
};

const ItemCard = ({
  item: {
    id,
    title,
    description = '',
    complexity,
    assignee,
    sentryId,
    sentryAlertId,
    isIgnored,
    comments = [],
  },
}: ItemCardProps) => {
  const shortDescription =
    description.length > 150
      ? (description || '').slice(0, 150).concat('...')
      : description;

  return (
    <Card isIgnored={!!isIgnored}>
      <CardHeader>
        <div className="card-title">{title}</div>
        <div className="card-id">#{id}</div>
      </CardHeader>
      <CardBody>{shortDescription}</CardBody>
      <PillSection>
        <UserDisplay>
          {assignee && (
            <img src={assignee.avatar} alt={assignee.name} title={assignee.name} />
          )}
        </UserDisplay>
        <BadgeDisplay>
          {sentryAlertId && <Badge className="alert-id">Alert ID: {sentryAlertId}</Badge>}
          {sentryId && <Badge className="issue-id">{sentryId}</Badge>}
          {complexity && <Badge className="complexity">{complexity}</Badge>}
        </BadgeDisplay>
      </PillSection>
      {comments && comments.length > 0 && <ItemCardCommentSection comments={comments} />}
    </Card>
  );
};

const Card = styled.div<{isIgnored: boolean}>`
  background: ${p => p.theme.surface100};
  margin: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  opacity: ${p => (p.isIgnored ? 0.5 : 1)};
  position: relative;
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  font-weight: bold;
  align-items: start;
  .card-title {
    font-size: 14px;
    color: ${p => p.theme.gray400};
  }
  .card-id {
    color: ${p => p.theme.blue300};
  }
`;

const CardBody = styled.div`
  color: ${p => p.theme.gray300};
  font-size: 12px;
  margin: 0.5rem 0;
`;

const PillSection = styled.div`
  display: flex;
  border-top: 0.5px solid ${p => p.theme.gray200};
  padding-top: 0.5rem;
  justify-content: space-between;
  align-items: center;
`;

const UserDisplay = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 35px 1fr;
  align-items: center;
  img {
    grid-column: 1;
    max-width: 100%;
    border-radius: 1000px;
    border: 2px solid ${p => p.theme.blue100};
    filter: sepia(100%) hue-rotate(185deg);
  }
`;

const BadgeDisplay = styled.div`
  flex: 10;
  text-align: right;
  gap: 10;
`;

const Badge = styled.a`
  display: inline-block;
  margin: 0.05rem;
  line-height: 1;
  padding: 0.25rem 0.75rem;
  border-radius: 1000px;
  font-weight: bold;
  &.issue-id {
    color: ${p => p.theme.purple300};
    background: ${p => p.theme.purple100};
  }
  &.alert-id {
    color: ${p => p.theme.green300};
    background: ${p => p.theme.green100};
  }
  &.complexity {
    color: ${p => p.theme.blue300};
    background: ${p => p.theme.blue100};
  }
`;

export default ItemCard;

import styled from '@emotion/styled';
import React, {useState} from 'react';

import {Item} from '../types';
import SentryLogo from './SentryLogo';

type ItemCardProps = {
  item: Item;
};

const ItemCard = ({
  item: {id, title, description, complexity, assignee},
}: ItemCardProps) => {
  const sentryId = undefined;
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Card
      isIgnored={false}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      <DeleteButton
        title="Delete"
        isVisible={isHovering}
        disabled={!isHovering}
        onClick={() => console.log(`Delete Item #${id}`)}
      />
      <EditButton
        title="Edit"
        isVisible={isHovering}
        disabled={!isHovering}
        onClick={() => console.log(`Update Item #${id}`)}
      />
      <LeftColumnButton
        title="Transition Left"
        isVisible={isHovering}
        disabled={!isHovering}
        onClick={() => console.log(`Move Item #${id} to the left`)}
      />
      <RightColumnButton
        title="Transition Right"
        isVisible={isHovering}
        disabled={!isHovering}
        onClick={() => console.log(`Move Item #${id} to the right`)}
      />
      <BottomBar>
        <UserDisplay>
          {assignee && (
            <img src={assignee.avatar} alt={assignee.name} title={assignee.name} />
          )}
        </UserDisplay>
        <BadgeDisplay>
          {sentryId && (
            <SentryIssue>
              <SentryLogo size={15} /> {sentryId}
            </SentryIssue>
          )}
          {complexity && <Complexity>{complexity}</Complexity>}
        </BadgeDisplay>
      </BottomBar>
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

const HoverButton = styled.button<{isVisible: boolean}>`
  position: absolute;
  padding: 0;
  margin: 0;
  top: -10px;

  padding: 10px;
  color: ${p => p.theme.surface100};
  &:after {
    line-height: 100%;
    font-size: 1.1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  transition: opacity 0.2s ease;
  opacity: ${p => (p.isVisible ? 1 : 0)};
`;

const DeleteButton = styled(HoverButton)`
  right: -10px;
  border: 1px solid ${p => p.theme.red300};
  background: ${p => p.theme.red200};
  &:after {
    content: '🔥';
    transform: translate(-50%, -55%);
  }
`;

const EditButton = styled(HoverButton)`
  right: 15px;
  border: 1px solid ${p => p.theme.yellow300};
  background: ${p => p.theme.yellow200};
  &:after {
    content: '✏️';
    transform: translate(-50%, -55%);
  }
`;

const RightColumnButton = styled(HoverButton)`
  right: 40px;
  border: 1px solid ${p => p.theme.green300};
  background: ${p => p.theme.green200};
  &:after {
    content: '▶';
    transform: translate(-50%, -55%);
  }
`;

const LeftColumnButton = styled(HoverButton)`
  right: 65px;
  border: 1px solid ${p => p.theme.blue300};
  background: ${p => p.theme.blue200};
  &:after {
    content: '◀';
    transform: translate(-50%, -55%);
  }
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

const BottomBar = styled.div`
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
    border: 2px solid ${p => p.theme.purple100};
    filter: sepia(100%) hue-rotate(200deg);
  }
`;

const BadgeDisplay = styled.div`
  flex: 10;
  text-align: right;
  span {
    display: inline-block;
    margin: 0.2rem;
  }
`;

const Complexity = styled.span`
  color: ${p => p.theme.surface100};
  padding: 0.25rem 0.75rem;
  border-radius: 1000px;
  background: ${p => p.theme.purple200};
`;

const SentryIssue = styled.span`
  display: flex;
  align-items: center;
  color: ${p => p.theme.surface100};
  border: 1px solid ${p => p.theme.purple200};
  padding: 0.25rem 0.75rem;
  border-radius: 1000px;
  color: ${p => p.theme.purple200};
  svg {
    margin-right: 0.25rem;
  }
`;

export default ItemCard;

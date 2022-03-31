import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import BasePage from '../components/BasePage';
import Column from '../components/Column';
import Header from '../components/Header';
import {ColumnType, Item, User} from '../types';
import {makeBackendRequest} from '../util';

function KanbanPage() {
  const columnTypes = Object.values(ColumnType);
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const {organizationSlug} = useParams();

  useEffect(() => {
    async function fetchData() {
      const [itemsData, usersData] = await Promise.all([
        makeBackendRequest(`/api/items/?organization=${organizationSlug}`),
        makeBackendRequest(`/api/users/?organization=${organizationSlug}`),
      ]);
      setItems(itemsData);
      setUsers(usersData);
    }
    fetchData();
  }, []);

  const usersMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {} as {[key: string]: User});
  const itemsMap = Object.fromEntries(columnTypes.map(type => [type, [] as Item[]])) as {
    [key in ColumnType]: Item[];
  };
  items?.forEach(item => {
    itemsMap[item.column].push({...item, assignee: usersMap[item.assigneeId]});
  });

  return (
    <BasePage>
      <Header />
      <ColumnLayout>
        {columnTypes.map(type => {
          return <Column key={type} title={type} items={itemsMap[type]} />;
        })}
      </ColumnLayout>
    </BasePage>
  );
}

const ColumnLayout = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  position: relative;
`;

export default KanbanPage;

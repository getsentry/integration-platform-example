import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import Column from '../components/Column';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {ColumnType, Item} from '../types';
import {makeBackendRequest} from '../util';

function KanbanPage() {
  const columnTypes = Object.values(ColumnType);
  const initialItemsMap = Object.fromEntries(
    columnTypes.map(type => [type, [] as Item[]])
  );
  const [itemsMap, setItemsMap] = useState(initialItemsMap);

  const {organizationSlug} = useParams();
  useEffect(() => {
    async function fetchData() {
      const data: Item[] =
        (await makeBackendRequest(`/api/items/?organization=${organizationSlug}`)) || [];
      const newItemsMap = {...itemsMap};
      data.forEach(item => newItemsMap[item.column].push(item));
      setItemsMap(newItemsMap);
    }
    fetchData();
  }, []);

  return (
    <KanbanWrapper>
      <Header />
      <Layout>
        {columnTypes.map(type => (
          <Column key={type} title={type} items={itemsMap[type]} />
        ))}
      </Layout>
      <Footer />
    </KanbanWrapper>
  );
}

const KanbanWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const Layout = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  position: relative;
`;

export default KanbanPage;

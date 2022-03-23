import styled from '@emotion/styled';
import React from 'react';

import Column from '../components/Column';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {ItemType} from '../components/Item';

function KanbanPage() {
  const columnTypes = Object.values(ColumnType);
  const itemsMap: Record<string, ItemType[]> = Object.fromEntries(
    columnTypes.map(type => [type, []])
  );

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

// TODO(Leander): Share types with backend-ts
export enum ColumnType {
  Todo = 'TODO',
  Doing = 'DOING',
  Done = 'DONE',
}

export default KanbanPage;

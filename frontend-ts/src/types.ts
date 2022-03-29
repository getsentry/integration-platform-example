// TODO(Leander): Figure out a way to share this file with the backend-ts
export type Organization = {
  id: number;
  name: string;
  slug: string;
  externalSlug?: string;
};

export type User = {
  id: number;
  name?: string;
  username?: string;
  avatar?: string;
};

export type Item = {
  title: string;
  description?: string;
  complexity?: number;
  column: ColumnType;
};

export enum ColumnType {
  Todo = 'TODO',
  Doing = 'DOING',
  Done = 'DONE',
}

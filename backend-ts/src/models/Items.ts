import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export enum Column {
  Todo = 'TODO',
  Doing = 'DOING',
  Done = 'DONE',
}

export class Items extends Model<InferAttributes<Items>, InferCreationAttributes<Items>> {
  declare title: string;
  declare description: string;
  declare complexity: number;
  declare column: Column;
}

const ItemsDefiner = (sequelize: Sequelize) => {
  Items.init(
    {
      title: {type: DataTypes.STRING},
      description: {type: DataTypes.TEXT},
      complexity: {type: DataTypes.INTEGER},
      column: {type: DataTypes.ENUM(...Object.values(Column))},
    },
    {sequelize, tableName: 'Items'}
  );
};

export default ItemsDefiner;

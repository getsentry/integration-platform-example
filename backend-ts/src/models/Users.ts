import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
  declare name: string;
  declare username: string;
  declare avatar: string;
}

const UsersDefiner = (sequelize: Sequelize) => {
  Users.init(
    {
      name: {type: DataTypes.STRING},
      username: {type: DataTypes.STRING},
      avatar: {type: DataTypes.STRING},
    },
    {sequelize, tableName: 'Users'}
  );
};
export default UsersDefiner;

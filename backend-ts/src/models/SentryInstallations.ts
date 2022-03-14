import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class SentryInstallations extends Model<
  InferAttributes<SentryInstallations>,
  InferCreationAttributes<SentryInstallations>
> {
  declare id: string;
  declare orgSlug: string;
  declare token: string;
  declare refreshToken: string;
  declare expiresAt: Date;
}

const SentryInstallationsDefiner = (sequelize: Sequelize) => {
  SentryInstallations.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      orgSlug: {type: DataTypes.STRING},
      token: {type: DataTypes.STRING},
      refreshToken: {type: DataTypes.STRING},
      expiresAt: {type: DataTypes.DATE},
    },
    {
      sequelize,
      tableName: 'SentryInstallations',
    }
  );
};

export default SentryInstallationsDefiner;

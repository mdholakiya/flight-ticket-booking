import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export type Migration = {
  up: (queryInterface: QueryInterface, Sequelize: typeof DataTypes & { literal: (value: string) => any }) => Promise<void>;
  down: (queryInterface: QueryInterface, Sequelize: typeof DataTypes & { literal: (value: string) => any }) => Promise<void>;
}; 
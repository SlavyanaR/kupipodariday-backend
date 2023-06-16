import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

import configuration from './src/configuration/configuration';

const options = configuration().database;
export const AppDataSource = new DataSource(options);

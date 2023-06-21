//import * as path from 'path';
//import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    schema: process.env.DATABASE_SCHEMA || 'kupipodariday',
  },

  saltRound: parseInt(process.env.SALT, 10) || 10,
  jwt: {
    key: process.env.JWT_KEY || 'e776c17dcf7b8de11a1647faa49b89c2',
    ttl: process.env.JWT_TTL || '7d',
  },
});

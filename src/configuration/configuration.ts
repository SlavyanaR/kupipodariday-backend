//import * as path from 'path';
//import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  server: {
    port: process.env.SERVER_PORT || 3001,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    name: process.env.DATABASE_NAME || 'kupipodariday',
    schema: process.env.DATABASE_SCHEMA || 'kupipodariday',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'secret-key',
    ttl: process.env.JWT_TTL || '7d',
  },
  hash: {
    salt: Number(process.env.SALT) || 10,
  },
});

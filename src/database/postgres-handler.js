

import pg from 'pg';
import { PG_SECRETS } from '../SECRETS/index.js';

const pool = new pg.Pool(PG_SECRETS);

export async function query(query, variables) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, variables);
    return res;
  } finally {
    client.release();
  }
}
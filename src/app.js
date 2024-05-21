import 'dotenv/config'
import { query } from './database/postgres-handler.js'

const result = await query('select * from public.products' );
console.log(result.rows);
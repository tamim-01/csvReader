import pg from 'pg'
import { PG_SECRETS } from '../SECRETS/index.js'


const { Client } = pg
const client = new Client(PG_SECRETS)


export async function query(query,variables){
await client.connect()
const res = await client.query(query , variables)
await client.end()
return res ;
}
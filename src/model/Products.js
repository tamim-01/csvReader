import { query } from "../database/postgres-handler.js";
import format from 'pg-format'
const SCHEMA = 'public';
const NAME = 'products'


export async function getProductsBySku(sku) {
  let sqlQuery, sqlVariables;

  if (sku) {
    sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME} WHERE sku = $1`;
    sqlVariables = [sku];
  } else {
    sqlQuery = `SELECT * FROM ${SCHEMA}.${NAME}`;
    sqlVariables = [];
  }

  return query(sqlQuery, sqlVariables);
}

export async function creatProduct (sku ,name , price , count) {

    const sqlQuery = `INSERT INTO ${SCHEMA}.${NAME} (sku, name, price, count)
    VALUES
      ( $1 , $2 , $3 , $4 );`;
    
    const sqlVariables = [sku , name , price , count];
    return query(sqlQuery,sqlVariables);
    };

    
export async function deleteProductBySku (sku) {

    const sqlQuery = `DELETE FROM ${SCHEMA}.${NAME}
    WHERE sku = $1;`;
        
    const sqlVariables = [sku];
    return query(sqlQuery,sqlVariables);
    };

    //i used pg-format here to
    //reformat the query cuz i couldnt use quots of string variable for column name
export async function updateProductBySku( column,value,sku) {
    const sqlQuery = format(
        `UPDATE %I.%I SET %I = $1 WHERE sku = $2;`,
        SCHEMA,
        NAME,
        column
      );
      const sqlVariables = [value, sku];
     
      return query(sqlQuery, sqlVariables);
    };
    
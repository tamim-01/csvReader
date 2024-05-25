import "dotenv/config";
import {
  getProductsBySku,
  creatProduct,
  updateProductBySku,
  deleteProductBySku,
} from "./model/Products.js";
import { csvFileReader } from "./model/ReadingCsv.js";

const inputFile = "./csv-file/test.csv";

async function comparingData() {
  try {
    const csvArray = await csvFileReader(inputFile);
    const existingProducts = await getProductsBySku(); // get all products from the database

    // process products in the csv and itrating them
    for (const product of csvArray) {

      // check if the product has a valid sku
      if (!product.sku) {
        console.log(`Skipping product with null SKU: ${product}`);
        continue;
      }
      
      //finding products from db that already exist in the csv
      const existingProduct = existingProducts.rows.find(
        (p) => p.sku === product.sku
      );

      //if product from csv was not in the db we create it
      if (!existingProduct) {
        await creatProduct(
          product.sku,
          product.name,
          product.price,
          product.count
        );
        console.log(
          `Product with SKU ${product.sku} was missing from the database and has been created.`
        );
        //if product exist we should check the content and if it needs to update
      } else {
        //so we put the fields in a variables
        const { sku, ...existingProductFields } = existingProduct;
        const productFields = { ...product }; //and Create a copy of the product object
        
        
        for (const field of Object.keys(productFields)) {
          //filtering sku 
          if (
            field != "sku" &&
            //checking the content of each field
            productFields[field] != existingProductFields[field]
          ) {
            await updateProductBySku(
              field,
              productFields[field],
              product.sku
            );
            console.log(`Product ${field} updated`);
          }
        }

        // Remove the processed product from the existingProducts array
        existingProducts.rows = existingProducts.rows.filter(
          (p) => p.sku != product.sku
        );
      }
    }

    // Delete remaining products from the database 
    //products that exist in the database but not in the csv
    for (const productToDelete of existingProducts.rows) {
       await deleteProductBySku(productToDelete.sku);
      console.log(
        `Product with SKU ${productToDelete.sku} was deleted from the database`
      );
    }
  } catch (err) {
    console.error(err);
  }
}
comparingData();


// const product = await creatProduct('sku022' , 'Product22' , 19292 , 12);
// console.log(product);
// const result = await getProductsBySku('sku022');
// console.log(result.rows);
// const product = await updateProductBySku('price', 12112 , 22);
// console.log(product);

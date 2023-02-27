const { checkPrimeSync } = require("crypto");
const fs = require("fs");

class ProductManager {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async addProduct(product) {
    try {
      /* verifico que el producto tenga todos los parametros */
      if (this.#paramsValidator(product)) {
        /* busco si el archivo no existe o si existe, si tiene datos*/
        if (!this.#exists(this.archivo)) {
          console.log("Se crea archivo");
          let productsArray = [];
          product = {
            id: this.#idGenerator(productsArray),
            code: this.#codeGenerator(),
            ...product,
          };
          productsArray.push(product);
          console.log("Agregando producto...");
          await this.#writeFile(this.archivo, productsArray);
          console.log(`Se agrego el producto con el id: ${product.id}`);
          return product.id;
        } else {
          /* si el archivo existe, primero verifico si esta vacio */
          if (this.#readFile(this.archivo)) {
            console.log("Leyendo archivo...");
            const productsArray = await this.#readFile(this.archivo);
            if (productsArray.length === 0) {
              /* si esta vacio no le paso parametro al idGenerator, por lo que le pondra id: 1 */
              product = {
                id: this.#idGenerator(),
                code: this.#codeGenerator(),
                ...product,
              };
            } else {
              /* si ya tiene algun producto, le paso el array de productos como parametro para que el idGenerator le ponga el correspondiente */
              product = {
                id: this.#idGenerator(productsArray),
                code: this.#codeGenerator(),
                ...product,
              };
            }
            console.log("Agregando producto...");
            productsArray.push(product);
            /* escribo el producto */
            this.#writeFile(this.archivo, productsArray);
            console.log(`Se agrego el producto con el id: ${product.id}`);
            return product.id;
          }
        }
      }
    } catch (error) {
      console.log(`Error agregando producto: ${error.message}`);
    }
  }

  async getAll() {
    try {
      /* chequeo si existe el documento */
      if (this.#exists(this.archivo)) {
        console.log("Leyendo archivo...");
        const productsArray = await this.#readFile(this.archivo);
        /* una vez que verifico que existe, veo si esta vacio o si tiene contenido */
        if (productsArray.length !== 0) {
          console.log("Archivo con contenido");
          console.log(productsArray);
          return productsArray;
        } else {
          throw new Error(`El archivo ${this.archivo} esta vacio`);
        }
      }
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      /* chequeo si existe el documento */
      if (this.#exists(this.archivo)) {
        const productsArray = await this.#readFile(this.archivo);
        /* uso find para buscar el producto que coincida con el id solicitado */
        const productId = productsArray.find(item => item.id === id);
        if (!productId) {
          throw new Error("No se encontro un producto con el id solicitado");
        } else {
          console.log(`Producto con el id ${id} encontrado:\n`, productId);
          return productId;
        }
      }
    } catch (error) {
      console.log(`Error al buscar producto con el id ${id}: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      /* chequeo si existe el documento */
      if (this.#exists(this.archivo)) {
        const productsArray = await this.#readFile(this.archivo);
        /* verifico que exista el producto con el id solicitado */
        console.log(`Buscando producto con id: ${id}`);
        if (productsArray.some(item => item.id === id)) {
          const productsArray = await this.#readFile(this.archivo);
          /* elimino el producto */
          console.log(`Eliminando producto con id solicitado...`);
          const newProductsArray = productsArray.filter(item => item.id !== id);
          this.#writeFile(this.archivo, newProductsArray);
          console.log(`Producto con el id ${id} eliminado`);
        } else {
          throw new Error(`No se encontro el producto con el id ${id}`);
        }
      }
    } catch (error) {
      console.log(
        `Error al eliminar el producto con el id solicitado: ${error.message}`
      );
    }
  }

  #codeGenerator(codeLength = 15) {
    const numeros = "0123456789";
    const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numYLetras = numeros + letras;
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const random = Math.floor(Math.random() * numYLetras.length);
      code += numYLetras.charAt(random);
    }
    return code;
  }

  #idGenerator(productsArray = []) {
    const id =
      productsArray.length === 0
        ? 1
        : productsArray[productsArray.length - 1].id + 1;
    return id;
  }

  #paramsValidator(product) {
    if (
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.stock
    ) {
      return true;
    } else {
      if (!product.title) {
        throw new Error(`Falta el title del producto.`);
      } else if (!product.description) {
        throw new Error(`Falta la descripcion del producto.`);
      } else if (!product.price) {
        throw new Error(`Falta el precio del producto.`);
      } else if (!product.thumbnail) {
        throw new Error(`Falta la imagen del producto.`);
      } else if (!product.stock) {
        throw new Error(`Falta el stock del producto.`);
      }
    }
  }

  #exists(archivo) {
    /* verifico si existe el archivo */
    try {
      if (!fs.existsSync(archivo)) {
        throw new Error("El archivo no existe");
      } else {
        return true;
      }
    } catch (error) {
      console.log(`Error buscando el archivo: ${error.message}`);
    }
  }

  async #readFile(archivo) {
    try {
      /* leo el archivo */
      const data = await fs.readFileSync(archivo);
      return JSON.parse(data);
    } catch (error) {
      console.log(`Error leyendo el archivo: ${error.message}`);
    }
  }

  async #writeFile(archivo, data) {
    try {
      await fs.writeFileSync(archivo, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`Error escribiendo el archivo: ${error.message}`);
    }
  }
}

module.exports = ProductManager;

const fs = require("fs");

class ProductManager {
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

  #idGenerator() {
    const id =
      this.products.length === 0
        ? 1
        : this.products[this.products.length - 1].id + 1;
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

  constructor(archivo) {
    this.archivo = archivo;
  }

  addProduct(product) {
    try {
      if (this.#paramsValidator(product)) {
        return this.products.push({
          id: this.#idGenerator(),
          code: this.#codeGenerator(),
          ...product,
        });
      }
    } catch (error) {
      console.log(`Error agregando producto: ${error.message}`);
    }
  }

  getProducts() {
    try {
      return this.products;
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`);
    }
  }

  getProductById(id) {
    try {
      const idProduct = this.products.find(product => product.id === id);
      if (idProduct) {
        console.log(idProduct);
      } else throw new Error(`Not found`);
    } catch (error) {
      console.log(`Error al buscar producto con el id ${id}: ${error.message}`);
    }
  }
}

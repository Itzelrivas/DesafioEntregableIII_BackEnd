import fs from 'fs';
const dirName = './products'

export default class ProductManager {
    constructor() {
        this.path = dirName + "/array.json"
    }

    async getProducts() {
        try {
            if(fs.existsSync(this.path)){
                let result = await fs.promises.readFile(this.path, "utf-8")
                result = JSON.parse(result)
                return result
            }
        } catch (error) {
            console.error("Error al intentar parsear el archivo array.json: " + error);
        }
    }
}

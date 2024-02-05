import express from 'express';
import ProductManager from './ProductManager.js';

const app = express(); 
const PORT = 9090

const newProduct = new ProductManager()

app.get('/products', async(request, response) => { 
	try {
		let products = await newProduct.getProducts()
		if(products && products.length > 0){ //Puede que exista, pero que no tenga ningun elemento, por eso, lo verificamos :)
			let formattedResult = products.map(product => JSON.stringify(product, null, 2)).join('\n');
			response.setHeader('Content-Type', 'application/json');
			response.send("Los productos son: \n \n" + formattedResult)
		}
		else {
            response.send('<h2 style="color: red">No hay productos disponibles :(</h2>');
        }
	} catch (error) {
		console.error("Ha surgido un error: " + error)
		response.send('<h2 style="color: red">¡Oh oh! Ha surgido un error.</h2>')
	}
})

//Query 
app.get('/products/valor', async(request, response) => {
	try {
		let products = await newProduct.getProducts()
		let { limit } = request.query
		if(products && products.length > 0){
			if(!limit){
				let formattedResult = products.map(product => JSON.stringify(product, null, 2)).join('\n');
				response.setHeader('Content-Type', 'application/json');
				response.send("Todos productos son: \n \n" + formattedResult)
			}
			else if(parseInt(limit) <= products.length){
				let productsQuery = []
				for(let i=0; i<parseInt(limit); i++){
					productsQuery.push(JSON.parse(JSON.stringify(products[i])))
				}
				response.setHeader('Content-Type', 'application/json')
				response.send(JSON.stringify(productsQuery, null, 2))
			}
			else{
				response.send("¡Oh Oh!, el valor límite de productos a mostrar es mayor a la cantidad de productos totales.")
			}
		}
		else {
			response.send('<h2 style="color: red">No hay productos disponibles, por lo tanto, no podemos ejecutar esto.</h2>');
		}
	} catch (error) {
		console.error("Ha surgido este error: " + error)
		response.send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo mostrar lo solicitado.</h2>')
	}
})

//Params
app.get('/products/:pid', async(request, response) => {
	try {
		let products = await newProduct.getProducts()
		let productId = request.params.pid
		if(products && products.length > 0){
			const idSearch = products.find(prod => prod.id === parseInt(productId))
			if(idSearch){
				response.setHeader('Content-Type', 'application/json');
				return response.send(`El producto con el id=${productId} es: \n\n` + JSON.stringify(idSearch, null, 2))
			}
			response.send({msg: `El producto con el id=${productId} no existe.`})
		}
		else {
			response.send('<h2 style="color: red">No hay productos disponibles, por lo tanto, no podemos ejecutar esto.</h2>');
		}
	} catch (error) {
		console.error("Ha surgido este error: " + error)
		response.send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo mostrar lo solicitado.</h2>')
	}
})

app.listen(PORT, () => {
	console.log(`Levantamos server en el puerto ${PORT}`)
})
const axios = require('axios')
const fetch = require('node-fetch');

class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async getAllProducts() {
        const response = await fetch(`${this.baseUrl}/api/products`)
        return response.json()
    }

    async deleteProduct(productId) {
        const response = await fetch(`${this.baseUrl}/api/deleteproduct?id=${productId}`)
        return response.json()
    }

    async addProduct(product) {
        const response = await fetch(`${this.baseUrl}/api/addproduct`, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {'Content-Type': 'application/json'}
        })
        return response.json()
    }

    async deleteAllProducts() {
        const products = await this.getAllProducts()
        for (let i in products) {
            if (i > 29) {
                var p = products[i]
                await this.deleteProduct(p.id)
            }
        }
    }

    async editProduct(product) {
        const response = await fetch(`${this.baseUrl}/api/editproduct`, {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {'Content-Type': 'application/json'}
        })
        return response.json()
    }

    async getProduct(productId) {
        let products = await this.getAllProducts()
        productId += ''
        products = products.filter(p => {
            return p.id === productId
        })
        if (products.length) {
            return products[0]
        }
        return null
    }
}

module.exports = Api

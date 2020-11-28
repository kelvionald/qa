const config = require('./config.json')
const Api = require('./api')
const api = new Api(config.BASE_URL)

const ProductBuilder = require('./ProductBuilder')
const productBuilder = new ProductBuilder()

module.exports.createProductOnServer = async function (title = null) {
    const product = productBuilder.createProduct()
    if (title != null) {
        product.title = title
    }
    const response = await api.addProduct(product)
    return await api.getProduct(response.id)
}

module.exports.makeTestEditProduct = function (testName, setup, check) {
    it.concurrent(testName, async () => {
        let oldProduct = await module.exports.createProductOnServer()
        oldProduct.title += testName
        oldProduct = setup(oldProduct)

        response = await api.editProduct(oldProduct)
        const newProduct = await api.getProduct(oldProduct.id)

        const STATUS_CHANGED = 1
        expect(response.status).toBe(STATUS_CHANGED)
        check(oldProduct, newProduct)

        await api.deleteProduct(oldProduct.id)
    }, config.MAX_TIMEOUT)
}

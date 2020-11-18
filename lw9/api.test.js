const Api = require('./api')
const api = new Api('http://91.210.252.240:9010')
const fs = require('fs')

// "id": "число",
// "category_id": "число от 1 до 15",
// "title": "текст",
// "alias": "формируется из поля title через транслит на латиницу. Но если такой алиас существует, то добавляется префикс -0", !!
// "content": "текст",
// "price": "число",
// "old_price": "число",
// "status": "число (0,1) ",
// "keywords": "текст",
// "description": "текст",
// "hit": "число (0,1)"

const all_products = JSON.parse(fs.readFileSync('./testdata/all_products.json', 'utf8'))

const STATUS_CREATED = 1
const STATUS_DELETED = 1

function createProduct() {
    return {
        //"id": 100,
        "category_id": "1",
        "title": "Product title",
        // "alias": "формируется из поля title",
        "content": "Long description",
        "price": "100",
        "old_price": "200",
        "status": "1",
        "keywords": "keyword1",
        "description": "description",
        "hit": "1"
    }
}

function normalizeProduct(product) {
    // product.price = parseInt(price)
    // product.old_price = parseInt(old_price)
    // product.status = parseInt(status)
    return product
}

function expectToBeInteger(value) {
    expect(value === parseInt(value)).toBeTruthy()
}

test('чтение товаров', async () => {
    const products = await api.getAllProducts()
    expect(products).toEqual(expect.arrayContaining(all_products))
})

// test('создание товара', async () => {
//     const product_expect = createProduct()
//     const response = await api.addProduct(product_expect)
//     expect(response.status).toEqual(STATUS_CREATED)
//     expectToBeInteger(response.id)
// })
//
// test('чтение товара', async () => {
//     const product_expect = createProduct()
//     const response = await api.addProduct(product_expect)
//     response.id += ''
//     const COUNT_PRODUCT = 1
//     let products = await api.getAllProducts()
//
//     products = products.filter(p => {return p.id === response.id})
//     expect(products.length).toEqual(COUNT_PRODUCT)
//     expect(products[0]).toMatchObject(product_expect)
// })

describe('манипуляции с одним товаром', () => {
    const product_expect = createProduct()
    let response = null
    it('создание товара', async () => {
        response = await api.addProduct(product_expect)
        expect(response.status).toEqual(STATUS_CREATED)
        expectToBeInteger(response.id)
    })
    it('чтение созданного товара', async () => {
        response.id += ''
        const COUNT_PRODUCT = 1
        let products = await api.getAllProducts()

        products = products.filter(p => {return p.id === response.id})
        expect(products.length).toEqual(COUNT_PRODUCT)
        expect(products[0]).toMatchObject(product_expect)
    })
    it('удаление созданного товара', async () => {
        response = await api.deleteProduct(response.id)
        expect(response.status).toEqual(STATUS_DELETED)
    })
})

api.deleteAllProducts()

const Api = require('./api')
const api = new Api('http://91.210.252.240:9010')
const fs = require('fs')

const all_products = JSON.parse(fs.readFileSync('./testdata/all_products.json', 'utf8'))

const MAX_TIMEOUT = 30000

const STATUS_CREATED = 1
const STATUS_DELETED = 1
const STATUS_CHANGED = 1

const STATUS_ON = "1"
const STATUS_OFF = "0"

function createProduct() {
    return {
        //"id": 100,
        "category_id": "1",
        "title": "Product title",
        // "alias": "формируется из поля title",
        "content": "Long description",
        "price": "100",
        "old_price": "200",
        "status": STATUS_ON,
        "keywords": "keyword1",
        "description": "description",
        "hit": STATUS_ON
    }
}

async function createProductOnServer(title = null) {
    const product = createProduct()
    if (title != null) {
        product.title = title
    }
    const response = await api.addProduct(product)
    return await api.getProduct(response.id)
}

function expectToBeInteger(value) {
    expect(value === parseInt(value)).toBeTruthy()
}

function copy(obj) {
    return Object.assign({}, obj)
}

test('чтение товаров', async () => {
    const products = await api.getAllProducts()

    expect(products).toEqual(expect.arrayContaining(all_products))
})

function makeTestEditProduct(testName, setup, check) {
    it.concurrent(testName, async () => {
        let oldProduct = await createProductOnServer()
        oldProduct.title += testName
        oldProduct = setup(oldProduct)

        response = await api.editProduct(oldProduct)
        const newProduct = await api.getProduct(oldProduct.id)

        // console.log(oldProduct, newProduct, response)
        expect(response.status).toBe(STATUS_CHANGED)
        check(oldProduct, newProduct)

        await api.deleteProduct(oldProduct.id)
    }, MAX_TIMEOUT)
}

describe('манипуляции с одним товаром', () => {
    const product_expect = createProduct()
    const CUSTOM_NAME = 'Custom name'
    const CUSTOM_ALIAS = 'custom-name'
    product_expect.title = CUSTOM_NAME

    it('создание товара', async () => {
        let response = await api.addProduct(product_expect)

        expect(response.status).toBe(STATUS_CREATED)
        expectToBeInteger(response.id)

        await api.deleteProduct(response.id)
    }, MAX_TIMEOUT)

    it('создание товара с существующим именем', async () => {
        let response = await api.addProduct(product_expect)

        let product = await createProductOnServer(CUSTOM_NAME)

        expect(product.title).toBe(CUSTOM_NAME)
        expect(product.alias).toBe(CUSTOM_ALIAS + '-0')

        await api.deleteProduct(product.id)
        await api.deleteProduct(response.id)
    }, MAX_TIMEOUT)

    it('удаление созданного товара', async () => {
        let response = await api.addProduct(product_expect)

        response = await api.deleteProduct(response.id)

        expect(response.status).toEqual(STATUS_DELETED)
    }, MAX_TIMEOUT)

    it('чтение созданного товара', async () => {
        let response = await api.addProduct(product_expect)

        let product = await api.getProduct(response.id)

        expect(product).toMatchObject(product_expect)
        expect(product.alias).toBe(CUSTOM_ALIAS)

        await api.deleteProduct(response.id)
    }, MAX_TIMEOUT)

    describe('редактирование', () => {
        let response = null
        let product = null
        const NEW_TITLE = 'New product title'
        const NEW_ALIAS = 'new-product-title'
        const NEW_CATEGORY = '2'
        const NEW_CONTENT = 'Новый контент'
        const NEW_PRICE = '400'
        const NEW_OLD_PRICE = '10'
        const NEW_STATUS = '0'
        const NEW_KEYWRODS = 'new keywords'
        const NEW_DESCRIPTION = 'new description'
        const NEW_HIT = '0'
        const NEW_WRONG_HIT = '2'
        const NEW_WRONG_STATUS = '2'

        makeTestEditProduct('изменение названия', (product) => {
            product.title = NEW_TITLE
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.title).toBe(NEW_TITLE)
            expect(newProduct.alias).toBe(NEW_ALIAS)
        })

        makeTestEditProduct('изменение категории', (product) => {
            product.category_id = NEW_CATEGORY
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.category_id).toBe(NEW_CATEGORY)
        })

        makeTestEditProduct('изменение контента', (product) => {
            product.content = NEW_CONTENT
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.content).toBe(NEW_CONTENT)
        })

        makeTestEditProduct('изменение цены', (product) => {
            product.price = NEW_PRICE
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.price).toBe(NEW_PRICE)
        })

        makeTestEditProduct('изменение старой цены', (product) => {
            product.old_price = NEW_OLD_PRICE
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.old_price).toBe(NEW_OLD_PRICE)
        })

        makeTestEditProduct('изменение статуса', (product) => {
            product.status = NEW_STATUS
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.status).toBe(NEW_STATUS)
        })

        makeTestEditProduct('изменение ключевых слов', (product) => {
            product.keywords = NEW_KEYWRODS
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.keywords).toBe(NEW_KEYWRODS)
        })

        makeTestEditProduct('изменение описания', (product) => {
            product.description = NEW_DESCRIPTION
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.description).toBe(NEW_DESCRIPTION)
        })

        makeTestEditProduct('изменение статуса хита', (product) => {
            product.hit = NEW_HIT
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.hit).toBe(NEW_HIT)
        })

        makeTestEditProduct('изменение статуса числом вне диапазона', (product) => {
            product.status = NEW_WRONG_STATUS
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.status).toBe(STATUS_ON)
        })

        makeTestEditProduct('изменение статуса хита числом вне диапазона', (product) => {
            product.hit = NEW_WRONG_HIT
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct.hit).toBe(STATUS_ON)
        })

        const NEW_WRONG_CATEGORY = '0'
        const NEW_WRONG_PRICE = '-1'
        const NEW_WRONG_OLD_PRICE = '-1'

        describe('не корректное', () => {
            makeTestEditProduct('изменение категории', (product) => {
                product.category_id = NEW_WRONG_CATEGORY
                return product
            }, (oldProduct, newProduct) => {
                expect(newProduct).toBe(null)
            })

            makeTestEditProduct('изменение цены', (product) => {
                product.price = NEW_WRONG_PRICE
                return product
            }, (oldProduct, newProduct) => {
                expect(newProduct.price).toBe(NEW_WRONG_PRICE)
            })

            makeTestEditProduct('изменение старой цены', (product) => {
                product.old_price = NEW_WRONG_OLD_PRICE
                return product
            }, (oldProduct, newProduct) => {
                expect(newProduct.old_price).toBe(NEW_WRONG_OLD_PRICE)
            })
        })
    })
})

afterAll(async () => {
    await api.deleteAllProducts()
    console.log('cOMPLeTE')
}, MAX_TIMEOUT)

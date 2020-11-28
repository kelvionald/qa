const config = require('./config.json')
const Api = require('./api')
const api = new Api(config.BASE_URL)
const ProductBuilder = require('./ProductBuilder')
const productBuilder = new ProductBuilder()
const all_products = require('./testdata/all_products.json')
const createProductOnServer = require('./testUtils').createProductOnServer
const makeTestEditProduct = require('./testUtils').makeTestEditProduct
const product_expect = productBuilder.createProduct()

test('чтение товаров', async () => {
    const products = await api.getAllProducts()

    expect(products).toEqual(expect.arrayContaining(all_products))
})

it('создание товара', async () => {
    let response = await api.addProduct(product_expect)

    const STATUS_CREATED = 1
    expect(response.status).toBe(STATUS_CREATED)
    expect(response.id === parseInt(response.id)).toBeTruthy()

    await api.deleteProduct(response.id)
}, config.MAX_TIMEOUT)

it('создание товара с существующим именем', async () => {
    const CUSTOM_NAME = 'Custom name'
    const CUSTOM_ALIAS = 'custom-name'
    let response = await api.addProduct(product_expect)

    let product = await createProductOnServer(CUSTOM_NAME)

    expect(product.title).toBe(CUSTOM_NAME)
    expect(product.alias).toBe(CUSTOM_ALIAS + '-0')

    await api.deleteProduct(product.id)
    await api.deleteProduct(response.id)
}, config.MAX_TIMEOUT)

it('удаление созданного товара', async () => {
    let response = await api.addProduct(product_expect)

    response = await api.deleteProduct(response.id)

    const STATUS_DELETED = 1
    expect(response.status).toEqual(STATUS_DELETED)
}, config.MAX_TIMEOUT)

it('чтение созданного товара', async () => {
    const CUSTOM_ALIAS = 'custom-name'
    let response = await api.addProduct(product_expect)

    let product = await api.getProduct(response.id)

    expect(product).toMatchObject(product_expect)
    expect(product.alias).toBe(CUSTOM_ALIAS)

    await api.deleteProduct(response.id)
}, config.MAX_TIMEOUT)

describe('редактирование товара', () => {
    let response = null
    let product = null
    const NEW_TITLE = 'New product title1'
    const NEW_ALIAS = 'new-product-title1'
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
        expect(newProduct).toBe(null)
    })

    makeTestEditProduct('изменение статуса хита числом вне диапазона', (product) => {
        product.hit = NEW_WRONG_HIT
        return product
    }, (oldProduct, newProduct) => {
        expect(newProduct).toBe(null)
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
            expect(newProduct).toBe(null)
        })

        makeTestEditProduct('изменение старой цены', (product) => {
            product.old_price = NEW_WRONG_OLD_PRICE
            return product
        }, (oldProduct, newProduct) => {
            expect(newProduct).toBe(null)
        })
    })
})

afterAll(async () => {
    await api.deleteAllProducts()
    console.log('cOMPLeTE')
}, config.MAX_TIMEOUT)

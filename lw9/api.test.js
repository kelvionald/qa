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
    makeTestEditProduct('изменение названия', (product) => {
        const pb = new ProductBuilder(product)
        pb.setTitle(NEW_TITLE)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.title).toBe(NEW_TITLE)
        expect(newProduct.alias).toBe(NEW_ALIAS)
    })

    const NEW_CATEGORY = '2'
    makeTestEditProduct('изменение категории', (product) => {
        const pb = new ProductBuilder(product)
        pb.setCategory(NEW_CATEGORY)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.category_id).toBe(NEW_CATEGORY)
    })

    const NEW_CONTENT = 'Новый контент'
    makeTestEditProduct('изменение контента', (product) => {
        const pb = new ProductBuilder(product)
        pb.setContent(NEW_CONTENT)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.content).toBe(NEW_CONTENT)
    })

    const NEW_PRICE = '400'
    makeTestEditProduct('изменение цены', (product) => {
        const pb = new ProductBuilder(product)
        pb.setPrice(NEW_PRICE)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.price).toBe(NEW_PRICE)
    })

    const NEW_OLD_PRICE = '10'
    makeTestEditProduct('изменение старой цены', (product) => {
        const pb = new ProductBuilder(product)
        pb.setOldPrice(NEW_OLD_PRICE)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.old_price).toBe(NEW_OLD_PRICE)
    })

    const NEW_STATUS = '0'
    makeTestEditProduct('изменение статуса', (product) => {
        const pb = new ProductBuilder(product)
        pb.setStatus(NEW_STATUS)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.status).toBe(NEW_STATUS)
    })

    const NEW_KEYWRODS = 'new keywords'
    makeTestEditProduct('изменение ключевых слов', (product) => {
        const pb = new ProductBuilder(product)
        pb.setKeywords(NEW_KEYWRODS)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.keywords).toBe(NEW_KEYWRODS)
    })

    const NEW_DESCRIPTION = 'new description'
    makeTestEditProduct('изменение описания', (product) => {
        const pb = new ProductBuilder(product)
        pb.setDescription(NEW_DESCRIPTION)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.description).toBe(NEW_DESCRIPTION)
    })

    const NEW_HIT = '0'
    makeTestEditProduct('изменение статуса хита', (product) => {
        const pb = new ProductBuilder(product)
        pb.setHit(NEW_HIT)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct.hit).toBe(NEW_HIT)
    })

    const NEW_WRONG_STATUS = '2'
    makeTestEditProduct('изменение статуса числом вне диапазона', (product) => {
        const pb = new ProductBuilder(product)
        pb.setStatus(NEW_WRONG_STATUS)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct).toBe(null)
    })

    const NEW_WRONG_HIT = '2'
    makeTestEditProduct('изменение статуса хита числом вне диапазона', (product) => {
        const pb = new ProductBuilder(product)
        pb.setHit(NEW_WRONG_HIT)
        return pb.product
    }, (oldProduct, newProduct) => {
        expect(newProduct).toBe(null)
    })

    describe('не корректное', () => {
        const NEW_WRONG_CATEGORY = '0'
        makeTestEditProduct('изменение категории', (product) => {
            const pb = new ProductBuilder(product)
            pb.setCategory(NEW_WRONG_CATEGORY)
            return pb.product
        }, (oldProduct, newProduct) => {
            expect(newProduct).toBe(null)
        })

        const NEW_WRONG_PRICE = '-1'
        makeTestEditProduct('изменение цены', (product) => {
            const pb = new ProductBuilder(product)
            pb.setPrice(NEW_WRONG_PRICE)
            return pb.product
        }, (oldProduct, newProduct) => {
            expect(newProduct).toBe(null)
        })

        const NEW_WRONG_OLD_PRICE = '-1'
        makeTestEditProduct('изменение старой цены', (product) => {
            const pb = new ProductBuilder(product)
            pb.setOldPrice(NEW_WRONG_OLD_PRICE)
            return pb.product
        }, (oldProduct, newProduct) => {
            expect(newProduct).toBe(null)
        })
    })
})

afterAll(async () => {
    await api.deleteAllProducts()
    console.log('cOMPLeTE')
}, config.MAX_TIMEOUT)

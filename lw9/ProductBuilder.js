const config = require('./config.json')
const Api = require('./api')
const api = new Api(config.BASE_URL)

const STATUS_ON = "1"
const STATUS_OFF = "0"

class ProductBuilder {

    constructor(product = null) {
        if (product) {
            this.product = product
        } else {
            this.product = this.createProduct()
        }
    }

    createProduct() {
        return {
            //"id": 100,
            "category_id": "1",
            "title": "Custom name",
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

    setTitle(title) {
        this.product.title = title
    }

    setCategory(category_id) {
        this.product.category_id = category_id
    }

    setContent(content) {
        this.product.content = content
    }

    setPrice(price) {
        this.product.price = price
    }

    setOldPrice(old_price) {
        this.product.old_price = old_price
    }

    setStatus(status) {
        this.product.status = status
    }

    setKeywords(keywords) {
        this.product.keywords = keywords
    }

    setDescription(description) {
        this.product.description = description
    }

    setHit(hit) {
        this.product.hit = hit
    }
}

module.exports = ProductBuilder

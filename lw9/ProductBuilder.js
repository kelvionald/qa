const config = require('./config.json')
const Api = require('./api')
const api = new Api(config.BASE_URL)

const STATUS_ON = "1"
const STATUS_OFF = "0"

class ProductBuilder {
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
}

module.exports = ProductBuilder

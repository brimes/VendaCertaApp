const Storage = require('./Storage')

class SaleStorage extends Storage {
    data = ''
    storageName = '@saleData'
}

module.exports = SaleStorage;

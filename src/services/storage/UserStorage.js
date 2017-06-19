const Storage = require('./Storage')

class UserStorage extends Storage {
    data = ''
    storageName = '@userData'
}

module.exports = UserStorage;

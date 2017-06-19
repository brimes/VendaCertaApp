import UserStorage from "../services/storage/UserStorage"

class UserModel {
  cpf = ''
  cnpj = ''
  errors = new Array()

  validate () {
    if (!this.cpf) {
      this.errors.push("CPF precisa ser informado")
    }

    if (!this.cnpj) {
      this.errors.push("CNPJ precisa ser informado")
    }

    return (this.errors.length == 0)
  }

  async persist () {
    let userStorage = new UserStorage()
    userStorage.data = {
      cpf: this.cpf,
      cnpj: this.cnpj
    }
    let result = await userStorage.persist()
    return result;
  }

  async load () {
    let userStorage = new UserStorage()
    let usersData = await userStorage.loadAll()
    let user = {
      cpf: '',
      cnpj: ''
    }
    if (usersData.length > 0) {
      user = usersData[0]
    }
    return user
  }
}

module.exports = UserModel

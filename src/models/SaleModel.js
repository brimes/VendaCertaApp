import SaleStorage from "../services/storage/SaleStorage"
import UserModel from "./UserModel"

class SaleModel {
  cpf = ''
  cnpj = ''
  authorizationCode = ''
  authorizationDate = ''
  errors = new Array()

  validate () {
    if (!this.cpf) {
      this.errors.push("CPF precisa ser informado")
    }

    if (!this.cnpj) {
      this.errors.push("CNPJ precisa ser informado")
    }

    if (!this.authorizationCode) {
      this.errors.push("Nº de autorização precisa ser informado")
    }

    if (!this.authorizationDate) {
      this.errors.push("Data de autorização precisa ser informada")
    }

    return (this.errors.length == 0)
  }

  async persistUserData () {
    let user = new UserModel()
    user.cpf = this.cpf
    user.cnpj = this.cnpj
    return await user.persist()
  }

  async persist () {
    let userSaved = await this.persistUserData()
    if (!userSaved) {
      this.errors.push("Falha ao salvar usuário")
      console.log("Falha ao salvar usuário")
      return false;
    }

    let saleStorage = new SaleStorage()
    saleStorage.data = {
      cpf: this.cpf,
      cnpj: this.cnpj,
      authorizationCode: this.authorizationCode,
      authorizationDate: this.authorizationDate,
      status: 'Aguardando',
    }
    let result = await saleStorage.append()
    return result;
  }

  async load () {
    let saleStorage = new SaleStorage()
    let sales = await saleStorage.loadAll()
    return sales    
  }

  async sendSale () {
    if (!this.validate()) {
      return {
        status: 'error',
        message: this.errors.join(", ")
      }
    }

    let isDataSaved = await this.persist();
    if (!isDataSaved) {
      return {
        status: 'error',
        message: 'Erro ao salvar os dados! ' + this.errors.join(", ")
      };
    }

    return {
      status: 'success',
      message: 'Os dados da sua venda foram enviados e serão analisados. '
      + 'Em até 24h te confirmaremos se estará tudo certo!'
    };
  }



}

module.exports = SaleModel

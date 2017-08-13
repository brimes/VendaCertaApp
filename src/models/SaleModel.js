import SaleStorage from "../services/storage/SaleStorage"
import Utils from "../components/Utils"
import SaleApi from "../services/api/SaleApi"
import UserModel from "./UserModel"

var utils = new Utils();

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

        if (!this.validateCpj()) {
            this.errors.push("O número do CPF não é um número válido")
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

        if (!this.validateDate()) {
            this.errors.push("A data informada não é válida. O formato válido é Dia/Mês/Ano ")
        }

        return (this.errors.length == 0)
    }

    validateDate () {
        let expReg = /^((0[1-9]|[12]\d)\/(0[1-9]|1[0-2])|30\/(0[13-9]|1[0-2])|31\/(0[13578]|1[02]))\/(19|20)?\d{2}$/;
        let date = this.authorizationDate
        if (!date) {
            console.log('empty')
            return false
        }

        if (!date.match(expReg)) {
            console.log('not match')
            return false
        }

      	let dia = date.substring(0,2);
      	let mes = date.substring(3,5);
      	let ano = date.substring(6,10);
      	if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30) {
            console.log('not match 1 ' + dia + ' - ' + mes + ' - ' + ano)
            return false
      	} else if ((ano % 4) != 0 && mes == 2 && dia > 28) {
            console.log('not match 2')
      	    return false
        } else if ((ano % 4) == 0 && mes == 2 && dia > 29) {
            console.log('not match 3')
      	    return false
        }

        return true
    }

    validateCpj () {
    let cpf = this.cpf
    cpf = cpf.replace(/[^\d]+/g,'');
    if (cpf == '') {
      return false
    }

    let invalidNumbers = [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999"
    ]

    if (cpf.length != 11 || invalidNumbers.indexOf(cpf) >= 0) {
      return false;
    }

    let add = 0;
    for (i=0; i < 9; i ++) {
      add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != parseInt(cpf.charAt(9))) {
      return false;
    }

    add = 0;
    for (i = 0; i < 10; i ++) {
      add += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != parseInt(cpf.charAt(10))) {
      return false;
    }
    return true;
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
            serverID: null,
            cpf: this.cpf,
            cnpj: this.cnpj,
            authorizationCode: this.authorizationCode,
            authorizationDate: this.authorizationDate,
            status: 'Em análise',
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

    async updateSales () {
        let sales = await this.load()
        for (var i = 0; i < sales.length; i++) {
            let sale = sales[i]
            if (sale.serverID == null) {
                await this.updateSaleServerID(sale)
            }
            if (sale.serverID != null) {
                await this.updateSaleStatus(sale)
            }
        }
    }

    async updateSaleServerID (sale) {
        let api = new SaleApi()
        let storage = new SaleStorage()
        api.cpf = utils.unMask(sale.cpf, 'cpf')
        api.cnpj = utils.unMask(sale.cnpj, 'cnpj')
        api.authorizationCode = sale.authorizationCode
        api.authorizationDate = utils.dateFormat(sale.authorizationDate, 'DMY', 'ISO')
        let serverID = await api.sendSale();
        sale.serverID = serverID
        storage.data = sale
        await storage.update()
    }

    async updateSaleStatus (sale) {
        let api = new SaleApi()
        let storage = new SaleStorage()
        api.id = sale.serverID
        api.cpf = sale.cpf
        api.cnpj = sale.cnpj
        api.authorizationCode = sale.authorizationCode
        api.authorizationDate = sale.authorizationDate
        let serverSale = await api.getSale();
        if (!serverSale) {
            this.updateSaleServerID(sale)
            return true
        }
        console.log(serverSale)
        sale.status = serverSale.status
        storage.data = sale
        await storage.update()
    }

}

module.exports = SaleModel

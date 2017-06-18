
class SaleModel {
  cpf
  cnpj
  authorizationCode
  authorizationDate

  async sendSale () {
    return {
      status: 'success',
      message: 'Os dados da sua venda foram enviados e serão analisados. '
      + 'Em até 24h te confirmaremos se estará tudo certo!'
    };
  }

}

module.exports = SaleModel

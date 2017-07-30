import Request from "../../components/Request"

class SaleApi {
	id = ''
	serverID = ''
	cpf = ''
  cnpj = ''
  authorizationCode = ''
  authorizationDate = ''

	async sendSale() {
		let request = new Request;
		request.setUrl('https://venda-certa.herokuapp.com/api/query');
		request.setMethod("POST");
		let bodyString = "mutation newSale {\n"
		+ "  newSale("
		+ 'cpf: "' + this.cpf + '",'
		+ 'cnpj: "' + this.cnpj + '",'
		+ 'code: "' + this.authorizationCode + '",'
		+ 'date: "' + this.authorizationDate + '"'
		+ ") {\n"
		+ "    id\n"
		+ "  }\n"
		+ "}"
		request.setBody(bodyString);
		response = await request.response();
		responseJson = await response.json();
		return responseJson.data.newSale.id;
	}

	async getSale() {
		let request = new Request;
		request.setUrl('https://venda-certa.herokuapp.com/api/query');
		request.setMethod("POST");
		let bodyString = "query getSale {\n"
		+ '  sales(id: "' + this.id + '") {\n'
		+ "    id\n"
		+ "    status\n"
		+ "    code\n"
		+ "    date\n"
		+ "    cpf\n"
		+ "    cnpj\n"
		+ "  }\n"
		+ "}"
		request.setBody(bodyString);
		response = await request.response();
		responseJson = await response.json();
		if (responseJson.data.sales) {
			return responseJson.data.sales[0]
		}

		return null;
	}
}

module.exports = SaleApi;

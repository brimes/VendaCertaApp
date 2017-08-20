import Request from "../../components/Request"
import GraphQL from "../../components/GraphQL"
import Settings from "../../configuration/Settings"

class SaleApi {
	id = ''
	serverID = ''
	cpf = ''
    cnpj = ''
    authorizationCode = ''
    authorizationDate = ''
    settings = new Settings();

	async sendSale() {
        console.log('send')
        let request = new Request;
        let bodyString = null
        let graphQL = new GraphQL();
        graphQL.setType("mutation");
        graphQL.setName("newSale");
        graphQL.addField('venda', 'CPFBalconista: "' + this.cpf + '",'
            + 'CNPJLoja: "' + this.cnpj + '",'
            + 'NumeroAutorizacao: ' + this.authorizationCode + ','
            + 'DataAutorizacao: "' + this.authorizationDate + '"'
        );
		request.setUrl(this.settings.getFullUrl());
		request.setMethod("POST");
		bodyString = JSON.stringify(graphQL.getJsonQuery())
		request.setBody(bodyString);
		response = await request.response();
		responseJson = await response.json();
        if (responseJson.errors != undefined) {
            console.log(responseJson.errors)
        }
        console.log(responseJson)
		return (responseJson.data != undefined) ? responseJson.data.venda : null;
	}

	async getSale() {
        let bodyString = "";
        let request = new Request;
        let graphQL = new GraphQL();
        graphQL.setType("query");
        graphQL.setName("getSale");
        graphQL.addField('venda', 'id: ' + this.id + '');
        graphQL.addField('venda.status');
        graphQL.addField('venda.NumeroAutorizacao');
        graphQL.addField('venda.DataAutorizacao');
        graphQL.addField('venda.CPFBalconista');
        graphQL.addField('venda.CNPJLoja');

		request.setUrl(this.settings.getFullUrl());
		request.setMethod("POST");
        bodyString = JSON.stringify(graphQL.getJsonQuery())
		request.setBody(bodyString);
		response = await request.response();
        try {
            responseJson = await response.json();
        } catch(error) {
            console.log(error);
            return null;
        }
		if (responseJson.data.venda) {
			return {
                "status": responseJson.data.venda.status,
                "cpf": responseJson.data.venda.CPFBalconista,
                "cnpj": responseJson.data.venda.CNPJLoja,
                "authorizationCode": responseJson.data.venda.NumeroAutorizacao,
                "authorizationDate": responseJson.data.venda.DataAutorizacao,
            }
		}
		return null;
	}
}

module.exports = SaleApi;

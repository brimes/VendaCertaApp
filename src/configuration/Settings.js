class Settings {
    host = "www.codigogarcia.com.br"
    urlType = "https"
    endpoint = "dev/funcional/api/"

    changeToTestAPI() {
        this.host = "venda-certa.herokuapp.com"
        this.urlType = "https"
        this.endpoint = "api/query"
    }

    getFullUrl() {
        if (testModeActivated) {
            this.changeToTestAPI()
        }

        let fullUrl = this.urlType + '://' +  this.host + '/' + this.endpoint
        console.log(fullUrl);
        return fullUrl;
    }
}

module.exports = Settings

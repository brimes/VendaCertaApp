class GraphQL {
    queryType = ""
    queryName = ""
    queryContent = {}

    setType(type) {
        this.queryType = type
    }

    setName(name) {
        this.queryName = name
    }

    addField(value, params) {
        if (value.indexOf('.') < 1) {
            this.queryContent[value] = {
                params: (params != undefined) ? params : null,
                content: {}
            }
            return;
        }
        let valueArray = value.split('.');
        let rootItem = valueArray[0];
        let currentContent = this.queryContent[rootItem]['content'];
        let newContent = this.addContent(valueArray.slice(1), currentContent, params);
        this.queryContent[rootItem]['content'] = newContent;
    }

    addContent(values, content, params) {
        let rootItem = values[0];
        let newContent = content;
        if (values.length == 1) {
            newContent[rootItem] = {
                params: (params != undefined) ? params : null,
                content: {}
            }
            return newContent;
        }
        let currentContent = newContent[rootItem]['content']
        return this.addContent(values.slice(1), currentContent, params)
    }

    getContentSubItem(content, level) {
        if (!content) {
            return "";
        }
        let identation = "";
        for (var x = 0; x <= (level + 1); x++) {
            identation += "  ";
        }
        let subItemContent = "{\n";
        for (var fieldName in content) {
            let fieldData = content[fieldName]
            subItemContent += identation + fieldName;
            if (fieldData.params) {
                subItemContent += " (" + fieldData.params + ")";
            }
            if (Object.keys(fieldData.content).length != 0) {
                subItemContent += this.getContentSubItem(fieldData.content, level + 1);
            }
            subItemContent += "\n";
        }
        subItemContent += "}"
        return subItemContent
    }

    getQuery() {
        let queryString = "";
        queryString += this.queryType + " " + this.queryName + "{\n"
        for (var fieldName in this.queryContent) {
            let fieldData = this.queryContent[fieldName]
            queryString += "  " + fieldName;
            if (fieldData.params) {
                queryString += " (" + fieldData.params + ")";
            }
            if (Object.keys(fieldData.content).length != 0) {
                queryString += this.getContentSubItem(fieldData.content, 1);
            }
            queryString += "\n";
        }
        queryString += "}"
        return queryString
    }

    getJsonQuery() {
        return {
            "query": this.getQuery(),
            "variables": null
        };
    }
}

module.exports = GraphQL

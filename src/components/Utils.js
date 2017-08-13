class Utils {
    unMask(value, type) {
        if (type == 'cpf') {
            return value.replace(/-|\./g, "")
        }
        if (type == 'cnpj') {
            return value.replace(/-|\.|\//g, "")
        }
        return value
    }

    dateFormat(value, from, to) {
        let dateFields = []

        if (from == 'DMY') {
            let dateSplited = value.split("/");
            dateFields = [dateSplited[2], dateSplited[1], dateSplited[0]]
        }

        if (from == 'ISO') {
            let dateSplited = value.split("-");
            dateFields = dateSplited;
        }

        if (to == 'ISO') {
            return dateFields.join("-")
        }

        if (to == 'DMY') {
            return [dateFields[2], dateFields[1], dateFields[0]].join('/')
        }

        return value
    }
}

module.exports = Utils

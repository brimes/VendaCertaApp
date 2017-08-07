import React, { Component, PropTypes } from 'react';
import { StyleSheet, Image, Text, View, ScrollView } from 'react-native';
import { ListItem, Subheader } from 'react-native-material-ui';
import { TextInputMask } from 'react-native-masked-text';
import DatePicker from 'react-native-datepicker';

// Import models
const SaleModel = require('../models/SaleModel')

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 18,
    paddingLeft: 24,
    paddingRight: 24,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  item: {
    marginTop: 23,
    marginBottom: 10,
    borderColor: '#000',
    borderWidth: 2,
  },
  headerItem: {
    fontSize: 18
  }
});

class MySalesScene extends Component {
	constructor(props) {
    super(props);
    this.state = {
      mySales: [],
      text: "asd"
    };
  }

  updateSalesView (sales) {
    let model = new SaleModel()
    let statusColors = {
      "Em análise": "#f4ee42",
      "Válida": "#43A047",
      "Inválida": "#F44336",
    }
    model.load().then((sales) => {
      let salesView = []
      for (var i = 0; i < sales.length; i++) {
        let sale = sales[i]
        let statusColor = "#000";
        if (typeof statusColors[sale.status] != undefined) {
          statusColor = statusColors[sale.status]
        }
        salesView.push(
          <ListItem
              key={i}
              divider
              dense
              centerElement={{
                  primaryText: sale.authorizationDate + ' - Nº ' + sale.authorizationCode,
                  secondaryText: sale.status,
              }}
              style={{
                  secondaryText: { color: statusColor },
              }}/>
        )
      }
      this.setState({mySales: salesView})
    })
  }

  async updateSalesDatabase () {
    let model = new SaleModel();
    await model.updateSales();
    return true
  }

  componentDidMount () {
    this.updateSalesView()
    this.updateSalesDatabase().then(() => {
      this.updateSalesView()
    })
  }

  render () {
	    return (
        <View style={styles.container}>
        	<Image source={require('../../assets/image/logo.png')} />
          <ScrollView style={styles.listContainer}>
            <Subheader text="Minhas vendas" />
            {this.state.mySales}
          </ScrollView>

        </View>
	  	)
	}
}

export default MySalesScene

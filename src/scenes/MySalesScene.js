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
    model.load().then((sales) => {
      let salesView = []
      for (var i = 0; i < sales.length; i++) {
        var sale = sales[i]
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
                  secondaryText: { color: "#F00" },
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

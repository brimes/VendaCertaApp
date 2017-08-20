import React, { Component, PropTypes } from 'react';
import { StyleSheet, Image, Text, View, ScrollView } from 'react-native';
import { ListItem, Subheader, Card } from 'react-native-material-ui';
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
        backgroundColor: "#EEE"
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
    },
    cardStyle: {
        padding: 15
    }
});

class MySalesScene extends Component {
	constructor(props) {
    super(props);
    this.state = {
      mySales: [],
      text: ""
    };
  }

  updateSalesView (sales) {
    let model = new SaleModel()
    let statusColors = {
      "Em análise": { bg: "#f4ee42", font: "#555" },
      "Válida": { bg: "#43A047", font: "#FFFFFF" },
      "Inválida": { bg: "#F44336", font: "#FFFFFF" }
    }
    model.load().then((sales) => {
      let salesView = []
      for (var i = (sales.length - 1); i >= 0; i--) {
        let sale = sales[i]
        let bgStatusColor = "#FFFFFF";
        let fontStatusColor = "#000";
        if (statusColors[sale.status] != undefined) {
          bgStatusColor = statusColors[sale.status].bg;
          fontStatusColor = statusColors[sale.status].font;
        }
        salesView.push(
            <Card key={i} >
                <View style={styles.cardStyle}>
                    <Text>Autorização {sale.authorizationCode} em {sale.authorizationDate} </Text>
                    <Text style={{
                        color: fontStatusColor,
                        marginTop: 10,
                        padding: 3,
                        textAlign: "center",
                        borderRadius: 3,
                        fontWeight: 'bold',
                        backgroundColor: bgStatusColor,
                    }}>{("" + sale.status).toUpperCase()}</Text>
                </View>
            </Card>
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

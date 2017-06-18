import React, { Component, PropTypes } from 'react';
import { StyleSheet, Image, Text, View, ScrollView } from 'react-native';
import { setTheme, MKColor } from 'react-native-material-kit';
import { Button, COLOR, ListItem, Subheader } from 'react-native-material-ui';
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
  information: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    margin: 5,
  },
  textfield: {
    width: "100%",
    marginBottom: 10,
  },
  inlineDate: {
    flex: 0,
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  inlineDateTextField: {
    width: '90%',
  },
  button: {
    alignSelf: 'flex-end',
    width: "100%",
		marginBottom: 6
  }
});

class SaleItem extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <View>
        <Text>{this.props.authorizationDate} - Venda 123122333 </Text>
        <Text>Aguardando</Text>
      </View>
    )
  }
}

class MySalesScene extends Component {
	constructor(props) {
    super(props);
    this.state = {
      cpf: '',
      cnpj: '',
      authorizationCode: '',
      authorizationDate: '',
      sendButtonText: 'Enviar',
      mySalesButtonText: 'Minhas vendas',
      isButtonDisabled: false,
    };
  }

  render () {
	    return (
        <View style={styles.container}>
        	<Image source={require('../../assets/image/logo.png')} />
          <ScrollView style={styles.listContainer}>
            <Subheader text="Minhas vendas" />
            <ListItem
                divider
                dense
                centerElement={
                  <SaleItem
                    authorizationDate='01/01/2017'
                    authorizationCode='807342'/>
                }
                onPress={() => {}}
            />
            <ListItem
                divider
                dense
                centerElement={
                  <SaleItem
                    authorizationDate='01/01/2017'
                    authorizationCode='807342'/>
                }
                onPress={() => {}}
            />
            <ListItem
                divider
                dense
                centerElement={
                  <SaleItem
                    authorizationDate='01/01/2017'
                    authorizationCode='807342'/>
                }
                onPress={() => {}}
            />
            <ListItem
                divider
                dense
                centerElement={
                  <SaleItem
                    authorizationDate='01/01/2017'
                    authorizationCode='807342'/>
                }
                onPress={() => {}}
            />
            <ListItem
                divider
                dense
                centerElement={
                  <SaleItem
                    authorizationDate='01/01/2017'
                    authorizationCode='807342'/>
                }
                onPress={() => {}}
            />
            <ListItem
                divider
                dense
                centerElement={
                  <SaleItem
                    authorizationDate='01/01/2017'
                    authorizationCode='807342'/>
                }
                onPress={() => {}}
            />
          </ScrollView>

        </View>
	  	)
	}
}

export default MySalesScene

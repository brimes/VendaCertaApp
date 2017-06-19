import React, { Component, PropTypes } from 'react';
import { StyleSheet, Image, Text, View, Alert } from 'react-native';
import { setTheme, MKTextField, MKColor } from 'react-native-material-kit';
import { Button, COLOR } from 'react-native-material-ui';
import { TextInputMask } from 'react-native-masked-text';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';

// Import models
const SaleModel = require('../models/SaleModel')
const UserModel = require('../models/UserModel')

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

// Screen elements
const Textfield = MKTextField.textfieldWithFloatingLabel()
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
  })
  .withStyle(styles.textfield)
  .build();

const TextfieldDate = MKTextField.textfieldWithFloatingLabel()
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
  })
  .withStyle(styles.inlineDateTextField)
  .build();

class HomeScene extends Component {
	constructor(props) {
    super(props);
    let currentDate = new Date()
    let maxDate = currentDate.toISOString().substr(0, 10).split('-').reverse().join('/')
    this.state = {
      cpf: '',
      cnpj: '',
      authorizationCode: '',
      authorizationDate: '',
      sendButtonText: 'Enviar',
      mySalesButtonText: 'Minhas vendas',
      isButtonDisabled: false,
      maxDate: maxDate
    };
    let user = new UserModel()
    user.load().then((user) => {
      this.setState(user)
    });

  }

  sendSale () {
    let sale = new SaleModel
    sale.cpf = this.state.cpf
    sale.cnpj = this.state.cnpj
    sale.authorizationCode = this.state.authorizationCode
    sale.authorizationDate = this.state.authorizationDate

    this.setState({sendButtonText: "Aguarde...", isButtonDisabled: true})

    sale.sendSale().then((saleStatus) => {
      Alert.alert('Venda Certa', saleStatus.message);
      if (saleStatus.status == 'success') {
        this.setState({
          authorizationCode: '',
          authorizationDate: ''
        })
        Actions.mySales();
      }

      this.setState({sendButtonText: "Enviar", isButtonDisabled: false})
    });
  }

  mySales () {
    Actions.mySales();
  }

  render () {
	    return (
	        <View style={styles.container}>
	        	<Image source={require('../../assets/image/logo.png')} />
	        	<Text style={styles.information}>
							Insira os dados das transações que realizou pela Funcional para computar seus pontos!
						</Text>
            <TextInputMask
              style={styles.textfield}
            	type={'cpf'}
              value={this.state.cpf}
            	customTextInput={Textfield}
              onChangeText={(cpf) => this.setState({cpf: cpf})}
              placeholder="CPF" />

            <TextInputMask
              value={this.state.cnpj}
              style={styles.textfield}
            	type={'cnpj'}
            	customTextInput={Textfield}
              onChangeText={(cnpj) => this.setState({cnpj: cnpj})}
            	placeholder="CNPJ" />

            <TextInputMask
              value={this.state.authorizationCode}
              style={styles.textfield}
            	type={'only-numbers'}
            	customTextInput={Textfield}
              onChangeText={(authorizationCode) => this.setState({authorizationCode: authorizationCode})}
            	placeholder="Nº de autorização" />

            <View style={styles.inlineDate}>
              <TextInputMask
                value={this.state.authorizationDate}
                style={styles.inlineDateTextField}
              	type={'datetime'}
                options={{
  	               format: "DD/MM/YYYY"
  	            }}
              	customTextInput={TextfieldDate}
              	placeholder="Data de autorização" />

              <DatePicker
                style={styles.inlineDatePicker}
                date={this.state.authorizationDate}
                mode="date"
                placeholder="Selecione a data"
                format="DD/MM/YYYY"
                maxDate={this.state.maxDate}
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                showIcon={true}
                hideText={true}
                onDateChange={(date) => {this.setState({authorizationDate: date})}}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    marginLeft: 0
                  },
                }} />

            </View>
						<View style={styles.button}>
							<Button
		            raised
                accent
		            text={this.state.sendButtonText}
		            disabled={this.state.isButtonDisabled}
                onPress={() => this.sendSale()}
		          />
					  </View>
						<View style={styles.button}>
						  <Button
						    raised
						    text={this.state.mySalesButtonText}
						    disabled={this.state.isButtonDisabled}
                onPress={() => this.mySales()}
						  />
					  </View>
	        </View>
	  	)
	}
}

export default HomeScene

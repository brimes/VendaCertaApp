import React, { Component, PropTypes } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
  Linking,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { setTheme, MKTextField, MKColor } from "react-native-material-kit";
import { Button, COLOR } from "react-native-material-ui";
import { TextInputMask } from "react-native-masked-text";
import DatePicker from "react-native-datepicker";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/Ionicons";

// Import models
const SaleModel = require("../models/SaleModel");
const UserModel = require("../models/UserModel");

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 18,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 30,
    height: "100%",
    backgroundColor: "#EEE"
  },
  information: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    margin: 5
  },
  information2: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    margin: 5
  },
  textfield: {
    width: "100%",
    marginBottom: 10
  },
  inlineDate: {
    flex: 0,
    flexDirection: "row",
    marginBottom: 20,
    width: "100%"
  },
  inlineDateTextField: {
    width: "100%",
    paddingRight: 60
  },
  inlineDatePicker: {
    left: -60,
    width: 35
  },
  inlineDateInfo: {
    left: -60
  },
  button: {
    alignSelf: "flex-end",
    width: "100%",
    marginBottom: 6
  },
  link: {
    marginTop: 24,
    color: "#00F"
  }
});

// Screen elements
const Textfield = MKTextField.textfieldWithFloatingLabel()
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: "italic",
    fontWeight: "200"
  })
  .withStyle(styles.textfield)
  .build();

const TextfieldDate = MKTextField.textfieldWithFloatingLabel()
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: "italic",
    fontWeight: "200"
  })
  .withStyle(styles.inlineDateTextField)
  .build();

class HomeScene extends Component {
  count = 0;
  constructor(props) {
    super(props);
    let date = new Date();
    let maxDate = this.getFormatedDate(date);
    date.setDate(date.getDate() - 1);
    let minDate = this.getFormatedDate(date);
    this.state = {
      cpf: "",
      cnpj: "",
      authorizationCode: "",
      authorizationDate: maxDate,
      sendButtonText: "Enviar",
      mySalesButtonText: "Minhas vendas",
      isButtonDisabled: false,
      maxDate: maxDate,
      minDate: minDate
    };
    let user = new UserModel();
    user.load().then(user => {
      this.setState(user);
    });
  }

  getFormatedDate(date) {
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    return day + "/" + month + "/" + date.getFullYear();
  }

  countToTest() {
    this.count++;
    if (this.count >= 10) {
      alert(
        "Modo de teste ativado. Para desativar será necessário reiniciar o APP."
      );
      testModeActivated = true;
      return;
    }
    if (this.count > 7) {
      alert(
        "Mais " +
          (10 - this.count) +
          " toque(s) no logo " +
          " para ativar o modo de teste"
      );
      return;
    }
  }

  sendSale() {
    let sale = new SaleModel();
    sale.cpf = this.state.cpf;
    sale.cnpj = this.state.cnpj;
    sale.authorizationCode = this.state.authorizationCode;
    sale.authorizationDate = this.state.authorizationDate;

    this.setState({ sendButtonText: "Aguarde...", isButtonDisabled: true });

    sale.sendSale().then(saleStatus => {
      Alert.alert("Venda Certa", saleStatus.message);
      if (saleStatus.status == "success") {
        this.setState({
          authorizationCode: "",
          authorizationDate: ""
        });
        Actions.mySales();
      }

      this.setState({ sendButtonText: "Enviar", isButtonDisabled: false });
    });
  }

  mySales() {
    Actions.mySales();
  }

  goToPortal() {
    Linking.openURL("http://www.funcionalcorp.com.br/vendacerta").catch(err =>
      console.error("An error occurred", err)
    );
  }

  dateInformation() {
    alert(
        "Apenas vendas realizadas nos dias de ontem e hoje poderão ser computadas."
        + " Se tiver alguma dúvida, entre em contato com o SAC Funcional pelo"
        + " FAQ do portal do programa."
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.countToTest()}>
            <Image source={require("../../assets/image/logo.png")} />
          </TouchableOpacity>
          <Text style={styles.information}>
            Você realiza suas vendas Funcional pelo sistema próprio de sua rede?
          </Text>
          <Text style={styles.information2}>
            Utilize os campos abaixo para inserir os dados dessas vendas que
            realizou para garantir seus números da sorte no programa Venda
            Certa!
          </Text>
          <TextInputMask
            style={styles.textfield}
            type={"cpf"}
            value={this.state.cpf}
            textInputStyle={{ height: 24 }}
            customTextInput={Textfield}
            onChangeText={cpf => this.setState({ cpf: cpf })}
            placeholder="CPF"
          />

          <TextInputMask
            value={this.state.cnpj}
            style={styles.textfield}
            textInputStyle={{ height: 24 }}
            type={"cnpj"}
            customTextInput={Textfield}
            onChangeText={cnpj => this.setState({ cnpj: cnpj })}
            placeholder="CNPJ"
          />

          <TextInputMask
            value={this.state.authorizationCode}
            style={styles.textfield}
            textInputStyle={{ height: 24 }}
            type={"only-numbers"}
            customTextInput={Textfield}
            onChangeText={authorizationCode =>
              this.setState({ authorizationCode: authorizationCode })}
            placeholder="Nº de autorização"
          />

          <View style={styles.inlineDate}>
            <TextInputMask
              value={this.state.authorizationDate}
              style={styles.inlineDateTextField}
              textInputStyle={{ height: 24 }}
              type={"datetime"}
              options={{
                format: "DD/MM/YYYY"
              }}
              customTextInput={TextfieldDate}
              onChangeText={authorizationDate =>
                this.setState({ authorizationDate: authorizationDate })}
              placeholder="Data de autorização"
            />

            <DatePicker
              style={styles.inlineDatePicker}
              date={this.state.authorizationDate}
              mode="date"
              placeholder="Selecione a data"
              format="DD/MM/YYYY"
              maxDate={this.state.maxDate}
              minDate={this.state.minDate}
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              showIcon={true}
              hideText={true}
              onDateChange={date => {
                this.setState({ authorizationDate: date });
              }}
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 10,
                  marginLeft: 0
                }
              }}
            />

            <View style={styles.inlineDateInfo}>
              <Icon.Button
                name="md-information-circle"
                size={30}
                backgroundColor="#EEE"
                color="#355820"
                onPress={() => {this.dateInformation()}}
              />
            </View>
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
          <Text style={styles.link} onPress={() => this.goToPortal()}>
            Acessar portal do programa
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default HomeScene;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
const PaymentForm = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const BACKEND_URL = "http://localhost:3000/process-payment";

  const tokenizeCard = async () => {
    try {
      const response = await axios.post(BACKEND_URL, {
        cardDetails: {
          token_type: "credit_card",
          holder_name: paymentDetails.cardHolderName,
          expiration_date: paymentDetails.expirationDate,
          card_number: paymentDetails.cardNumber,
        },
        amount: 385785,
        currency: "ZAR",
      });

      if (response.data.success) {
        ToastAndroid.show(
          "Payment Successful",
          "Your payment has been processed.",
          ToastAndroid.SHORT
        );
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      ToastAndroid.show(
        "Payment Failed",
        "There was an issue processing your payment.",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <View style={styles.imageContainer}> */}
      <ImageBackground
        source={require("../../assets/card.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      ></ImageBackground>
      {/* </View> */}

      <View style={styles.container}>
        <Text style={styles.title}>Debit/Credit Card</Text>
        <View style={styles.cardIcons}>
          <FontAwesome name="cc-mastercard" size={24} color="red" />{" "}
          <FontAwesome name="cc-visa" size={24} color="orange" />
          <Fontisto name="american-express" size={24} color="blue" />{" "}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={paymentDetails.cardHolderName}
            onChangeText={(text) =>
              setPaymentDetails((prev) => ({ ...prev, cardHolderName: text }))
            }
          />
          <TextInput style={styles.input} placeholder="Last Name" />
        </View>
        <TextInput
          style={styles.inputFull}
          placeholder="Card Number"
          value={paymentDetails.cardNumber}
          onChangeText={(text) =>
            setPaymentDetails((prev) => ({ ...prev, cardNumber: text }))
          }
          keyboardType="number-pad"
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Expiry Date"
            value={paymentDetails.expirationDate}
            onChangeText={(text) =>
              setPaymentDetails((prev) => ({ ...prev, expirationDate: text }))
            }
            keyboardType="number-pad"
          />
          {/* <View style={styles.cvvContainer}> */}
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={paymentDetails.cvv}
            onChangeText={(text) =>
              setPaymentDetails((prev) => ({ ...prev, cvv: text }))
            }
            keyboardType="number-pad"
          ></TextInput>
          {/* <TouchableOpacity>
              <Text style={styles.infoIcon}>ℹ️</Text>
            </TouchableOpacity> */}
          {/* </View> */}
        </View>
        <TouchableOpacity style={styles.button} disabled>
          <Text style={styles.buttonText} onPress={tokenizeCard}>
            Complete Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    // flex: 1,
    // gap: 150,
    // backgroundColor: "#f5f5f5",
  },
  imageBackground: {
    // backgroundColor: "black",
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
    top: 30,
    borderRadius: 10,
  },
  imageContainer: {
    // position: "absolute",
    // top: 509
  },
  container: {
    height: 550,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    // margin: 20,
    // bottom: -50,
    gap: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardIcons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    height: 60,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#F9F9FA",
  },
  inputFull: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F9F9FA",
  },
  cvvContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 16,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#966CC6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PaymentForm;

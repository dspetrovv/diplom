import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Alert, BackHandler} from 'react-native';
import { Navbar } from './comps/Navbar'
import {Note} from "./comps/Note";
import {CurrencyBlock} from './comps/CurrencyBlock';
import {FlatList} from "react-native";
import {NavigationContainer, useFocusEffect} from "@react-navigation/native";
import {BanksBlock} from "./comps/BanksBlock";
import {Dimensions, StatusBar} from "react-native";
import {MapViewer} from "./comps/MapViewer";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as SplashScreen from 'expo-splash-screen';
import NetInfo from "@react-native-community/netinfo";
import {InformationBlock} from "./comps/InformationBlock";

const Tab = createBottomTabNavigator();
const CurrencyIcon = (props) => (
  <MaterialCommunityIcons
      name={"currency-usd"}
      size={24}
      color={props.focused ? 'blue' : 'black'}
  />
);
const BankIcon = (props) => (
    <MaterialCommunityIcons
        name={"bank"}
        size={24}
        color={props.focused ? 'blue' : 'black'}
    />
);
const MapIcon = (props) => (
    <MaterialCommunityIcons
        name={"map-marker"}
        size={24}
        color={props.focused ? 'blue' : 'black'}
    />
);
const InfoIcon = (props) => (
    <MaterialCommunityIcons
        name={"information"}
        size={24}
        color={props.focused ? 'blue' : 'black'}
    />
);

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const STATUS_BAR = StatusBar.statusBarHeight;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const NAVBAR = DEVICE_HEIGHT - WINDOW_HEIGHT;

function InformationPage({navigation}) {
    return (
        <View style={styles.container}>
            <Navbar title='О приложении' navigation={navigation}/>
            <InformationBlock />
        </View>
    )
}

function BanksPage({navigation, banks}){

  const renderBanksBlock = ({item}) => (
    <BanksBlock navigation={navigation} bankName={item[0].name} rusName={item[0].rusName} banks={item} />
  )

  return (
      <View style={styles.container}>
        <Navbar title='Банки' navigation={navigation}/>
        <View style={styles.contentView}>
          <FlatList
              data={banks}
              renderItem={renderBanksBlock}
              keyExtractor={(item) => item[0].id}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: NAVBAR}}
          />
        </View>
      </View>
  );
}

function CurrenciesPage({navigation, currencies}){
  const [notes, setNote] = useState([])
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert("Выйти", "Закрыть приложение?", [
                    {
                        text: "Нет",
                        onPress: () => null
                    },
                    {
                        text: "Да",
                        onPress: () => BackHandler.exitApp()
                    }
                ]);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

  const renderCurrencyBlock = ({item}) => (
      <CurrencyBlock key={item[0].id} currencyName={item[0].name} rusName={item[0].rusName} currencies={item} />
  )

  const createInputBlock = (txt) => {
    const newInputBlock = {
      id: Date.now().toString(),
      title: txt
    }

    setNote((prevNotes) => {
      return [
        ...prevNotes,
        newInputBlock
      ]
    })
  }

  return (
      <View style={styles.container}>
        <Navbar title='Валюта' navigation={navigation}/>
        <View style={styles.contentView}>
          <FlatList
              data={currencies}
              renderItem={renderCurrencyBlock}
              keyExtractor={(item) => item[0].id}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: NAVBAR}}
          />
        </View>
      </View>
  );
}

function MyNavigator(props){
  return (
      <Tab.Navigator
          tabBarOptions={{
            activeBackgroundColor: 'rgba(99,187,255,0.5)'
          }}
      >
        <Tab.Screen name={'Валюта'} children={
          (props1) => (
              <CurrenciesPage
                navigation={props1.navigation}
                currencies={props.currencies}
              />
          )
        } options={{
          tabBarIcon: CurrencyIcon,
          tabBarLabel: () => {return null}
        }}/>
        <Tab.Screen name={'Банки'} children={
          (props1) => (
              <BanksPage
                  navigation={props1.navigation}
                  banks={props.banks}
              />
          )
        } options={{
          tabBarIcon: BankIcon,
          tabBarLabel: () => {return null}
        }}/>
        <Tab.Screen name={'Карта'} children={
          ({route}) =>
              (
                  <MapViewer
                      banks={props.banks}
                      currencies={props.currencies}
                      bankNames={props.bankNames}
                      currNames={props.currNames}
                      route={route}
                  />
              )
        } options={{
          tabBarIcon: MapIcon,
          tabBarLabel: () => {return null}
        }}/>
        <Tab.Screen name={'О приложении'} children={
            ({route}) => (
                <InformationPage
                    route={route}
                />
            )
        } options={{
            tabBarIcon: InfoIcon,
            tabBarLabel: () => {return null}
        }}
        />
      </Tab.Navigator>
  )
}

export default function App() {
  const [banks, setBanks] = useState([]);
  const [listOfBanks, setListOfBanks] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [listOfCurrencies, setListOfCurrencies] = useState([]);
  const [errors, setError] = useState('');
  const [isReady,setReady] = useState(false);


  useEffect(() => {
    start()
  },[]);

  useEffect(() => {
  const createAlertMessage = (errorText) =>
      Alert.alert(
          "Ошибка соединения",
          errorText,
          [
              {
                  text: "Ок"
              },
              {
                  text: errors,
                  onPress: () => BackHandler.exitApp()
              }
          ]
      );
    let errorText = 'Ошибка сервера. Попробуйте подключиться позже.';
    if (errors === 'No connection'){
        errorText = 'Невозможно установить соединение. Проверьте подключение к Интернету.'
    }
    if (errors !== '') {
        createAlertMessage(errorText);
    }
  },[errors])

  async function setBankData(response) {
    let json = await response.json();
    let arr = [];
    await json.map(async bank => {
      let newBank = {
        id: bank._id,
        address: bank.address,
        latitude: bank.latitude,
        longitude: bank.longitude,
        name: bank.name,
        rusName: bank.rusName,
        workingHours: bank.workingHours,
        phone: bank.phone
      }
      await arr.push(newBank);
    });
    setBanks((prevBank) => {
      return [...prevBank, arr]
    });
  }

  async function setCurrencyData(response) {
    let json = await response.json();
    let arr = [];
    await json.map(async currency => {
      let newCurr = {
        id: currency._id,
        bank: currency.bank,
        buyValue: currency.buyValue,
        sellValue: currency.sellValue,
        name: currency.name,
        rusBankName: currency.rusBankName,
        time: currency.time,
        date: currency.date,
        rusName: currency.rusName,
        note: currency.note,
        sumFrom: currency.sumFrom,
        sumTo: currency.sumTo
      }
      await arr.push(newCurr);
    });
    setCurrencies((prevCurr) => {
      return [...prevCurr, arr]
    });
  }

  async function getBankList(url,attempts) {
      let response = await fetch(url);
      console.log(response.status);
      if (response.ok) {
          let json = await response.json();
          let arr = [];
          await json.map(async bank => {
              let newBank = {
                  id: bank._id.name,
                  name: bank._id.name,
                  rusName: bank._id.rusName,
                  type: 'bank'
              }
              await arr.push(newBank);
          });
        if (arr.length === 0 && attempts < 10){
          attempts++;
          setTimeout(getBankList, 1000, url, attempts);
        } else {
          setListOfBanks(arr);
          return arr;
        }
      } else {
          setError(response.status);
      }
  }

    async function getCurrencyList(url,attempts) {
        let response = await fetch(url);
        if (response.ok) {
            let json = await response.json();
            let arr = [];
            await json.map(async bank => {
                let newCurrency = {
                    id: bank._id.name,
                    name: bank._id.name,
                    rusName: bank._id.rusName,
                    type: 'currency'
                }
                await arr.push(newCurrency);
            });
            if (arr.length === 0 && attempts < 10){
              attempts++;
              setTimeout(getCurrencyList, 1000, url, attempts);
            } else {
              setListOfCurrencies(arr);
              return arr;
            }
        } else {
            setError(response.status);
        }
    }


  async function start() {
    await SplashScreen.preventAutoHideAsync();
    //console.log('Starting app');
    let connection;
    await NetInfo.fetch().then(state => {
        if (!state.isConnected) {
            setError('No connection');
        }
    });
    //console.log(connection);
    let bankURL = 'https://diplomprjc.herokuapp.com/api/banks/';
    let currenciesURL = 'https://diplomprjc.herokuapp.com/api/currencies/';
    let banksList = 'https://diplomprjc.herokuapp.com/api/banks';
    let currenciesList = 'https://diplomprjc.herokuapp.com/api/currencies';

    let attempts = 1;
    await setBanks([]);
    await setCurrencies([]);
    await setListOfBanks([]);
    await setListOfCurrencies([]);
    const BANKS = await getBankList(banksList,attempts);
    const CURRENCIES = await getCurrencyList(currenciesList,attempts);
	
    BANKS.map(async bankName => {
      let response = await fetch(bankURL + bankName.name);
      if (response.ok) {
          await setBankData(response);
      } else {
          await setError(response.status);
      }
    });
    CURRENCIES.map(async currency => {
      let response = await fetch(currenciesURL + currency.name);
      if (response.ok) {
          await setCurrencyData(response);
      } else {
          await setError(response.status);
      }
    });
    await SplashScreen.hideAsync();
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#15A3E5"/>
      <MyNavigator
          banks={banks}
          currencies={currencies}
          bankNames={listOfBanks}
          currNames={listOfCurrencies}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  flatStyle: {
    flexGrow: 0
  },
  inputBlock: {
    marginBottom: 2
  },
  newclass: {
    fontSize: 50,
  },
  newcolor: {
    color: 'red',
  },
  contentView: {
    width: '100%',
    paddingVertical: 0,
  }
});

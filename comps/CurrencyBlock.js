import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import CollapsibleView from "@eliav2/react-native-collapsible-view"
import {ActivityIndicator} from "react-native";
import {ModalWindow} from "./ModalWindow";

class Banks extends Component {
    constructor(props) {
        super(props);
        this.setModalVisible = this.setModalVisible.bind(this)
        this.state = {
            currencies: props.currencies,
            modalWindow: null,
            sellProfit: props.currencies.reduce(
                (prev,curr) => prev.sellValue > curr.sellValue ? prev : curr
            ),
            buyProfit:  props.currencies.reduce(
                (prev,curr) => prev.buyValue < curr.buyValue ? prev : curr
            ),
            id: null
        }
    }

    componentDidMount() {
        console.log(this.state.sellProfit);
    }

    setModalVisible(name,sumFrom,sumTo,bank,id,buy,sell,timeValue,dateValue,note,rusBankName){
        console.log(id);
        this.setState({
            modalWindow: <ModalWindow
                currency={name}
				sumFrom={sumFrom}
				sumTo={sumTo}
                name={bank}
                key={Date.now().toString()}
                id={id}
                buyValue={buy}
                //minBuyValue={((name === 'dollar1' || name === 'euro1') && bank === 'vtb') ? '30000' : '1'}
                sellValue={sell}
                //minSellValue={((name === 'dollar1' || name === 'euro1') && bank === 'vtb') ? '30000' : '999999'}
                timeValue={timeValue}
                dateValue={dateValue}
                note={note}
                bankName={rusBankName}
                modalVisible={true}/>,
            id: Date.now().toString(),
        })
    }

    render() {
        return (
            <View>
                <View style={styles.banksBlock}>
                    <Text style={[styles.tableHeaderName,styles.tableHeaderBorder]}>Банк</Text>
                    <Text style={[styles.tableHeaderCur,styles.tableHeaderBorder]}>Куп.</Text>
                    <Text style={[styles.tableHeaderCur,styles.tableHeaderBorder]}>Прод.</Text>
                </View>
                {this.state.currencies.map(el => {
                    const buyValue = parseFloat(el.buyValue).toFixed(2);
                    const sellValue = parseFloat(el.sellValue).toFixed(2);
                    const touchableStyle = [];
                    const buyProfit = [];
                    const sellProfit = [];
                    if (el.id === this.state.currencies[this.state.currencies.length-1].id) {
                        touchableStyle.push(styles.banksBlock);
                    } else {
                        touchableStyle.push(styles.banksBlock);
                        touchableStyle.push(styles.banksBorder);
                    }
                    if (el.id === this.state.sellProfit.id) {
                        sellProfit.push({
                            backgroundColor: '#80ff52'
                        });
                    }
                    if (el.id === this.state.buyProfit.id) {
                        buyProfit.push({
                            backgroundColor: '#38d7ff'
                        });
                    }/*
                    if (el.id === this.state.buyProfit.id && this.state.sellProfit.id) {
                        touchableStyle.push({
                            borderWidth: 2,
                            borderTopColor: 'blue',
                            borderRightColor: 'blue',
                            borderLeftColor: 'green',
                            borderBottomColor: 'green'
                        });
                    }*/
                    //TODO FIX MAP
                    return (
                        <View key={el.id}>
                            <TouchableOpacity
                                style={
                                    touchableStyle
                                }
                                activeOpacity={0.5}
                                onPress={() => {
                                    this.setModalVisible(
                                        el.name,
										el.sumFrom,
										el.sumTo,
                                        el.bank,
                                        el.id,
                                        buyValue,
                                        sellValue,
                                        el.time,
                                        el.date,
                                        el.note,
                                        el.rusBankName
                                    )
                                    }
                                }
                            >
                                <Text style={styles.bankName}>{el.rusBankName}
                                </Text>
                                <Text style={[styles.buyCur,buyProfit]}>{buyValue}</Text>
                                <Text style={[styles.buyCur,sellProfit]}>{sellValue}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
                {this.state.modalWindow}
            </View>
        )
    }
}

export class CurrencyBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: true,
            currencies: props.currencies,
            currencyName: props.currencyName,
            rusName: props.rusName,
            id: props.id
        }
    }

    render(){
        return (
            <View style={{alignItems: 'center'}}>
                <CollapsibleView
                    noArrow={true}
                    style={styles.currencyBlock}
                    title={
                        <View style={styles.indicator}>
                            <Text style={styles.title}>{this.state.rusName}</Text>
                            {!this.state.isReady && <ActivityIndicator color="#000000"/>}
                        </View>
                    }
                >
                    {this.state.isReady && <Banks currencies={this.state.currencies} key={this.state.id}/>}
                    <Text key={this.state.id} style={{fontSize: 18, textAlign: 'center', paddingVertical: 3}}>↑ Свернуть ↑</Text>
                </CollapsibleView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    currencyBlock: {
        width: '90%',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderColor: 'rgba(175,175,175,0.5)',
        alignItems: 'flex-start',
    },
    bankCourse: {
        flex: 1
    },
    bankName: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 0.60,
        fontSize: 18
    },
    buyProfitStyle: {
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderStyle: 'solid'
    },
    currencyCourse: {
        fontSize: 18,
        paddingRight: 6
    },
    indicator: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    banksBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    banksBorder: {
        borderRadius: 2,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.3)'
    },
    sellProfitStyle: {
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderStyle: 'solid'
    },
    tableHeaderBorder: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.5)',
        paddingLeft: 2,
    },
    tableHeaderName: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 0.60,
        fontSize: 14,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    tableHeaderCur: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 0.20,
        fontSize: 14,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    title: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 24,
        textAlignVertical: 'center',
        textAlign: 'justify'
    },
    mainText: {
        width: '100%',
        justifyContent: 'space-between',
    },
    buyCur: {
        flex: 0.20,
        height: '100%',
        paddingLeft: 2,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        backgroundColor: 'transparent',
        paddingVertical: 5,
        paddingHorizontal: 5,
        textAlignVertical: 'center',
        textAlign: 'center'
    }
})

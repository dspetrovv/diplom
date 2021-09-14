import {Modal, Text, StyleSheet, TextInput, View, FlatList} from 'react-native'
import React, {Component} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            note:[
                {
                    id: props.id,
                    note: props.note
                }],
        }
    }

    render() {
        return (
            <FlatList
                data={this.state.note}
                renderItem={(item) => {
                    console.log('item: ',this.state.id);
                    return (
                        <View style={{alignItems: 'center', flexDirection: 'row', marginVertical: 5}}>
                            <Text style={{fontSize: 16}}>
                                <MaterialCommunityIcons name="alert-circle" size={16} color="black" />
                                {item.item.note}
                            </Text>
                        </View>
                    )
                }}
                keyExtractor={(item) => this.state.id}
                showsVerticalScrollIndicator={false}
            />
        )
    }
}

export class ModalWindow extends  Component {
    constructor(props) {
        super(props);
        this.setModalVisible = this.setModalVisible.bind(this)
        this.changeSumRubToCurrency = this.changeSumRubToCurrency.bind(this)
        this.changeSumCurrencyToRub = this.changeSumCurrencyToRub.bind(this)
        this.state = {
            currency: props.currency,
            bankName: props.name,
			sumFrom: props.sumFrom,
			sumTo: props.sumTo,
            bankId: props.id,
            modalVisible: props.modalVisible,
            buyValue: props.buyValue,
            //minBuyValue: props.minBuyValue,
            buyInput: '',
            sellValue: props.sellValue,
            //minSellValue: props.minSellValue,
            sellInput: '',
            timeValue: (props.timeValue.length === 4) ? (props.timeValue.slice(0,3)+'0'+props.timeValue.slice(3)) : props.timeValue,
            dateValue: props.dateValue,
            note: props.note,
            noteBlock: null,
            rusBankName: props.bankName,
            rubs: '',
            currencyOne: ''
        }
    }

    componentDidMount() {

        console.log(this.state.modalVisible);
        if (this.state.note !== undefined && this.state.note !== ''){
            this.setState({
                noteBlock: <Note note={this.state.note} id={this.state.bankId} />
            });
        }
    }

    setModalVisible(){
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    changeSumRubToCurrency(number){
        let sum = this.state.buyValue * number;

        if (!isNaN(sum) && number !== '' && !number.match(/\D/g)) {
            if (number.indexOf('.') + 1) {
                this.setState({
                    currencyOne: 'Целые числа!',
                    sellInput: number
                });
                return;
            }
            if (this.state.bankName === 'vtb') {
                if ((this.state.sumFrom !== undefined)) {
                    sum = this.state.buyValue * (this.state.sumFrom + parseFloat(number));
                } else if (this.state.sumTo !== undefined && parseFloat(number) > this.state.sumTo) {
                    console.log(this.state.sumTo)
                    sum = this.state.buyValue * this.state.sumTo;
                    number = this.state.sumTo;
                }
                if (parseFloat(number) < 300) {
                    sum -= 300;
                }
            } else if (this.state.bankName === 'vostochniy') {
                if (this.state.currency === 'dollar' && parseFloat(number) === 1) {
                    sum -= 50;
                } else if (parseFloat(number) >= 1 && parseFloat(number) < 300) {
                    sum -= 100;
                }
            } else if (this.state.bankName === 'otkritie') {
                if (parseFloat(number) < 300) {
                    sum -= 250;
                }
            } else if (this.state.bankName === 'psbank') {
                if ((this.state.sumFrom !== undefined)
                    && sum <= this.state.sumFrom) {
                    sum = this.state.buyValue * (this.state.sumFrom + parseFloat(number));
                } else if ((this.state.sumTo !== undefined)
                    && sum > this.state.sumFrom) {
                    number = this.state.sumTo / this.state.buyValue;
                    number = Math.floor(number);
                    sum = number * this.state.buyValue;
                    number = number.toString();
                }
            }
            this.setState({
                currencyOne:
                    (sum > 0)
                    ? ((sum.toFixed(20)%1 === 0) ? sum : sum.toFixed(2))
                    : 'Комиссия',
                sellInput: number
            })
        } else {
            if (number === '')
                this.setState({
                    currencyOne: '',
                    sellInput: number
                })
            else
                this.setState({
                    currencyOne: '',
                    sellInput: number
                })
        }
    }

    changeSumCurrencyToRub(number){
        let sum = this.state.sellValue * number;

        if (!isNaN(sum) && number !== '' && !number.match(/\D/g)) {
            if (number.indexOf('.') + 1) {
                this.setState({
                    currencyOne: 'Целые числа!',
                    sellInput: number
                });
                return;
            }
            if (this.state.bankName === 'vtb') {
                if ((this.state.sumFrom !== undefined)) {
                    sum = this.state.sellValue * (this.state.sumFrom + parseFloat(number));
                } else if (this.state.sumTo !== undefined && parseFloat(number) > this.state.sumTo) {
                    sum = this.state.sellValue * this.state.sumTo;
                    number = this.state.sumTo;
                }
                if (parseFloat(number) < 300) {
                    sum += 300;
                }
            } else if (this.state.bankName === 'vostochniy') {
                if (this.state.currency === 'dollar' && parseFloat(number) === 1) {
                    sum += 50;
                } else if (parseFloat(number) >= 1 && parseFloat(number) < 300) {
                    sum += 100;
                }
            } else if (this.state.bankName === 'otkritie') {
                if (parseFloat(number) < 300) {
                    sum += 250;
                }
            } else if (this.state.bankName === 'psbank') {
                if (this.state.sumFrom !== undefined && sum <= this.state.sumFrom) {
                    sum = this.state.sellValue * (this.state.sumFrom + parseFloat(number));
                } else if (this.state.sumTo !== undefined && sum > this.state.sumTo) {
                    number = this.state.sumTo / this.state.sellValue;
                    number = Math.floor(number);
                    sum = number * this.state.sellValue;
                    number = number.toString();
                }
            }
            this.setState({
                rubs: (sum.toFixed(20)%1 === 0) ? sum : sum.toFixed(2),
                buyInput: number
            })
        } else {
            if (number === '')
                this.setState({
                    rubs: '',
                    buyInput: number
                })
            else
                this.setState({
                    rubs: '',
                    buyInput: number
                })
        }
    }

    componentWillUnmount() {
        console.log('unmounted');
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {this.setModalVisible();}}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalBody}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalBankName}>
                                {this.state.rusBankName}
                            </Text>
                        </View>

                        {/*Sell*/}
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.modalTextConverter}>Продать свои</Text>
                        </View>
                        <View style={styles.modalBlock}>
                            <TextInput
                                style={styles.currencyInput}
                                keyboardType={'number-pad'}
                                placeholder={'1'}
                                maxLength={9}
                                value={this.state.sellInput}
                                onChangeText={(rub) => {
                                    this.changeSumRubToCurrency(rub)
                                }
                                }
                            />
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.modalTextConverter}>=</Text>
                            </View>
                            <TextInput
                                style={styles.currencyInput}
                                keyboardType={'number-pad'}
                                placeholder={this.state.buyValue.toString()}
                                value={this.state.currencyOne.toString()}
                            />
                        </View>

                        {/*Buy*/}
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.modalTextConverter}>Купить у банка</Text>
                        </View>
                        <View style={styles.modalBlock}>
                            <TextInput
                                style={styles.currencyInput}
                                keyboardType={'number-pad'}
                                placeholder={'1'}
                                maxLength={9}
                                value={this.state.buyInput}
                                onChangeText={(currency) => {
                                    this.changeSumCurrencyToRub(currency)
                                }
                                }
                            />
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.modalTextConverter}>=</Text>
                            </View>
                            <TextInput
                                style={styles.currencyInput}
                                keyboardType={'number-pad'}
                                placeholder={this.state.sellValue.toString()}
                                value={this.state.rubs.toString()}
                            />
                        </View>

                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.modalTextConverter}>
                                Дата обновления:
                            </Text>
                            <Text style={styles.dateTimeStyle}>
                                {this.state.dateValue} {this.state.timeValue}
                            </Text>
                        </View>
                        {this.state.noteBlock}
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20
    },
    modalBody: {
        margin: 20,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 20,
        paddingTop: 15,
        paddingBottom: 10,
        paddingHorizontal: 7
    },
    currencyInput: {
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        paddingHorizontal: 5,
        paddingVertical: 7,
        fontSize: 16,
        width: '45%'
    },
    dateTimeStyle: {
        fontSize: 16
    },
    modalTextConverter: {
        fontSize: 20,
        paddingBottom: 5
    },
    modalBankName: {
        fontSize: 24,
        textAlign: 'center'
    },
    modalBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    modalHeader: {
        textAlignVertical: 'center'
    }
})
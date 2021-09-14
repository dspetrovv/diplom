import React, {Component} from 'react'
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import {ActivityIndicator, Text, View, StyleSheet, TouchableOpacity} from "react-native";

class BanksInfoList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            banks: props.banks,
            navigation: props.navigation,
            daysOfTheWeek: [
                {
                    id: 'monday',
                    name: 'Понедельник'
                },
                {
                    id: 'tuesday',
                    name: 'Вторник'
                },
                {
                    id: 'wednesday',
                    name: 'Среда'
                },
                {
                    id: 'thursday',
                    name: 'Четверг'
                },
                {
                    id: 'friday',
                    name: 'Пятница'
                },
                {
                    id: 'saturday',
                    name: 'Суббота'
                },
                {
                    id: 'sunday',
                    name: 'Воскресенье'
                },
            ]
        }
    }

    render() {
        return (
            <View>
                {this.state.banks.map(el => {
                    let phone = el.phone;
                    let phoneArr = phone.split(';');
                    return (
                        <View key={el.id}>
                            <CollapsibleView
                                noArrow={true}
                                style={styles.addressBlock}
                                title={
                                    <Text style={styles.addressText}>{el.address}</Text>
                                }
                            >
                                <View style={styles.workSchedule}>
                                    {this.state.daysOfTheWeek.map(day => {
                                        return (
                                            <View style={styles.workDays} key={day.id}>
                                                <Text
                                                    style={
                                                        day.id === this.state.daysOfTheWeek[this.state.daysOfTheWeek.length-1].id
                                                            ? [styles.dayName,styles.workBorders,{borderBottomWidth: 0}]
                                                            : [styles.dayName,styles.workBorders]
                                                    }>
                                                    {day.name}
                                                </Text>
                                                <Text
                                                    style={
                                                        day.id === this.state.daysOfTheWeek[this.state.daysOfTheWeek.length-1].id
                                                            ? [styles.workTime]
                                                            : [styles.workTime,styles.borderBottomStyle]
                                                    }>
                                                    {el.workingHours[day.id]}
                                                </Text>
                                            </View>
                                        )
                                    })}
                                </View>
                                <View >
                                    <Text style={{fontSize: 18,textAlign: 'center'}}>
                                        Контактный телефон:
                                    </Text>
                                    {phoneArr.map(el1 => {
                                        el1 += ' ';
                                        return (
                                            <View key={el.id}>
                                                <Text
                                                    style={{textAlign: 'center'}}
                                                >
                                                    {el1}
                                                </Text>
                                            </View>
                                        )
                                    })}
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <TouchableOpacity
                                        style={styles.btnToMap}
                                        onPress={
                                            () => {
                                                console.log('1:', el.latitude)
                                                this.state.navigation.navigate(
                                                    'Карта',
                                                    {
                                                        bank: el.name,
                                                        centerLat: el.latitude,
                                                        centerLong: el.longitude
                                                    })
                                            }
                                        }
                                    >
                                        <Text style={styles.btnToMapText}>Показать на карте</Text>
                                    </TouchableOpacity>
                                </View>
                            </CollapsibleView>
                        </View>
                    )
                })}
            </View>
        );
    }
}

export class BanksBlock extends Component{
    constructor(props) {
        super(props);
        this.getBanksInfo = this.getBanksInfo.bind(this)
        this.state = {
            isReady: true,
            banks: props.banks,
            navigator: props.navigation,
            bankName: props.bankName,
            rusName: props.rusName,
            id: props.id
        }
    }

    componentDidMount() {
        /*if (this.state.bankName !== undefined) {
            this.getBanksInfo()
        }*/
    }

    getBanksInfo(){
        let url = 'https://diplomprjc.herokuapp.com/api/banks/'
        fetch(url+this.state.bankName)
            .then(async response => {
                let json = await response.json();
                this.setState({
                    banks: json,
                    isReady: true
                })
            });
    }

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <CollapsibleView
                    noArrow={true}
                    style={styles.banksBlock}
                    title={
                        <View style={styles.indicator}>
                            <Text style={styles.title}>{this.state.rusName}</Text>
                            {!this.state.isReady && <ActivityIndicator color="#000000"/>}
                        </View>
                    }
                >
                    {this.state.isReady && <BanksInfoList navigation={this.state.navigator} banks={this.state.banks} key={this.state.id}/>}
                    <Text style={{fontSize: 18, textAlign: 'center', paddingVertical: 3}}>↑ Свернуть ↑</Text>
                </CollapsibleView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    addressBlock: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.3)'
    },
    addressText: {
        color: '#000000',
        fontSize: 18,
        textAlign: 'justify'
    },
    banksBlock: {
        width: '90%',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderColor: 'rgba(175,175,175,0.5)',
        alignItems: 'flex-start',
    },
    borderBottomStyle: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.3)'
    },
    btnToMap: {
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        width: '55%',
        marginTop: 5
    },
    btnToMapText: {
        fontSize: 16,
        paddingVertical: 3
    },
    dayName: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 0.60,
        fontSize: 16
    },
    indicator: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 24,
        textAlignVertical: 'center',
        textAlign: 'justify'
    },
    workBorders: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.3)'
    },
    workDays: {
        flexDirection: 'row'
    },
    workSchedule: {
        marginTop: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.5)'
    },
    workTime: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 0.40,
        fontSize: 16
    }
})

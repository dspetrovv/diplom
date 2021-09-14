import React, {useEffect, useState} from 'react';
import {Modal} from "react-native";
import {Text, View, StyleSheet} from "react-native";

export const MapModal = (props) => {
    const [bank, setBAnk] = useState(props.bankName);
    const [workingHours, setHours] = useState(props.workingHours);
    const [address, setAddress] = useState(props.address);
    const [visible, setModalVisible] = useState(props.visible);

    useEffect(() => {
        return () => {
            console.log('AAAAAAND ITS GONE!!!');
            setModalVisible(!visible)
        }
    })

    const daysOfTheWeek = [
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
    ];

    const modalVisible = (visible) => {
        setModalVisible(visible)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                modalVisible(false)
            }}
        >
            <View style={styles.modalView}>
                <View>
                    <Text style={styles.modalHeader}>
                        {bank}
                    </Text>
                </View>
                <View>
                    <Text style={styles.modalAddress}>
                        {address}
                    </Text>
                </View>
                <View style={styles.workSchedule}>
                    {daysOfTheWeek.map(day => {
                        return (
                            <View style={styles.workDays} key={day.id}>
                                <Text
                                    style={
                                        day.id === daysOfTheWeek[daysOfTheWeek.length-1].id
                                            ? [styles.dayName,styles.workBorders,{borderBottomWidth: 0}]
                                            : [styles.dayName,styles.workBorders]
                                    }>
                                    {day.name}
                                </Text>
                                <Text
                                    style={
                                        day.id === daysOfTheWeek[daysOfTheWeek.length-1].id
                                            ? [styles.workTime]
                                            : [styles.workTime,styles.borderBottomStyle]
                                    }>
                                    {workingHours[day.id]}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    borderBottomStyle: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(175,175,175,0.3)'
    },
    dayName: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 0.60,
        fontSize: 16
    },
    modalAddress: {
        textAlignVertical: 'center',
        fontSize: 18,
        textAlign: 'center'
    },
    modalHeader: {
        textAlignVertical: 'center',
        fontSize: 24,
        textAlign: 'center'
    },
    modalView: {
        flex: 1,
        marginHorizontal: '10%',
        marginVertical: '50%',
        padding: 10,
        backgroundColor: 'rgba(246,246,246,0.8)'
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
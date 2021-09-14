import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const InformationBlock = () => {
    const Notes = (
        <Text style={{fontWeight: 'bold'}}>
            Примечание:
        </Text>
    );
    const Authors = (
        <Text style={{fontWeight: 'bold'}}>
            Автор:
        </Text>
    );
    return (
        <View>
            <Text style={[styles.txt, {marginTop: 15}]}>
                {Authors} студент 345 группы Петров Дмитрий.
            </Text>
            <Text style={[styles.txt,{marginTop: 10}]}>
                {Notes} представленная в приложении информация является ознакомительной.
                Банки могут не иметь представленной валюты в наличии, а
                курсы в банках могут отличаться от представленных в приложении.
            </Text>
            <Text style={[styles.txt,{marginTop: 10,fontWeight: 'bold'}]}>
                Обратная связь:
            </Text>
            <Text style={styles.txt}>
                example@example.com
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    txt: {
        marginHorizontal: 15,
        textAlign: 'justify',
        fontSize: 18,
    }
})
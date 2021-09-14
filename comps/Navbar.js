import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Button} from "react-native";
import {Image} from "react-native";

const reactLogo = require('../image/logo.png');

export const Navbar = (props) => {
    return (
        <View style={styles.navbar}>
            <Image
                style={styles.logo}
                source={reactLogo}
            />
            <Text style={styles.text}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: "100%",
        marginLeft: 10
    },
    navbar: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5e400'
    },
    sideMenuButton: {
        fontSize: 18,
        color: '#2df807',
        flex: 0.4,
    },
    text: {
        fontSize: 24,
        color: '#0363d9',
        width: '100%',
        position: 'absolute',
        textAlign: 'center',
    }
})
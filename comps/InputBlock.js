import React, {useState} from 'react'
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';

export const InputBlock = (props) => {
    const [txt, setTitle] = useState('')
    const pressBtn = () => {
        if (txt.trim()) {
            props.onSubmit(txt)
            setTitle('')
        } else {
            Alert.alert(txt)
        }
    }

    return (
        <View style={styles.blockStyle}>
            <TextInput
                style={styles.txtInput}
                onChangeText={setTitle}
                value={txt}
                placeholder='Write something'
            />
            <Button title='Add' onPress={pressBtn}/>
        </View>
    )
}

const styles = StyleSheet.create({
    blockStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txtInput: {
        width: '70%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#64666d',
        padding: 10
    }
})
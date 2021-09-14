import React from 'react'
import { Text , View, StyleSheet} from "react-native"

export const Note = (props) => {
    return (
        <View style={styles.noteStyle}>
            <Text>{props.note.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    noteStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#645e5e',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
})
import React, {Component} from 'react'
import {View, StyleSheet, Text, FlatList} from 'react-native'
import {WebViewLeaflet} from "react-native-webview-leaflet";
import {Modal} from "react-native";
import {TouchableOpacity} from "react-native";
import {ModalWindow} from "./ModalWindow";
import {MapModal} from "./MapModal";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {BanksBlock} from "./BanksBlock";

export class MapViewer extends Component {
    constructor(props) {
        super(props);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setMapModalVisible = this.setMapModalVisible.bind(this);
        this.changeModalList = this.changeModalList.bind(this);
        this.getBanksMarkers = this.getBanksMarkers.bind(this);
        this.state = {
            startBank:
                (props.route !== undefined &&
                    props.route.params !== undefined &&
                        props.route.params.bank !== undefined) ?
                    props.route.params.bank :
                    null,
            markers: [],
            renderModalBanks: ({item}) => (
                <BanksBlock navigation={navigation} bankName={item[0].name} rusName={item[0].rusName} banks={item} />
            ),
            isMarkersReady: false,
            banks: props.banks,
            currencies: props.currencies,
            bankNamesForModal: props.bankNames,
            currNamesForModal: props.currNames,
            modalVisible: false,
            mapModal: null,
            isBankIconPressed: true,
            modalList: props.bankNames,
            route: props.route,
            centerLat:
                (props.route !== undefined &&
                    props.route.params !== undefined &&
                    props.route.params.centerLat !== undefined) ?
                    props.route.params.centerLat :
                    61.6688034,
            centerLong:
                (props.route !== undefined &&
                    props.route.params !== undefined &&
                        props.route.params.centerLong !== undefined) ?
                    props.route.params.centerLong :
                    50.8357785,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.route !== undefined &&
            this.props.route.params !== undefined &&
            (
                this.props.route.params.centerLat !== undefined &&
                this.props.route.params.centerLat !== prevState.centerLat &&
                this.props.route.params.centerLat !== this.state.centerLat
            ) &&
            (
                this.props.route.params.centerLong !== undefined &&
                this.props.route.params.centerLong !== prevState.centerLong &&
                this.props.route.params.centerLong !== this.state.centerLong
            )
        ){
            console.log('useless updated: ', this.props.route.params.centerLat);
            console.log('useless : ', this.state.centerLat);
            let arr = [];
            arr = this.getBanksMarkers(this.props.route.params.bank,arr)
            this.setState({
                centerLat: (this.props.route.params.centerLat === undefined) ? '61.6688034' : this.props.route.params.centerLat,
                centerLong: (this.props.route.params.centerLong === undefined) ? '50.8357785' : this.props.route.params.centerLong,
                markers: arr
            })
        }
        console.log('lat: ',prevState.centerLat);
        console.log('long: ',this.state.centerLong);
    }

    componentDidMount() {
        console.log('mounted');
        console.log('Route: ',this.state.route);

        console.log('currencies: ',this.state.currencies);
        if (this.state.startBank !== null) {
            let arr = [];
            arr = this.getBanksMarkers(this.state.startBank, arr);
            this.setState({
                markers: arr
            });
        }
        //this.makeMarkers();
    }

    getBanksMarkers(bankName,arr) {
        this.setState({
            markers: []
        })
        this.state.banks.map(el1 => el1.map(el => {
            if (el.name === bankName) {
                console.log('bank:', bankName);
                const newMarker = {
                    id: el.id,
                    position: {
                        lat: el.latitude,
                        lng: el.longitude
                    },
                    size: [32, 32],
                    icon: '🚩'
                }
                arr.push(newMarker);
            }
        }));
        return arr;
    }

    async makeMarkers(name,type) {
        await this.setState({
            markers: [],
            isMarkersReady: !this.state.isMarkersReady
        })
        let arr = [];
        console.log('name: ',name);
        if (type === 'bank') {
            arr = this.getBanksMarkers(name,arr);
        } else if (type === 'currency') {
            let arrBanks = [];
            await this.state.currencies.map(el1 => el1.map(async el => {
                console.log(el);
                if (el.name === name) {
                    arrBanks.push(el.bank);

                }
            }));
            const uniqueBanks = Array.from(new Set(arrBanks));
            uniqueBanks.forEach(el => this.getBanksMarkers(el,arr));
        }
        this.setState({
            markers: arr,
            isMarkersReady: !this.state.isMarkersReady
        });
        /*let url = 'https://diplomprjc.herokuapp.com/api/banks/';
        let json = [];
        fetch(url+'sber')
            .then(async response => {
                json = await response.json();

                //console.log(json.length)
                let arr = [];
                await json.map(el => {
                    const newMarker = {
                        id: el._id,
                        position: {
                            lat: el.latitude,
                            lng: el.longitude
                        },
                        size: [32,32],
                        icon: '🍇'
                    }
                    console.log(el._id);

                    console.log(el.address);
                    arr.push(newMarker);
                });
                this.setState({
                    markers: arr
                })
            });*/
    }

    setMapModalVisible(id) {
        let workingHours = {};
        let bankName = '';
        let address = '';
        this.state.banks.map(el1 => el1.map(el => {
            if (el.id === id){
                workingHours = el.workingHours;
                bankName = el.rusName;
                address = '(' + el.address + ')';
            }
        }));
        console.log(workingHours);
        this.setState({
            mapModal: <MapModal
                workingHours={workingHours}
                bankName={bankName}
                address={address}
                visible={true}
                key={id}
            />
        })
    }

    setModalVisible() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    changeModalList(type) {
        this.setState({
            modalList: (type === 'banks') ?
                this.state.bankNamesForModal :
                this.state.currNamesForModal,
            isBankIconPressed: !this.state.isBankIconPressed
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible()
                    }}
                >
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.modalHeader}>
                                Настройки
                            </Text>
                        </View>
                        <View style={styles.modalChoose}>
                            <TouchableOpacity
                                style={
                                    [
                                        styles.modalChooseBorders,
                                        {
                                            borderTopLeftRadius: 7,
                                            borderRightWidth: 0
                                        },
                                        (this.state.isBankIconPressed) ?
                                            styles.iconStylePressed :
                                            styles.iconStyle
                                    ]
                                }
                                disabled={this.state.isBankIconPressed}
                                onPress={
                                    () => {
                                        this.changeModalList('banks')
                                    }
                                }
                            >
                                <View>
                                    <MaterialCommunityIcons
                                        name={"bank"}
                                        size={18}
                                        color={this.state.isBankIconPressed ? 'blue' : 'black'}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={
                                    [
                                        styles.modalChooseBorders,
                                        {
                                            borderTopRightRadius: 7,
                                        },
                                        (this.state.isBankIconPressed) ?
                                            styles.iconStyle :
                                            styles.iconStylePressed
                                    ]
                                }
                                disabled={!this.state.isBankIconPressed}
                                onPress={
                                    () => {
                                        this.changeModalList('currency')
                                    }
                                }
                            >
                                <View>
                                    <MaterialCommunityIcons
                                        name={"currency-usd"}
                                        size={18}
                                        color={!this.state.isBankIconPressed ? 'blue' : 'black'}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={this.state.modalList}
                            renderItem={(item) => (
                                <View key={item.item.id}
                                      style={{width: '100%'}}>
                                        <TouchableOpacity
                                            style={[styles.modalTouch,{width: '100%', paddingHorizontal: 3}]}
                                            disabled={this.state.isMarkersReady}
                                            onPress={
                                                () => {
                                                    this.makeMarkers(item.item.name, item.item.type)
                                                }
                                            }
                                        >
                                            <Text style={[styles.markersChoose,{padding:10,textAlign:'justify'}]}>{item.item.rusName}</Text>
                                        </TouchableOpacity>
                                </View>
                            )
                            }
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            style={{marginTop: 5}}
                        />
                        {/*this.state.modalList.map(el => {
                            return (
                                <View key={el.id}>
                                    <Text>
                                        <TouchableOpacity
                                            style={styles.modalTouch}
                                            disabled={this.state.isMarkersReady}
                                            onPress={
                                                () => {
                                                    this.makeMarkers(el.name, el.type)
                                                }
                                            }
                                        >
                                            <Text style={styles.markersChoose}>{el.rusName}</Text>
                                        </TouchableOpacity>
                                        test1
                                    </Text>
                                </View>
                            )
                        })*/
                        }
                    </View>
                </Modal>
                <WebViewLeaflet
                    backgroundColor={'#123faf'}
                    mapCenterPosition={{lat: this.state.centerLat, lng: this.state.centerLong}}
                    zoom={18}
                    mapLayers={[
                        {
                            attribution:
                                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                            baseLayerIsChecked: true,
                            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        }
                    ]}
                    doShowDebugMessages={false}
                    onMessageReceived={(e) => {
                        if (e.event === 'onMapMarkerClicked'){
                            console.log(e.payload.mapMarkerID)
                            this.setMapModalVisible(e.payload.mapMarkerID)
                        }
                    }}
                    mapMarkers={this.state.markers}
                />
                <TouchableOpacity
                    style={styles.touchableOpacityStyle}
                    onPress={
                        () => {
                            this.setModalVisible()
                        }
                    }
                >
                    <Text style={styles.txtStyle}>Настройки</Text>
                </TouchableOpacity>
                {this.state.mapModal}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconStyle: {
        backgroundColor: 'transparent',
    },
    iconStylePressed: {
        backgroundColor: 'rgba(99,187,255,0.5)',
    },
    modalView: {
        flex: 1,
        marginHorizontal: '20%',
        marginVertical: '50%',
        padding: 10,
        backgroundColor: 'rgba(246,246,246,0.8)'
    },
    markersChoose: {
        fontSize: 16,
        padding: 3
    },
    modalChoose: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    modalChooseBorders: {
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 5
    },
    modalHeader: {
        textAlignVertical: 'center',
        fontSize: 24,
        textAlign: 'center'
    },
    modalTouch: {
        alignItems: 'flex-start',
        borderStyle: 'solid',
        borderWidth: 1,
        backgroundColor: 'transparent'
    },
    touchableOpacityStyle: {
        alignItems: 'flex-end',
        borderStyle: 'solid',
        borderWidth: 1,
        backgroundColor: 'rgba(18,63,175, 0.3)'
    },
    txtStyle: {
        fontSize: 24,
        padding: 10
    }
})
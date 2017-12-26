import React, {Component} from 'react';
import {Alert, StyleSheet, Image, View, Text, TouchableOpacity, TextInput, AlertIOS, Dimensions, KeyboardAvoidingView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import {AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import NonServiceAreaView from '../components/NonServiceAreaView';

import {loadUserGeoCodeResult, setGeoCodeInfo, setSuppliersID, getUserGeoCodeInfo, saveSuppliers, saveSuppliersType} from '../redux/actions/geoCodeActions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {static_geoCode_data, static_data, API_Config} from '../constants';

import {savePrevPage, saveCurrentPage} from '../redux/actions/tabInfoAction';

import {getClientToken} from '../redux/actions/userRegisterActions';
import {getCartInfo, createCartInfo} from '../redux/actions/productCartActions';

const screen_width = Dimensions.get('window').width;
const screen_height = Dimensions.get('window').height;

class Button extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

class AddressView extends Component{

	constructor(props) {
	  super(props);
	  
	  this.state = {
	  	lat: null,
	  	lng: null,
	  	state: null,
	  	clientToken: null,
	  	createcartInfo: null,
	  	behavior: 'padding',
	  	street: null, 
	  	city: null,
	  	zipCode: null, 
	  	details: null,
	  	isSigned: null,
	  };
	}


	componentWillMount() {
		this.props.getClientToken();

		/*remove AsyncStorage Item used in OrderView*/
		AsyncStorage.removeItem('unit_number');
		AsyncStorage.removeItem('delivery_instruction');
		AsyncStorage.removeItem('promo_code');
		AsyncStorage.removeItem('delivery_data');
		AsyncStorage.removeItem('orderCardSelectID');
		AsyncStorage.removeItem('totalDriverTipList');
		AsyncStorage.removeItem('billingAddress');
		AsyncStorage.setItem('same_with_ship', JSON.stringify(false));
	}

	componentDidMount(){
		this.props.saveCurrentPage('address');
		this._checkIfSignedIn();
	}

	componentWillReceiveProps(nextProps) {

		const {result} = nextProps.geoCodeForm;

		if(result){

			let suppliers = result.suppliers
			
		}

		const {clientTokenResult, createcartInfo} = nextProps;
		if (clientTokenResult) {
			clientToken = 'Bearer ' + clientTokenResult.access_token;
			this.setState({clientToken: clientToken});
			
		}

		if (createcartInfo) {
			this.setState({createcartInfo: createcartInfo});
			
			if (clientTokenResult) {
				clientToken = 'Bearer ' + clientTokenResult.access_token;
				UUID = createcartInfo.guest_id;
				cartID = createcartInfo.id;
				this.props.getCartInfo(cartID, UUID, clientToken);
			}			
			
		}
	}
    async _checkIfSignedIn() {
        let signin_type;
        signin_type = JSON.parse(await AsyncStorage.getItem('signin_type'));
        if (signin_type == 'true') {
            this.setState({isSigned: true});
        }
        else {
            this.setState({isSigned:  false});
        }
    }
	_onSignIn(){
		this.props.savePrevPage('address');
		//Actions.signUpView();
		// Actions.orderConfirmationView();
		Actions.signInView();
	}

	_onLoad(details) {
		
		const geoCode = details.geometry.location
		const lat = geoCode.lat
		const lng = geoCode.lng

		let addressLength = details.address_components.length

		 if(addressLength>0)

        {
            let locationDetails=details.formatted_address;
            let  value=locationDetails.split(",");
            
            count=value.length;
            
            country=value[count-1];
            state=value[count-2];
            city=value[count-3];
            street=value[count-4];
            pin=state.split(" ");
            zipCode=pin[pin.length-1];
            state=state.replace(zipCode,' ');
            newState = state.replace(/\s+/g, '');

			this.setState({lat: lat, lng: lng, state: newState })
			this.setState({street: street, city: city, zipCode: zipCode, details: details});
        }
	}

	_setDetails(details) {
		const geoCode = details.geometry.location
		const lat = geoCode.lat
		const lng = geoCode.lng

		let addressLength = details.address_components.length

		 if(addressLength>0)

        {
            let locationDetails=details.formatted_address;
            let  value=locationDetails.split(",");
            
            count=value.length;
            
            country=value[count-1];
            state=value[count-2];
            city=value[count-3];
            street=value[count-4];
            pin=state.split(" ");
            zipCode=pin[pin.length-1];
            state=state.replace(zipCode,' ');
            newState = state.replace(/\s+/g, '');

			this.setState({lat: lat, lng: lng, state: newState })
			this.setState({street: street, city: city, zipCode: zipCode, details: details});
			this.props.setGeoCodeInfo(street, city, state, zipCode, details);

        }
	}

	_onContinue(){
		const {menuDeliveryFlag} = this.props;

		if (menuDeliveryFlag == 'select') {

			Alert.alert(
				'Warning',
				'Your cart will be emptied! Do you still want to proceed?',
				[
					{text: 'OK', onPress: () => this._onOkModal(), style: 'cancel'},
					{text: 'Cancel', onPress: () => this._onCancelModal()},
				]
			)
		}	
		else {
			this._onOkModal();
		}
	}

	_onOkModal() {
		const {lat, lng, state, clientToken} = this.state;
		if (lat && lng && state){
			if (clientToken)
                this.props.createCartInfo(clientToken);
			this._sendGeoCode(lat, lng, state);

		}else{

			console.log('Network NonExist!');
		}
	}

	async _onCancel(){
		const {isSplit} = this.props;

		let prev_details;
		prev_details = JSON.parse(await AsyncStorage.getItem('prev_details'));
		this._setDetails(prev_details);

		if (isSplit == true)
			Actions.deliveryStoreSplitView();
		else
			Actions.deliveryStoreView();
	}

	async _onCancelModal(){
		// let prev_details;
		// prev_details = JSON.parse(await AsyncStorage.getItem('prev_details'));
		// this._setDetails(prev_details);

	}

	_onLogo(){
		const {menuDeliveryFlag} = this.props;
		if (menuDeliveryFlag == 'select')
			Actions.productCategory();
	}

	/**
		Props chagnge
	**/

	async _sendGeoCode(lat, lng, state) {

		const {menuDeliveryFlag} = this.props;
		
		const {clientToken, createcartInfo} = this.state;

		let async_suppliers_body = null;
		let async_suppliers = null;

		if (clientToken != null) {
			const result = await this.props.loadUserGeoCodeResult(lat, lng, state, clientToken);
			
			if (result.result) {

				let UUID = '';
				let cartID = null;
				async_suppliers_body = result.result.data;			
				async_suppliers = result.result.data.suppliers;
				
				const {street, city, state, zipCode, details} = this.state;
				this.props.setGeoCodeInfo(street, city, state, zipCode, details);

				if (async_suppliers.length > 0){

					let ID = [];
					let type2_suppliers = [], type3_suppliers = [], type1_suppliers = [], default_suppliers = [];
					
					for(let i=0; i<async_suppliers.length; i++) {

						if (async_suppliers[i]['type'] == 2) {
							type2_suppliers.push(async_suppliers[i]['id']);
						}
						else if (async_suppliers[i]['type'] == 3) {
							type3_suppliers.push(async_suppliers[i]['id']);
						}
						else if (async_suppliers[i]['type'] == 1) {
							type1_suppliers.push(async_suppliers[i]['id']);
						}

						ID.push({
							id: async_suppliers[i].id,
						})
					}
					
					if (type1_suppliers.length > 0) {
						default_suppliers.push({id: type1_suppliers[0]});
					}
					else {

						if (type2_suppliers.length > 0 && type3_suppliers.length > 0) {
							default_suppliers.push({id: type2_suppliers[0]});
							default_suppliers.push({id: type3_suppliers[0]});
						}
						else if (type2_suppliers.length == 0 && type3_suppliers.length > 0) {
							default_suppliers.push({id: type3_suppliers[0]});
						}
						else if (type3_suppliers.length == 0 && type2_suppliers.length > 0) {
							default_suppliers.push({id: type2_suppliers[0]});
						}
					}

					
					this.props.savePrevPage('address');

					this.props.setSuppliersID(default_suppliers);
					this.props.saveSuppliers(async_suppliers);

					if (menuDeliveryFlag == 'select') {
						const {details} = this.state;
						AsyncStorage.setItem('prev_details', JSON.stringify(details));

						if (async_suppliers_body) {
							AsyncStorage.setItem('suppliers_type', JSON.stringify(async_suppliers_body.isSplit));
						}
						
						if (async_suppliers_body.isSplit == false) {
							Actions.deliveryStoreView();
						}
						else {
							Actions.deliveryStoreSplitView()
						}
						
					}
					else {
						const {details} = this.state;
						AsyncStorage.setItem('prev_details', JSON.stringify(details));

						if (async_suppliers_body) {
							AsyncStorage.setItem('suppliers_type', JSON.stringify(async_suppliers_body.isSplit));
						}
						
						Actions.productCategory();
					}			

				}else{
					this.refs.autocomplete.setAddressText('');
			  		this.openModal()
				}
			}
		}
		
	}

	openModal(){

		this.refs.modal.open();
	}

	closeModal(){
		this.refs.modal.close();
		// this.setState({
		// 	isModalOpen:false
		// });
	}

	render(){
		const {menuDeliveryFlag} = this.props;
        const {isSigned} = this.state;
		return(

			<View style={styles.bg}>
			  	<View style={styles.ToolBar}>
			  		<View style={{width:80}}>
			  		<TouchableOpacity>
			  			<Image source={require('../assets/images/side_menu_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.SideMenuIcon}/>
			  		</TouchableOpacity>
			  		</View>
			  		<View style={{flex:1,alignItems:'center',marginBottom:-20}}>
			  			<TouchableOpacity onPress={()=>this._onLogo()}>
			  				<Image source={require('../assets/images/logo.png')} resizeMode={Image.resizeMode.contain} style={styles.LogoImage}/>
		  				</TouchableOpacity>
			  		</View>
			  		<View style={{width:80}}/>
			  	</View>
			  	<KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
			  	{
			  		(screen_height > 568) ?
			  		<View style={{height:50, backgroundColor:'#F1F2F2',alignItems:'center', justifyContent:'center'}}>
				  		<Text style={{fontSize:18.5, textAlign:'center'}}>Enter Delivery Address</Text>
				  	</View>
				  	:
				  	<View style={{height:50, backgroundColor:'#F1F2F2',alignItems:'center', justifyContent:'center'}}>
				  		<Text style={{fontSize:18.5, textAlign:'center'}}>Enter Delivery Address</Text>
				  	</View>
			  	}
				  	
				  	<View>
				  		
				  		<GooglePlacesAutocomplete
				  			ref = 'autocomplete'
					  		placeholder='Search'
					        minLength={2} // minimum length of text to search
					        autoFocus={true}
					        listViewDisplayed='auto'    // true/false/undefined
					        fetchDetails={true}
					        renderDescription={(row) => row.description}
					        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true				         
					          this._onLoad(details)
					        }}
					         
					        getDefaultValue={() => { // text input default value
					        	return '';
					        }}

					        query={{				         
					          key: API_Config.Google_API_Key,
					          language: 'en', 
					          types: 'geocode',
					        }}

					        styles={{

					          description: {
					          	fontWeight: 'bold',
					          },

					          textInputContainer:{
					          	backgroundColor:'white'
					          },
					     
					          predefinedPlacesDescription: {
					            color: '#1faadb',
					          },

					          powered: {
					          	height:0,
					          	opacity:0
					          },

							  textInput: {
							    marginLeft: 0,
							    marginRight: 0,
							    height: 45,
							    color: '#5d5d5d',
							    fontSize: 16
							   },

							  listView:{
							    backgroundColor:'white'
							   },

							   separator: {
							    height: 1,
							    backgroundColor: '#c8c7cc',
							  },
						    }}

					        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
					        GoogleReverseGeocodingQuery={{
					          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
					        }}
					        GooglePlacesSearchQuery={{
					          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
					          rankby: 'distance',
					     
					        }}

					        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
					     />
			  		</View>
			  	</KeyboardAvoidingView>
			  	<View style={{backgroundColor:'#7E5D91'}}>
			  		<TouchableOpacity onPress={()=>this._onContinue()} style={{alignItems:'center',height:45,justifyContent:'center'}}>
			  			<Text style={{fontSize:17.5, color:'#FFF'}}>CONTINUE</Text>
			  		</TouchableOpacity>
			  	</View>

			  	{ menuDeliveryFlag != 'select' ?
                    isSigned ?
                        null:
						<View style={{flex:1, backgroundColor:'#F1F2F2',justifyContent:'center',flexDirection:'row'}}>
							<View style={{height:50}}>
								<Text style={{fontSize:18, marginTop:20}} >Already have an account?</Text>
							</View>
							<TouchableOpacity style={{height:50}} onPress={()=>this._onSignIn()}>
								<Text style={{fontSize:18, marginLeft:10, color:'#DC754C', marginTop:20}}>Sign In</Text>
							</TouchableOpacity>
						</View>
			  	: 	<View style={{backgroundColor:'#7E5D91', marginTop:5}}>
				  		<TouchableOpacity onPress={()=>this._onCancel()} style={{alignItems:'center',height:45,justifyContent:'center'}}>
				  			<Text style={{fontSize:17.5, color:'#FFF'}}>CANCEL</Text>
				  		</TouchableOpacity>
				  	</View>
			  	}
			  	<Modal isOpen={this.state.isModalOpen} ref={"modal"} swipeToClose={false} backdropOpacity={0.8} style={{flex:1,backgroundColor:'transparent', alignItems:'center'}}>
			  		<NonServiceAreaView closeModal={this.closeModal.bind(this)}/>
			  	</Modal>
			</View>
		)
	}
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor: 'white',
		flexDirection:'column',
		flex:1
	},

	ToolBar:{
		height:75,
		backgroundColor:'#FFF',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		borderBottomWidth:2,
		borderBottomColor:'#EEE',
	},

	LogoImage:{
		width:150,
		height:75,
		marginTop:0,
	},

	SideMenuIcon:{
		width:25,
		height:20,
		marginLeft:10,
		marginTop:20
	},

	SearchIcon:{
		width:25,
		height:25,
		marginRight:0
	},

	ShoppingCartIcon:{
		width:25,
		height:25,
	},

	Sp_ScreenImage:{
		width:250,
		height:350,
	}

})

export default connect(
  state => ({
  	geoCodeForm: state.geoCodeForm, 
  	userGeoCode: state.userGeoCode,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	createcartInfo: state.cartInfo.createcartInfo,
  }),{loadUserGeoCodeResult, setGeoCodeInfo, setSuppliersID, getUserGeoCodeInfo, savePrevPage, saveSuppliers, saveSuppliersType, getClientToken, getCartInfo, createCartInfo, saveCurrentPage})(AddressView);

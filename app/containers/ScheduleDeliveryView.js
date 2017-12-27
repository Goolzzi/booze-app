import React, {Component} from 'react';
import {StyleSheet, Image, ListView, View, Text, TouchableOpacity, TouchableHighlight, RecyclerViewBackedScrollView, ScrollView, TextInput, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {AsyncStorage} from 'react-native';
import CheckBox from 'react-native-check-box';
import SearchBarView from '../components/SearchBarView'
import {savePrevPage, saveCurrentPage} from '../redux/actions/tabInfoAction';
import {saveDeliveryData} from '../redux/actions/scheduleDeliveryActions';

const SideMenu = require('react-native-side-menu');
const Menu = require('../components/Menu');
const screen_width = Dimensions.get('window').width;
const screen_height = Dimensions.get('window').height;

class ScheduleDeliveryView extends Component{

	constructor(props) {
	  super(props);

	  this.state = {

	  	isOpen: false,
		selectedItem: 'SelectStore',
	  	hourlyList: null,
	  	today: '',
	  	firstDateLabel:'',
	  	secondDateLabel:'',
	  	tomorrow: '',
	  	last: '',
	  	lastw: '',
	  	todayHourlyList: null,
	  	tomorrowHourlyList: null,
	  	lastHourlyList: null,
	  	tabSelect: 0,
	  	dateList: null,
	  	deliveryDate: '',
	  	deliveryTime: '',
	  	storeID: props.cartInfo.id,
	  	selectRow: 'false',
	  	selectRowKey: null,
	  	delivery_data: {},
	  	select_date: '',
	  	select_time: '',
	  };
		
	}

	toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen,
	    });
	  }

	updateMenuState(isOpen) {
	    this.setState({ isOpen, });
	}

	onMenuItemSelected = (item) => {
	    this.setState({
	      isOpen: false,
	      selectedItem: item,
	    });
	}

	componentDidMount(){
		this.props.savePrevPage('orderView');
		this.props.saveCurrentPage('scheduleDeliveryView');

		AsyncStorage.getItem('delivery_data').then((value) => {
			this.setState({delivery_data: JSON.parse(value)});
		}).done();

		const {delivery_data} = this.props;
		let select_date = '', select_time = '';
		let monthList=['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		if (delivery_data != null) {
			select_date = delivery_data.deliveryDate;
			select_date = monthList[parseInt(select_date.split('-')[1])] + ' ' + select_date.split('-')[2];
			select_time = delivery_data.deliveryTime;

			this.setState({select_date: select_date});
			this.setState({select_time: select_time});
		}
		else {
			this.setState({tabSelect: 1});
		}
	}

	componentWillReceiveProps(nextProps){
		const {deliveryResult, delivery_data} = nextProps;

		let weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let monthList=['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		let now = new Date();
		let dateList = [];
		let todayHourlyList = [];
		let tomorrowHourlyList = [];
		let lastHourlyList = [];

		
		if (deliveryResult) {
			Object.keys(deliveryResult).forEach(function(key) {
				dateList.push(key);
			});

			Date.dateDiff = function(datepart, fromdate, todate) {	
			  	datepart = datepart.toLowerCase();	
			  	let diff = todate - fromdate;
			  	let divideBy = { w:604800000,
			    	               d:86400000, 
			        	           h:3600000, 
			            	       n:60000, 
			                	   s:1000 };	
			  
			  	return Math.floor( diff/divideBy[datepart]);
			}

			let today= new Date(now.getFullYear(), now.getMonth(), now.getDate());
			let firstDate, secondDate, thirdDate, dateDifference1, dateDifference2, dateDifference3;
			if (dateList.length > 0) {
				resultYear0 = dateList[0].split('-')[0];
				resultMonth0 = dateList[0].split('-')[1];
				resultDate0 = dateList[0].split('-')[2];
				let firstDate  = new Date(resultYear0, resultMonth0-1, resultDate0);
				let dateDifference1 = Date.dateDiff('d', today, firstDate);
				if (dateList.length > 1) {
					resultYear1 = dateList[1].split('-')[0];
					resultMonth1 = dateList[1].split('-')[1];
					resultDate1 = dateList[1].split('-')[2];
					let secondDate  = new Date(resultYear1, resultMonth1-1, resultDate1);
					let dateDifference2 = Date.dateDiff('d', today, secondDate);
					if (dateList.length > 2) {
						resultYear2 = dateList[2].split('-')[0];
						resultMonth2 = dateList[2].split('-')[1];
						resultDate2 = dateList[2].split('-')[2];
						thirdDate  = new Date(resultYear2, resultMonth2-1, resultDate2);
						dateDifference3 = Date.dateDiff('d', today, thirdDate);
					}
				}
				let today = monthList[parseInt(dateList[0].split('-')[1])] + ' ' + dateList[0].split('-')[2];
				let tomorrow = monthList[parseInt(dateList[1].split('-')[1])] + ' ' + dateList[1].split('-')[2];
				let last = monthList[parseInt(dateList[2].split('-')[1])] + ' ' + dateList[2].split('-')[2];
				let lastw = weekList[thirdDate.getDay()];
				let todayHourlyList = deliveryResult[dateList[0]];
				let tomorrowHourlyList = deliveryResult[dateList[1]];
				let lastHourlyList = deliveryResult[dateList[2]];

				this.setState({dateList: dateList});
				this.setState({today: today});
				this.setState({tomorrow: tomorrow});
				this.setState({last: last});
				this.setState({lastw: lastw});
				this.setState({todayHourlyList: todayHourlyList});
				this.setState({tomorrowHourlyList: tomorrowHourlyList});
				this.setState({lastHourlyList: lastHourlyList});

				if (dateDifference1 == 0)
					this.setState({firstDateLabel: 'Today'});
				else if (dateDifference1 == 1)
					this.setState({firstDateLabel: 'Tomorrow'});
				else
					this.setState({firstDateLabel: weekList[firstDate.getDay()]});

				if (dateDifference2 == 1)
					this.setState({secondDateLabel: 'Tomorrow'});
				else
					this.setState({secondDateLabel: weekList[secondDate.getDay()]});


				/*set default value by today*/
				if (delivery_data == null) {
					this.setState({hourlyList: todayHourlyList});
					this.setState({deliveryDate: dateList[0]});
					this.setState({deliveryTime: todayHourlyList[0]});
					this.setState({select_time: todayHourlyList[0]});
					this.setState({selectRowKey: 0});
				}
				else {
					this.setState({hourlyList: deliveryResult[delivery_data['deliveryDate']]});
					this.setState({deliveryDate: delivery_data['deliveryDate']});
					this.setState({deliveryTime: delivery_data['deliveryTime']});
				}
			}
		}
	}


	_checkForResFields(){
 	}

	_onContinue(){
		const {deliveryDate, deliveryTime, storeID} = this.state;
		let {deliveryDataArr} = this.props;
		let Data ={};

		Data.storeID = storeID;
		Data.deliveryDate = deliveryDate;
		Data.deliveryTime = deliveryTime;

		//DataArr.push(Data);
		if (deliveryDataArr == null)
			deliveryDataArr = {};
		deliveryDataArr[storeID] = Data;

		this.props.saveDeliveryData(deliveryDataArr);
		Actions.orderView();
	}

	_onSelectTab(hourlyList, tabSelect) {
		const {dateList} = this.state;
		const {deliveryResult} = this.props;

		if (dateList && tabSelect) {
			this.setState({deliveryDate: dateList[tabSelect-1]});
			this.setState({tabSelect: tabSelect});
		}
		if (hourlyList) {
			select_time = hourlyList[0];
			this.setState({hourlyList: hourlyList});
		}
		this.setState({selectRowKey: 0});
		this.setState({select_date: ''});
		this.setState({selectRow: 'false'});
		this.setState({select_time: select_time});
		this.setState({deliveryTime: select_time});
	}

	_onSelectRow(rowData, key) {
		this.setState({deliveryTime: rowData});
		this.setState({selectRow: 'true'});
		this.setState({selectRowKey: key});
		this.setState({select_time: ''});
	}

	render(){
		const {cartInfo} = this.props;
		
		const {select_date, select_time} = this.state;

		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		const {hourlyList} = this.state;
		const instance = this;
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>
				<View style={styles.bg}>

					<SearchBarView onPress={()=>this.toggle()}/>
					<ScrollView>

					  	<View>
						  	<View style={{flex:1, justifyContent:'center', height:50}}>
					  			<Text style={{fontSize:18, marginLeft:15, color:'#414042'}}>{cartInfo.name}</Text>
					  		</View>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:1}}></View>
				  		</View>

				  		<View>
				  			<View style={{flexDirection:'row'}}>
			  				{ 	select_date == this.state.today 
			  				?	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.todayHourlyList, 1)}  style={{flex:1, justifyContent:'center', alignItems: 'center', height:80, backgroundColor:'#DC754C'}}>
			  						<View>
							  			<Text style={{fontSize:17, marginLeft:13, color:'#FFF'}}>{this.state.firstDateLabel}</Text>
							  			<Text style={{fontSize:17, marginLeft:15, color:'#FFF', fontWeight:'bold'}}>{this.state.today}</Text>
							  		</View>
							  	</TouchableOpacity>
							: 	this.state.tabSelect == 1
				  				?	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.todayHourlyList, 1)}  style={{flex:1, justifyContent:'center', alignItems: 'center', height:80, backgroundColor:'#DC754C'}}>
				  						<View>
								  			<Text style={{fontSize:17, marginLeft:13, color:'#FFF'}}>{this.state.firstDateLabel}</Text>
								  			<Text style={{fontSize:17, marginLeft:15, color:'#FFF', fontWeight:'bold'}}>{this.state.today}</Text>
								  		</View>
								  	</TouchableOpacity>
				  				:	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.todayHourlyList, 1)}  style={{flex:1, justifyContent:'center', alignItems: 'center', height:80, backgroundColor:'#FFF'}}>
									  	<View>
								  			<Text style={{fontSize:17, marginLeft:13, color:'#414042'}}>{this.state.firstDateLabel}</Text>
								  			<Text style={{fontSize:17, marginLeft:15, fontWeight:'bold'}}>{this.state.today}</Text>
								  		</View>
								  	</TouchableOpacity>
							}  

							{	select_date == this.state.tomorrow 
							?  	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.tomorrowHourlyList, 2)}  style={{flex:1, justifyContent:'center', alignItems:'center', height:80, backgroundColor:'#DC754C'}}>
							  		<View>
							  			<Text style={{fontSize:17, marginLeft:13, color:'#FFF'}}>{this.state.secondDateLabel}</Text>
							  			<Text style={{fontSize:17, marginLeft:15, color:'#FFF', fontWeight:'bold'}}>{this.state.tomorrow}</Text>
							  		</View>
							  	</TouchableOpacity>
							: 	this.state.tabSelect == 2
								?<TouchableOpacity onPress={()=>this._onSelectTab(this.state.tomorrowHourlyList, 2)}  style={{flex:1, justifyContent:'center', alignItems:'center', height:80, backgroundColor:'#DC754C'}}>
								  		<View>
								  			<Text style={{fontSize:17, marginLeft:13, color:'#FFF'}}>{this.state.secondDateLabel}</Text>
								  			<Text style={{fontSize:17, marginLeft:15, color:'#FFF', fontWeight:'bold'}}>{this.state.tomorrow}</Text>
								  		</View>
								  	</TouchableOpacity>
								: 	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.tomorrowHourlyList, 2)}  style={{flex:1, justifyContent:'center', alignItems:'center', height:80, backgroundColor:'#FFF'}}>
								  		<View>
								  			<Text style={{fontSize:17, marginLeft:13, color:'#414042'}}>{this.state.secondDateLabel}</Text>
								  			<Text style={{fontSize:17, marginLeft:15, fontWeight:'bold'}}>{this.state.tomorrow}</Text>
								  		</View>
								  	</TouchableOpacity>
							}

							{ 	select_date == this.state.last  	
							?	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.lastHourlyList, 3)}  style={{flex:1, justifyContent:'center', alignItems:'center', height:80, backgroundColor:'#DC754C'}}>
							  		<View>
							  			<Text style={{fontSize:17, marginLeft:13, color:'#FFF'}}>{this.state.lastw}</Text>
							  			<Text style={{fontSize:17, marginLeft:15, color:'#FFF', fontWeight:'bold'}}>{this.state.last}</Text>
							  		</View>
							  	</TouchableOpacity>
							: 	this.state.tabSelect == 3
								?	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.lastHourlyList, 3)}  style={{flex:1, justifyContent:'center', alignItems:'center', height:80, backgroundColor:'#DC754C'}}>
								  		<View>
								  			<Text style={{fontSize:17, marginLeft:13, color:'#FFF'}}>{this.state.lastw}</Text>
								  			<Text style={{fontSize:17, marginLeft:15, color:'#FFF', fontWeight:'bold'}}>{this.state.last}</Text>
								  		</View>
								  	</TouchableOpacity>
								: 	<TouchableOpacity onPress={()=>this._onSelectTab(this.state.lastHourlyList, 3)}  style={{flex:1, justifyContent:'center', alignItems:'center', height:80, backgroundColor:'#FFF'}}>
								  		<View>
								  			<Text style={{fontSize:17, marginLeft:13, color:'#414042'}}>{this.state.lastw}</Text>
								  			<Text style={{fontSize:17, marginLeft:15, fontWeight:'bold'}}>{this.state.last}</Text>
								  		</View>
								  	</TouchableOpacity>
							}
					  		</View>

					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:1}}></View>

				  		</View>

				  		{hourlyList
				  		?	hourlyList.map(function(item, key) {
					  			if (select_time == item) {
					  				return	(<View  key={key} style={styles.itemSelect}>
											<TouchableHighlight  onPress={()=>instance._onSelectRow(item, key)}  >
												<View  style={{flexDirection:'row', alignItems:'center', paddingLeft:15}}>
													<Image source={require('../assets/images/clock_icon_green.png')} resizeMode={Image.resizeMode.contain} style={{width: 25, 
								   						height: 25}}/>
								   					<Text style={{fontSize:18, marginLeft:20, color:'#414042', width:screen_height}}>{item}</Text>
								   				</View>
											</TouchableHighlight>
										</View>)
					  			} else {
					  				if (instance.state.selectRow == 'true' && instance.state.selectRowKey == key) {
										return	(<View  key={key} style={styles.itemSelect}>
												<TouchableHighlight  onPress={()=>instance._onSelectRow(item, key)}  >
													<View  style={{flexDirection:'row', alignItems:'center', paddingLeft:15}}>
														<Image source={require('../assets/images/clock_icon_green.png')} resizeMode={Image.resizeMode.contain} style={{width: 25, 
									   						height: 25}}/>
									   					<Text style={{fontSize:18, marginLeft:20, color:'#414042', width:screen_height}}>{item}</Text>
									   				</View>
												</TouchableHighlight>
											</View>)
									} else {
										return	(<View  key={key} style={styles.item}>
												<TouchableHighlight  onPress={()=>instance._onSelectRow(item, key)}  >
													<View  style={{flexDirection:'row', alignItems:'center', paddingLeft:15}}>
														<Image source={require('../assets/images/clock_icon.png')} resizeMode={Image.resizeMode.contain} style={{width: 25, 
									   						height: 25}}/>
									   					<Text style={{fontSize:18, marginLeft:20, color:'#414042', width:screen_height}}>{item}</Text>
									   				</View>
												</TouchableHighlight>
											</View>)
									}
								}
				  			})
					  	: null
					  	}
					  	<View style={{height:50}}/>
					</ScrollView>

				  	<View style={styles.ctnBtn}>
				  		<TouchableOpacity onPress={()=>this._onContinue()} style={{backgroundColor:'#7e5d91',justifyContent:'center', alignItems:'center',flex:1}}>
				  			<Text style={{fontSize:25,color:'#FFF',fontWeight:'bold'}}>CONTINUE</Text>
				  		</TouchableOpacity>
				  	</View>
				</View>
			</SideMenu>
		)
	};
}


const styles= StyleSheet.create({

	bg: {
		backgroundColor: '#FFF',
		flexDirection:'column',
		flex:1
	},

	list: {
		flexDirection:'row',
    	flexWrap: 'wrap',
		alignItems:'center',
		backgroundColor:'#F1F2F2',
   	},

   	item: {
   		width:screen_width,
   		height: 50,
   		backgroundColor:'#FFF', 
   		flexDirection:'row', 
   		alignItems:'center',
   		marginTop: 1,
		marginBottom: 1
   	},

   	itemSelect: {
   		width:screen_width,
   		height: 50,
   		flexDirection:'row', 
   		alignItems:'center',
   		marginTop: 1,
		marginBottom: 1
   	},

	ctnBtn : {
		flex:1,
		flexDirection:'column', 
		backgroundColor:'#7e5d91',
		justifyContent:'center', 
		position:'absolute',
		bottom:0,
		width:screen_width,
		height:50,
		alignItems:'center',
	},

	deliveryBtnStyle : {
		height:50, 
		backgroundColor:'#FFF',
		alignItems:'center',
		flex:1, 
		flexDirection:'row',
		marginLeft:15,
	},

	checkImgStyle : {
		height:50,
		marginRight:15,
		backgroundColor:'#FFF',
		width:50
	},

})

export default connect(
  state => ({
  	deliveryResult: state.deliveryHours.deliveryResult,
  	deliveryDataArr: state.deliveryHours.deliveryDataArr,
  	userGeoAddressList: state.geoCodeForm.selectedList,
  }),{savePrevPage, saveDeliveryData, saveCurrentPage})(ScheduleDeliveryView);
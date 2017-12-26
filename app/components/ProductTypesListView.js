import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, TouchableHighlight, ListView, Image, View, Text, TouchableOpacity, ScrollView, RecyclerViewBackedScrollView, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {saveIsDetail} from '../redux/actions/tabInfoAction';

const screen_width = Dimensions.get('window').width;
const screen_height = Dimensions.get('window').height;

import {saveListTypesID, saveCurrentPage} from '../redux/actions/tabInfoAction';


class ProductTypesListView extends Component{

	constructor(props) {
	  super(props);

		this.state = {
		  dataSource: null,
		  categoryData: null
		};
	}

	componentDidMount(){
		AsyncStorage.removeItem('gallerySelectedOption');
		AsyncStorage.removeItem('galleryData');
		AsyncStorage.removeItem('galleryInformation');
		AsyncStorage.removeItem('galleryOffset');
		this.props.saveIsDetail('false');
		const {data, cateTitle} = this.props;
		
		if(data){
			let listData = [];
			let shopAllJson = {};
			shopAllJson.id = data.id;
			shopAllJson.name = 'Shop All ' + cateTitle;
			shopAllJson.mobile_icon_image = data.mobile_icon_image;
			let productTypes = data.product_types;
			listData[0] = shopAllJson;
			for (i=0; i<productTypes.length; i++) {
				listData[i+1] = productTypes[i];
			}

			let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({dataSource: ds.cloneWithRows(listData)})
		}
		this.props.saveCurrentPage('tab');
	}

	componentWillReceiveProps(nextProps){

		const {data, cateTitle} = nextProps
		if(data){
			let listData = [];
			let shopAllJson = {};
			shopAllJson.id = data.id;
			shopAllJson.name = 'Shop All ' + cateTitle;
			shopAllJson.mobile_icon_image = data.mobile_icon_image;
			let productTypes = data.product_types;
			listData[0] = shopAllJson;
			for (i=0; i<productTypes.length; i++) {
				listData[i+1] = productTypes[i];
			}
			let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({dataSource: ds.cloneWithRows(listData)})
		}

	}

	_onSubmitTypesID(typesID, name, rowID){
		this.props.saveListTypesID(typesID);
		if (rowID == 0)
			this.props.onLoadProductGalleryListFromTypes(typesID, 'true', 'Shop All', 'name', 'ASC');
		else
			this.props.onLoadProductGalleryListFromTypes(typesID, 'false', name, 'name', 'ASC');
	}

	render(){
		
		const {cateTitle, data} = this.props;

		return(
			<View style={styles.bg}>
				<View style= {{flex:1}}>
					<View style={styles.ProductTypesListView}>
					{ this.state.dataSource &&
				  		<ListView
					        dataSource={this.state.dataSource}
					        renderRow={this._renderRow.bind(this)}
					        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
	            			renderSeparator={this._renderSeparator}
	      				/>
	      			}
	      			</View>
			  	</View>
			</View>
		)
	};

	_renderRow (rowData: object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
		
	    return (

	      	<TouchableHighlight onPress={() => {highlightRow(sectionID, rowID); this._onSubmitTypesID(rowData.id, rowData.name, rowID);}}>

		        <View style={{height:75,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

			        {rowData.mobile_icon_image && (
			        	<View style={{flex:1}}>
			        		<Image source={{uri:rowData.mobile_icon_image}} resizeMode={Image.resizeMode.contain} style={styles.typesListImage}/>
			        	</View>
			        )}

			        {!rowData.mobile_icon_image && (
			        	<View style={{flex:1}}>
			        		<View style={styles.typesListImage}/>
			        	</View>
			        )}

					<View style={{flex:5}}>
						<Text style={styles.typesNameTitle}>{rowData.name}</Text>
					</View>
					
				</View>
	      	</TouchableHighlight>
	    );
	}

  	_renderSeparator (sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    	return (
      		<View
        		key={`${sectionID}-${rowID}`}
        		style={{ height: 1, backgroundColor:'#AAA', flex:1,opacity:0.2}}
      		/>
    	);
  	}

  	_pressRow (rowID: number) {
		    this._pressData[rowID] = !this._pressData[rowID];
		    this.setState({dataSource: this.state.dataSource.cloneWithRows(
		    this._genRows(this._pressData)
	    )});
  	}
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor: 'white',
		flexDirection:'column',
		flex:1
	},

	ProductTypesListView:{
		flex:1,
	},
	
	typesListImage:{
		width: screen_width*0.148,
		height: screen_height*0.0828,
		marginLeft: screen_width*0.028,
		backgroundColor:'white'
	},

	typesNameTitle:{
		marginLeft:20
	}

})

export default connect(
	state => ({

	}),{saveListTypesID, saveCurrentPage, saveIsDetail})(ProductTypesListView);


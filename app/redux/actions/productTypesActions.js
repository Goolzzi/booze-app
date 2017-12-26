import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';

export function loadProductTypesList(selectedCategoryName, selectID, clientToken) {

    let url='';
    let id = '';
   
    for(let i=0; i<selectID.length; i++){

        url += 'supplierid[]=' + selectID[i].id +'&';
      }
       
  const {ProductTypes_REQUESTED, ProductTypes_SUCCESS, ProductTypes_FAILED} = ActionTypes;
	return {

    types: [ProductTypes_REQUESTED, ProductTypes_SUCCESS, ProductTypes_FAILED],
      promise: request.get(API_Config.baseUrl + '/categories/types?'+ url+'&name='+selectedCategoryName)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('UUID', '9252ecc0-b01c-11e6-8e3a-91de2fdb551a')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
  };
}
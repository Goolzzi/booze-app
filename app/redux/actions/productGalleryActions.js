import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';

const {ProductGalleryListofCategory_REQUESTED, 
    ProductGalleryListofCategory_SUCCESS, 
    ProductGalleryListofCategory_FAILED, 
    ProductGalleryListOfTypes_REQUESTED, 
    ProductGalleryListOfTypes_SUCCESS, 
    ProductGalleryListOfTypes_FAILED,
    TABSELECT_SUCCESS} = ActionTypes;


export function loadProductGalleryListFromCategory(selectedCategoryName, selectedID, clientToken, orderbyfield, orderbydirection) {

	let sub_url='';
    let id = '';

    for(let i=0; i<selectedID.length; i++){
        sub_url += 'supplierid[]=' + selectedID[i].id +'&';
    }
	return {
    types: [ProductGalleryListofCategory_REQUESTED, ProductGalleryListofCategory_SUCCESS, ProductGalleryListofCategory_FAILED],
    promise: request.get(API_Config.baseUrl + '/supplier/get-all-inventory?'+ sub_url +'orderbyfield=' + orderbyfield + '&orderbydirection=' + orderbydirection + '&tags[]='+selectedCategoryName)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
	};
}


export function loadProductGalleryListFromTypes(selectedID, typeID, clientToken, flag, count, page, orderbyfield, orderbydirection) {

	let sub_url='';
  let id = '';
  let url = '';

  for(let i=0; i<selectedID.length; i++){
    sub_url += 'supplierid[]=' + selectedID[i].id +'&';
  }

  if (flag =='true') 
  {
    url = API_Config.baseUrl + '/supplier/get-all-inventory?'+ sub_url +'orderbyfield=' + orderbyfield + '&orderbydirection=' + orderbydirection + '&categoryid='+typeID+'&count='+count+'&page='+page;
  }
  else
  {
    url = API_Config.baseUrl + '/supplier/get-all-inventory?'+ sub_url +'orderbyfield=' + orderbyfield + '&orderbydirection=' + orderbydirection + '&typeid[]='+typeID+'&count='+count+'&page='+page;
  }
	return {
    types: [ProductGalleryListOfTypes_REQUESTED, ProductGalleryListOfTypes_SUCCESS, ProductGalleryListOfTypes_FAILED],
    promise: request.get(url)

      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
	};
}

export function loadProductGalleryListFromNextUrl(next_url, clientToken) {

  return {
    types: [ProductGalleryListOfTypes_REQUESTED, ProductGalleryListOfTypes_SUCCESS, ProductGalleryListOfTypes_FAILED],
    promise: request.get(next_url)

      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
  };
}
import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';

const {GoogleAddress_REQUESTED, GoogleAddress_SUCCESS, GoogleAddress_FAILED} = ActionTypes;
let initialState = {userGeoCodeResult: null, loading: false, error: null};

export default function userGeoCode(state = initialState, action) {
	
	switch(action.type) {
		case GoogleAddress_REQUESTED:
			return {
				...state,
				loading: true,
				userGeoCodeResult: null,
				error: null
			};
		case GoogleAddress_SUCCESS:
			return {
				...state,
				loading: false,
				userGeoCodeResult: action.result.data
			};
		case GoogleAddress_FAILED:
			return {
				...state,
				loading: false,
				error: action.error.response.data
			};
		default: 
			return state;
	}
	return state;
}
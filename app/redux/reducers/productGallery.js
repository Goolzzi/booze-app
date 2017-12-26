import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';


const {ProductGalleryListofCategory_REQUESTED, ProductGalleryListofCategory_SUCCESS, ProductGalleryListofCategory_FAILED} = ActionTypes;

let initialState = {galleryListofCategory: null, loading: false, error: null};

export default function ProductGalleryListofCategroy(state = initialState, action) {

	switch(action.type) {
		case ProductGalleryListofCategory_REQUESTED:
			return {
				...state,
				loading: true,
				galleryListofCategroy: null,
				error: null
			};
		case ProductGalleryListofCategory_SUCCESS:
			return {
				...state,
				loading: false,
				galleryListofCategory: action.result.body
			};
		case ProductGalleryListofCategory_FAILED:
			return {
				...state,
				loading: false,
				error: action.result
			};
		default:
			return state;
	}
	return state;
}


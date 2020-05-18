import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_PLAN, UNLIKE_PLAN } from '../types';

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action ){
    switch(action.type){
        case SET_AUTHENTICATED: 
            return {
                ...state,
                authenticated: true
            };

        case SET_UNAUTHENTICATED:
            return initialState;

        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }    

        case LIKE_PLAN:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        planId: action.payload.planId
                    }
                ]
            }

        case UNLIKE_PLAN:
            return {
                ...state,
                likes: state.likes.filter(
                    (like) => like.planId !== action.payload.planId
                )
            }
            
        default:
            return state;
    }
}
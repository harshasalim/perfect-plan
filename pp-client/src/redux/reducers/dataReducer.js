import { SET_PLANS, LIKE_PLAN, UNLIKE_PLAN, LOADING_DATA, DELETE_PLAN, POST_PLAN, SET_PLAN } from '../types';


const initialState = {
    plans:[],
    plan:{},
    loading: false
};

export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }

        case SET_PLANS:
            return{
                ...state,
                plans: action.payload,
                loading: false
            }

        case SET_PLAN:
            return{
                ...state,
                plan: action.payload
            }

        case LIKE_PLAN:
        case UNLIKE_PLAN:
            let index = state.plans.findIndex((plan) => plan.planId === action.payload.planId);
            state.plans[index] = action.payload;
            return{
                ...state,
            }

        case DELETE_PLAN:
            index = state.plans.findIndex(plan => plan.planId === action.payload);
            state.plans.splice(index,1);
            return{
                ...state
            }   

        case POST_PLAN:
            return{
                ...state,
                plans: [
                    action.payload,
                    ...state.plans
                ]
            }
            
        default:
            return state;    
        
    }
}
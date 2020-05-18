import { SET_PLANS, LOADING_DATA, LIKE_PLAN, UNLIKE_PLAN, DELETE_PLAN } from '../types';
import axios from 'axios';

//Get all plans
export const getPlans = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/plans')
        .then(res => {
            dispatch({
                type: SET_PLANS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({ 
                type: SET_PLANS,
                payload: []
            })
        })
}

//Like a plan
export const likePlan = (planId) => (dispatch) => {
    axios.get(`/plan/${planId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_PLAN,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

//Unlike a plan
export const unlikePlan = (planId) => (dispatch) => {
    axios.get(`/plan/${planId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_PLAN,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

export const deletePlan = (planId) => (dispatch) => {
    axios.delete(`/plan/${planId}`)
        .then(() => {
            dispatch({ type: DELETE_PLAN, payload: planId })
        })
        .catch(err => console.log(err));
}
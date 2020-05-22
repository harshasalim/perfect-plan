import { SET_PLANS, LOADING_DATA, LIKE_PLAN, UNLIKE_PLAN, DELETE_PLAN, CLEAR_ERRORS, SET_ERRORS, POST_PLAN, LOADING_UI, SET_PLAN, STOP_LOADING_UI, SUBMIT_COMMENT } from '../types';
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

//Get single plan details
export const getPlan = (planId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/plan/${planId}`)
    .then(res =>{
        dispatch({ type: SET_PLAN, payload: res.data});
        dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
}

//Post a plan
export const postPlan = (newPlan) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/plans', newPlan)
        .then(res => {
            dispatch({
                type: POST_PLAN,
                payload: res.data
            });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            dispatch(clearErrors())
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

//Submit comment
export const submitComment = (planId, commentData) => (dispatch) => {
    axios.post(`/plan/${planId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            })
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const deletePlan = (planId) => (dispatch) => {
    axios.delete(`/plan/${planId}`)
        .then(() => {
            dispatch({ type: DELETE_PLAN, payload: planId })
        })
        .catch(err => console.log(err));
}

export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
    .then(res => {
        dispatch({
            type: SET_PLANS,
            payload: res.data.plans
        });
    })
    .catch(() => {
        dispatch({
            type: SET_PLANS,
            payload:null
        })
    })
}

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}
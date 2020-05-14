import React, { Component, Profiler } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Plan from '../components/Plan';
import Profile from '../components/Profile';

class home extends Component {
    state ={
        plans: null
    }
    componentDidMount(){
        axios.get('/plans')
            .then(res => {
                this.setState({
                    plans: res.data
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        let recentPlansMarkup = this.state.plans ? (
        this.state.plans.map(plan => <Plan key={plan.planId} plan={plan}/>)
        ) : <p>Loading...</p>
        return (
        <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {recentPlansMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <Profile />
            </Grid>
        </Grid>    
        )
    }
}

export default home

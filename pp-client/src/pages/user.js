import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Plan from '../components/plan/Plan';
import Grid from '@material-ui/core/Grid';
import StaticProfile from '../components/profile/StaticProfile';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
    state = {
        profile:null,
        planIdParam: null
    }

    componentWillMount(){
        const handle = this.props.match.params.handle;
        const planId = this.props.match.params.planId;

        if(planId) this.setState({planIdParam: planId});

        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        const {plans, loading} = this.props.data;
        const { planIdParam } = this.state;

        const plansMarkup = loading ? (
            <p>Loading data</p>
        ): plans === null ? (
            <p> No plans from this user</p>
        ): !planIdParam ? (
            plans.map(plan => <Plan key={plan.planId} plan={plan}/>)
        ): (
            plans.map(plan => {
                if(plan.planId !== planIdParam)
                    return <Plan key={plan.planId} plan={plan}/>
                else return <Plan key={plan.planId} plan={plan} openDialog/>
            })
        )
        return (
            <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {plansMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <p>Loading profile</p>
                ): ( <StaticProfile profile={this.state.profile} /> )}
            </Grid>
        </Grid>    
        )
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, {getUserData})(user)

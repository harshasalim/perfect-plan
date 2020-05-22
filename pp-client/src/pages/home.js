import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Plan from '../components/plan/Plan';
import Profile from '../components/profile/Profile';

import { connect } from 'react-redux';
import { getPlans } from '../redux/actions/dataActions';

class home extends Component {
    
    componentDidMount(){
        this.props.getPlans();
    }
    render() {
        const { plans, loading }= this.props.data;
        let recentPlansMarkup = !loading ? (
        plans.map((plan) => <Plan key={plan.planId} plan={plan}/>)
        ) : (<p>Loading...</p>);
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

home.propTypes = {
    getPlans: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getPlans })(home);

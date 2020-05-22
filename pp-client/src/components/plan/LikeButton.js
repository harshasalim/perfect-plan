import React, { Component } from 'react'
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likePlan, unlikePlan } from '../../redux/actions/dataActions';

export class LikeButton extends Component {
    likedPlan = () => {
        if(this.props.user.likes && this.props.user.likes.find(like => like.planId === this.props.planId))
            return true;
        else return false;
    }

    likePlan = () => {
        this.props.likePlan(this.props.planId);
    }

    unlikePlan = () => {
        this.props.unlikePlan(this.props.planId);
    }
    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
            <MyButton tip="Like">    
                <FavoriteBorder color="primary" />
            </MyButton>
            </Link>
        ) : (
            this.likedPlan() ? (
                <MyButton tip="Undo like" onClick={this.unlikePlan}>
                    <Favorite color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="Like" onClick={this.likePlan}>
                    <FavoriteBorder color="primary"/>
                </MyButton>
            )
        )
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    planId: PropTypes.string.isRequired,
    likePlan: PropTypes.func.isRequired,
    unlikePlan: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likePlan,
    unlikePlan
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);

import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import DeletePlan from './DeletePlan';
import PlanDialog from './PlanDialog';

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//icons
import ChatIcon from '@material-ui/icons/Chat';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

//redux
import { connect } from 'react-redux';
import { likePlan, unlikePlan } from '../redux/actions/dataActions';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit:'cover'
    }
}

class Plan extends Component {
    likedPlan = () => {
        if(this.props.user.likes && this.props.user.likes.find(like => like.planId === this.props.plan.planId))
            return true;
        else return false;
    }

    likePlan = () => {
        this.props.likePlan(this.props.plan.planId);
    }

    unlikePlan = () => {
        this.props.unlikePlan(this.props.plan.planId);
    }

    render() {
        dayjs.extend(relativeTime)
        const { classes, plan : { body, createdAt, userImage, userHandle, planId, likeCount, commentCount }, user: { authenticated, credentials: { handle } } } = this.props
        //const classes = this.props.classes;same as above, called destructuring
        
        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </MyButton>
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

        const deleteButton = authenticated && userHandle === handle ? (
            <DeletePlan planId={planId}/>
        ) : null

        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    {likeButton}
                    <span>{likeCount}</span>
                    {likeCount ===1 ?(<span> Like</span>):(<span> Likes</span>)}
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount}</span>
                    {commentCount ===1 ?(<span> Comment</span>):(<span> Comments</span>)}
                    <PlanDialog planId={planId} userHandle={userHandle}/>
                </CardContent>
            </Card>
        )
    }
}

Plan.propTypes = {
    likePlan: PropTypes.func.isRequired,
    unlikePlan: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    likePlan,
    unlikePlan
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Plan));

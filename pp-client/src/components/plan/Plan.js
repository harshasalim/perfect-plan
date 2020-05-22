import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeletePlan from './DeletePlan';
import PlanDialog from './PlanDialog';

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//icons
import ChatIcon from '@material-ui/icons/Chat';

//redux
import { connect } from 'react-redux';
import LikeButton from './LikeButton';

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
    

    render() {
        dayjs.extend(relativeTime)
        const { classes, plan : { body, createdAt, userImage, userHandle, planId, likeCount, commentCount }, user: { authenticated, credentials: { handle } } } = this.props
        //const classes = this.props.classes;same as above, called destructuring
        
        

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
                    <LikeButton planId={planId}/>
                    <span>{likeCount}</span>
                    {likeCount ===1 ?(<span> Like</span>):(<span> Likes</span>)}
                    <MyButton tip="comments" >
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount}</span>
                    {commentCount ===1 ?(<span> Comment</span>):(<span> Comments</span>)}
                    <PlanDialog planId={planId} userHandle={userHandle} openDialog={this.props.openDialog}/>
                </CardContent>
            </Card>
        )
    }
}

Plan.propTypes = {
    user: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user: state.user
})



export default connect(mapStateToProps)(withStyles(styles)(Plan));

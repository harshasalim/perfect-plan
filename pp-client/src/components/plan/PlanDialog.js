import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

//REDUX
import { connect } from 'react-redux';
import { getPlan, clearErrors } from '../../redux/actions/dataActions';

//MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

const styles = (theme) => ({
    ...theme.formFeatures,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom:50
    }
})

class PlanDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }

    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { userHandle, planId } = this.props;
        const newPath = `/users/${userHandle}/plan/${planId}`;

        if(oldPath===newPath) oldPath=`/users/${userHandle}`;

        window.history.pushState(null, null, newPath);

        this.setState({open: true, oldPath, newPath});
        this.props.getPlan(this.props.planId);
    }

    handleClose = () => {
        window.history.pushState(null,null,this.state.oldPath);

        this.setState({open: false});
        this.props.clearErrors();
    }

    render(){
        const { classes, plan: { planId, body, createdAt, likeCount, commentCount, userImage, userHandle, comments }, UI: { loading } } = this.props;
        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
            <CircularProgress size={100} thickness={2}/>
            </div>
        ) : (
            <Grid container spacing = {16}>
                <Grid item sm={5} >
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7} >
                    <Typography component= {Link} color="primary" variant="h5" to={`/users/${userHandle}`} >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton planId={planId}/>
                    <span>{likeCount}</span>
                    {likeCount ===1 ?(<span> Like</span>):(<span> Likes</span>)}
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount}</span>
                    {commentCount ===1 ?(<span> Comment</span>):(<span> Comments</span>)}
                </Grid>
                <hr className={classes.invisibleSeparator}/>
                <CommentForm planId={planId} />
                <Comments comments={comments}/>
            </Grid>
        )
        return(
            <Fragment>
                <MyButton onClick = {this.handleOpen} tip="Expand plan" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
}
}

PlanDialog.propTypes = {
    getPlan: PropTypes.func.isRequired,
    planId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    plan: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired
}

const mapStateToPorps = (state) => ({
    plan: state.data.plan,
    UI: state.UI
})

const mapActionsToProps = {
    getPlan, clearErrors
};

export default connect(mapStateToPorps, mapActionsToProps)(withStyles(styles)(PlanDialog));
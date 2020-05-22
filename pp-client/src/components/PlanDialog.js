import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

//REDUX
import { connect } from 'react-redux';
import { getPlan } from '../redux/actions/dataActions';

//MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';

const styles = (theme) => ({
    ...theme.formFeatures,
    invisibleSeparator: {
        border: 'none',
        margin: 4
    }
})

class PlanDialog extends Component {
    state = {
        open: false,
    }

    handleOpen = () => {
        this.setState({open: true});
        this.props.getPlan(this.props.planId);
    }

    handleClose = () => {
        this.setState({open: false});
    }

    render(){
        const { classes, plan: { planId, body, createdAt, likeCount, commentCount, userImage, userHandle }, UI: { loading } } = this.props;
        const dialogMarkup = loading ? (
            <CircularProgress size={200} />
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
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                </Grid>

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
                    <DialogContent className={classes.DialogContent}>
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
    UI: PropTypes.object.isRequired
}

const mapStateToPorps = (state) => ({
    plan: state.data.plan,
    UI: state.UI
})

const mapActionsToProps = {
    getPlan
};

export default connect(mapStateToPorps, mapActionsToProps)(withStyles(styles)(PlanDialog));
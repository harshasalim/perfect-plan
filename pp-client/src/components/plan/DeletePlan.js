import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { deletePlan } from '../../redux/actions/dataActions';
import { DialogContent } from '@material-ui/core';

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
}

class DeletePlan extends Component {
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({open:true});
    }
    handleClose = () => {
        this.setState({open:false});
    }
    deletePlan = () => {
        this.props.deletePlan(this.props.planId);
        this.setState({open:false});
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete Plan"
                 onClick={this.handleOpen}
                 btnClassName={classes.deleteButton}>
                     <DeleteOutline color="secondary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Are you sure you want to delete this plan?</DialogTitle>
                    <DialogContent><em><Typography color="secondary" style={{position:'absolute', top: '40%'}}>(This action cannot be reversed.)</Typography></em></DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deletePlan} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeletePlan.propTypes = {
    deletePlan: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    planId: PropTypes.string.isRequired
}

export default connect(null, {deletePlan})(withStyles(styles)(DeletePlan));

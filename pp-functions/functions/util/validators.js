//Helper function to check if a string is empty- used for validation during signup
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//Helper function to check if param is a valid email or not 
const isEmail = (email) =>{
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

exports.validateSignupData = (data) => {
     //Validation of data - refer helper functions above
    //email
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = 'Must not be empty'
    } else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email address'
    }

    //password and confirm password
    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';

    //handle
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty';

    return{
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}


exports.validateLoginData = (data) =>{
        //validation
        let errors = {};
        if(isEmpty(data.email)) errors.email = 'Must not be empty';
        if(isEmpty(data.password)) errors.password = 'Must not be empty';

        return {
            errors,
            valid : Object.keys(errors).length === 0 ? true : false
        }
    
    
}

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())){
        //if user's website is submitted as https://website.com, no issues, else if submitted was website.com then we have to store as http://website.com(no ssh hash)
        //https works on http but http not on https
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;
    return userDetails;
}
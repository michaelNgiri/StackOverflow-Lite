//this middleware checks that the info supplied in either the signup or login form is valid and of the right type
//empty string is rejected
//returns true or false to the caller
function userInfoIsValid(user){
    if (typeof user.email === "string" &&
        user.email.trim() !== '' &&
        typeof user.password === "string" &&
        user.password.trim() !== '' &&
        user.password.trim().length >= 5) {
        // console.log(user.email);
        // console.log(user.password.trim());
        return true;
    }
    console.log(user);
    return false;
}
module.exports = userInfoIsValid;
 /// <summary>
 /// Verifies that the user information is in a valid format and not empty
 /// </summary>
 /// <param name="user"></param>
 /// <returns>true for a valid user and false for an invallid user</returns>
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


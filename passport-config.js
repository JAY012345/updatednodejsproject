// const { authenticate } = require('passport')

// const localPassport = require('passport-local').Strategy
// const bcrypt = require('bcrypt')

// function initializePassport(passport){
//     const authenticateUser = async (username, password, done) => {
//         const user = getUserName(username)
//         if(user == null){
//             return done(null, false, {message: 'No User'})
//         }
//         try{
//             if(await bcrypt.compare(password, user.password)){
//                 return done(null, user)
//             }
//             else{
//                 return done(null, false, {message: 'Password Incorrect'})
//             }
//         }catch{
//             return done(e)
//         }

//     }
//     passport.use(new LocalPassport({usernameField: 'username'}, authenticateUser))
//     passport.serializeUser((user, done) => { })
// }

// module.exports = {initializePassport}
const User = require('../models/User')
const buildObject = require('../utils/buildObject')
const bcrypt = require("bcryptjs");
const UserService = require('../Services/userServices')
class UserValidation{
  
    emailExists = (email = '') => {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email : email
        },
        (err, item) => {
          if (err) {
            // Input is not correct format
            return reject(buildObject.buildErrObject(422, err.message))
          }
          if (item) {
            // Bad Request
            return reject(buildObject.buildErrObject(400, 'Email is already exists'))
          }
          // return true if pass validate
          resolve(true) 
        }
      )
    })
  }

    checkUserExists = (email = '') =>{
      return new Promise((resolve, reject) => {
        if(email === '' || email === null){
          reject(buildObject.buildErrObject(422, 'Please Enter your Email'))
        }
        User.findOne(
          {
            email : email
          },
          (err, item) => {
            if (err) {
              reject(buildObject.buildErrObject(422, err.message))
            }
            if (!item) {
              reject(buildObject.buildErrObject(404, 'USER NOT FOUND'))
            }
            resolve(true) // return true if pass validate
          }
        )
      })
    }
    checkLogin = async (email = '',password = '') =>{
      // console.log('Check email : ',email);
      // console.log('Check password : ',password);
      return new Promise((resolve, reject) => {
        if(password === '' || password === null){
          reject(buildObject.buildErrObject(422, 'Please Enter your Password'))
        }
        UserService.findUser(email).then(async (val) =>{
            if(val && (await bcrypt.compare(password, val.password))){
              resolve(true) // compare User password
            }
            else{
              reject(buildObject.buildErrObject(401,'User or Password is not correct'))
            }
        }).catch((err) =>{
            reject(buildObject.buildErrObject(404, err.message))
        });
      })
    }

    checkPermissions = ({id = '', roles = []},next) => {

      return new Promise((resolve,reject) => {
        UserService.findUserById(id, async(err,item) =>{
          try {

            if(roles.includes(item.roles))
              {
                return resolve(next());
              }
              reject(buildObject.buildErrObject(401,'Unauthorized'))
          } catch (error) {
            reject(error);
          }

        })
        
      })
    }
}

  module.exports = new UserValidation
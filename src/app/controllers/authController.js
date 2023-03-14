const userService = require('../Services/userServices')
const userValidation = require('../validator/UserValidator')
const token = require('../middleware/token')
class AuthController{

    index(req, res) {
        res.status(200).json('Hello')
    }

     register = async (req,res) =>{
        try{
            const formUser = req.body;
            console.log(req);
            const doesEmailExists = await userValidation.emailExists(formUser.email)
            if(doesEmailExists){
                res.status(201).json(
                    await userService.registerUser(req),
                );
            }
        }
        catch(error){
            res.status(422).json(error.message)
        }
    }
    login = async(req,res) =>{
        try{
            const formUser = req.body;
            const doesEmailExists = await userValidation.checkUserExists(formUser.email)
            const checkLoginbyUser = await userValidation.checkLogin(formUser.email,formUser.password)
            if(doesEmailExists && checkLoginbyUser){
                const user = await userService.findUser(formUser.email);
                res.status(200).json(
                    {
                        user : await userService.login(req),
                        token : await token.generateToken(user)
                    }
                );
            }
            else{
                res.status(200).json('Không có chi')
            }
        }
        catch(error){
            res.status(422).json(error.message)
        }
    }

}
module.exports = new AuthController
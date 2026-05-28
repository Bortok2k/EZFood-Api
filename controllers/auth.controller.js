const authServices = require('../services/auth.service');

const auth = async (req, res) => {
    const data = req.body;
    if(!data.user_name || !data.password){
        return res.status(400).json(
            {
                msg: 'missing user credentials'
            }
        );
    }
    await authServices.authService(data, res);
}

module.exports = {
    auth
}

import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
         return res.json({ success: false, msg: "Not Authorized, Login Again" })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)   // decode the token //Decodes + validates JWT
        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        }
        else {
            return res.json({ success: false, msg: "Not Authorized, Login Again" })
        }
        next()
        }
    catch (error) {
           return res.status(500).send({ success: false, message: error.message })
        }


}


export default userAuth;
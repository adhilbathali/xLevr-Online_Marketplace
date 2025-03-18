const postSignIn = (req, res) => {
    const { email, password} = req.body

    res.status(200).json({
        msg:"success",
        email: email,
        password: password
    })
}

export {postSignIn}
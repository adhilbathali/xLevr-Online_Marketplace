import express from 'express'
const router = express.Router()

import { postSignIn} from '../controllers/loginController.js'

router.route('/signin').post(postSignIn)

export default router


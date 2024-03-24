import express from "express";

import { login } from "./login";
import { register } from "./register";
import { verify } from "./verify";

const router = express.Router();

router.post('/register',  register);
router.post("/verify", verify);
router.post("/login", login);

export default router;
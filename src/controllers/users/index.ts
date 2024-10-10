import { register } from "./userRegister.controller";
import { loginUser } from "./userLogin.controller";
import { logOutUser } from "./userLogout.controller";
import { refreshAccessToken } from "./refreshToken.controller";
import { changeCurrentPassword } from "./changePassword.controller";
import { getCurrentUser } from "./getUser.controller";
import { updateAccountDetails } from "./updateAccount.controller";
import { updateAvatar } from "./updateAvatar.controller";
export  {
    register,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar
}
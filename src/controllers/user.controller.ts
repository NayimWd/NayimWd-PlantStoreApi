import { asyncHandler } from "../utils/asyncHandler";


const register = asyncHandler(async (req, res) => {
    const {name, email, password, phoneNumber} = req.body;

    
    
});

export { register };

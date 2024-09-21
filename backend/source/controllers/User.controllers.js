
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";



const registerUser = asyncHandler(async (req, res) => {
    const { username, firstname, lastname, password } = req.body;

   
    if (!(username && firstname && lastname && password)) {
        throw new ApiError(400, "All fields are required");
    }


    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new ApiError(400, `User with username ${username} already exists`);
    }


    const user = await User.create({
        username,
        firstname,
        lastname,
        password,
    });

    await Account.create({
        userId : user._id,
        balance: 1 + Math.random() * 10000
    })

    if (!user) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

  
    return res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!(username && password)) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, `User with username ${username} not found`);
    }

    await user.isPasswordCorrect(password);
  

    const AccessToken= await user.generateAccessToken();
   

    const loginedUser = await User.findByIdAndUpdate(
        user._id,
        {  AccessToken },
        { new: true }
    ).select("-password ");

    
    return res.status(200).cookie("AccessToken" ,AccessToken , { httpOnly: true,  secure: true,} )
                          .json(new ApiResponse(200, loginedUser, "User logged in successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { firstname , lastname  } = req.body;

   
    if (!(firstname && lastname )) {
        throw new ApiError(400, "All Fields are required");
    }


    const user = await User.findByIdAndUpdate(req.user._id , { firstname , lastname } , { new: true }).select("-password")
    if (!user) {
        throw new ApiError(404, `User  not Found`);
    }
  
    return res.status(201).json(new ApiResponse(201, user, "User updated  successfully"));
});


const allusersdata =  asyncHandler(async (req , res)=>
{
    const filter = req.query.search || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })

    if (!users) {
        throw new ApiError(404 , "No User Found")
    }

    // console.log( " all users :" ,users);

    const user = users.map(user => ({
                 username: user.username,
                 firstName: user.firstname,
                 lastName: user.lastname,
                 _id: user._id
            }))
     if (!user) {
                throw new ApiError(404 , "No User Found")
            }
    // console.log(`user with : ${filter} ` , user);

    // res.json({
    //     user: users.map(user => ({
    //         username: user.username,
    //         firstName: user.firstname,
    //         lastName: user.lastname,
    //         _id: user._id
    //     }))
    // })
    return res.status(201).json(new ApiResponse(201, user , " all user fetch successfully"));


})
export { registerUser , loginUser , updateUser , allusersdata};


import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Account } from "../models/account.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const balanceOfCurrentUser = asyncHandler (async (req , res)=>
{
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400 , "userId Is not valid");
    }

    const result = await Account.aggregate([
        {
            $match: { userId: new  mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                _id: 0, 
                balance: 1,
                "userDetails.username": 1,  
            }
        }
    ]);

    if (!result || result.length === 0) {
        throw new ApiError(404, "Account or User not found");
    }

    res.status(200).json(new ApiResponse(200 , result[0] , "balanced fetched successfully"));
})

const transferFromCurrentUser = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    // console.log(session);
    session.startTransaction();

    try {
        const { amount, transferac_id } = req.body;

     
        if (!amount || !transferac_id) {
            throw new ApiError(400, "All fields are required");
        }

      
        const currentaccount = await Account.findOne({ userId: req.user._id }).session(session);

        if (!currentaccount) {
            await session.abortTransaction();
            throw new ApiError(404 , "Account Not Found")
        }
      
        if (currentaccount.balance < amount) {
            await session.abortTransaction();
            throw new ApiError(400, "Insufficient balance");
        }

       
        const toaccount = await Account.findOne({ userId: transferac_id }).session(session);

       
        if (!toaccount) {
            await session.abortTransaction();
            throw new ApiError(404, "Account not found");
        }

       
        const useraccount = await Account.updateOne(
            { userId: currentaccount.userId },
            { $inc: { balance: -amount } }
        ).session(session);

       
        const transferaccount = await Account.updateOne(
            { userId: toaccount.userId },
            { $inc: { balance: amount } }
        ).session(session);

       
        if (useraccount.nModified === 0 || transferaccount.nModified === 0) {
            await session.abortTransaction();
            throw new ApiError(500, "Something went wrong while transferring the amount");
        }

       
      
        await session.commitTransaction();

        const currentusername = await User.findById(req.user._id).select("firstname");
        const transferaccountusername = await User.findById(transferac_id).select("firstname");
        // console.log(currentusername);
        // console.log(transferaccountusername);
        const resposne ={
            amount : amount,
            name:currentusername ,
           toname:transferaccountusername ,
    
        }
        res.status(200).json(new ApiResponse(200, resposne, "Amount transferred successfully"));
    } catch (error) {
       
        await session.abortTransaction();
        throw error;
    } finally {
      
        session.endSession();
    }
});

    

export {balanceOfCurrentUser ,  transferFromCurrentUser};
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3, // Corrected to 'minlength'
            maxlength: 30, // Corrected to 'maxlength'
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50, 
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
         AccessToken :{
            type: String,
        },
     
    },
    {
        timestamps: true,
    }
);


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});
userSchema.methods.isPasswordCorrect = async function (checkPassword) {
    const isMatch = await bcrypt.compare(checkPassword, this.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
};


userSchema.methods.generateAccessToken = async function () {

    const AccessToken = await jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.JWT_ACCESSTOKEN_SECERT,
        { expiresIn: "1day" }
    );

    return AccessToken;
};



export const User = mongoose.model("User", userSchema);

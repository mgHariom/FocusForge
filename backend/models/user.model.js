import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name in required'],
        },
        email: {
            type: String,
            required: [true, 'Email in required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, 'Password in required'],
            minlength: 8,
            select: false
        }
    }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;
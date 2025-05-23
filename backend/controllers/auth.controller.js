import mongoose from 'mongoose';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {name, email, password} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email});

        if(existingUser) {
            const error = new Error("user already exists");
            error.statusCode = 409;
            throw error
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], {session});

        const token = jwt.sign(
            {userid: newUsers[0]._id},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: newUsers[0],
                token
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            const error = new Error('Email and password required');
            error.statusCode = 401;
            throw error
        }

        //check if user exists
        const user = await User.findOne({email});
        console.log(user)
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        //check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            const error = new Error('Password is invalid');
            error.statusCode = 401;
            throw error
        }

        //Generate JWT token if password is correct 
        const token = jwt.sign(
            {userid: user._id},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        );

        //if sign in is successful, return the user and token
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error)
    }
}
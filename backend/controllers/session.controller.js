import Session from '../models/session.model.js';

export const addSession = async (req, res, next) => {
    try {
        const {duration, title} = req.body;

        const session = await Session.create({
            userId: req.user.userid,
            duration,
            title: title || 'Untitled Session',
        });

        res.status(201).json({success: true, session});
    } catch (error) {
        next(error)
    }
};

export const getSession = async(req, res, next) => {
    try {

        const userId = req.user.userid;
        const sessions = await Session.find({userId});
        res.status(200).json({success: true, sessions});
    } catch (error) {
        next(error);
    }
};
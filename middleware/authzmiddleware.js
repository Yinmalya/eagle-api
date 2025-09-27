import asyncHandler from 'express-async-handler';

// Middleware to check if the user is an 'admin'
export const isAdmin = asyncHandler(async (req, res, next) => {
    // req.user is set by the 'protect' middleware and includes the user's role
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an administrator.' });
    }
});

// Middleware to check if the user is a 'contributor' or 'admin'
export const isContributorOrAdmin = asyncHandler(async (req, res, next) => {
    // req.user is set by the 'protect' middleware and includes the user's role
    if (req.user && (req.user.role === 'contributor' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized to publish or modify articles.' });
    }
});

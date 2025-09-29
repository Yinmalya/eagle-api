import mongoose, { Schema } from 'mongoose';

// Define the Comment Schema
const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    // The author field is now OPTIONAL to allow comments without a user login.
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: false
    },
    // ADDED: Required email for all commenters (anonymous or not)
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // Note: We don't make this 'unique' because one user/email might comment many times.
    },
    // A display name field for anonymous commenters
    username: {
        type: String,
        required: function() {
            // Require a username ONLY if the author ObjectId is NOT provided (i.e., anonymous comment)
            return !this.author;
        },
        trim: true,
        default: 'Anonymous Reader' 
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article', // Reference to the Article model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Comment model
export default mongoose.model('Comment', CommentSchema);

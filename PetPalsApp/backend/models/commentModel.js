const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', 
      required: true,
    },
    content: { 
      type: String, 
      required: true, 
      minlength: 1, 
      maxlength: 500, 
    },
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster querying by postId
commentSchema.index({ postId: 1 });

// Virtual field for user details
commentSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Comment', commentSchema);

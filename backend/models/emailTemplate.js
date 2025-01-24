const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'], 
      trim: true, 
      maxlength: [100, 'Title cannot exceed 100 characters'] 
    },
    subject: { 
      type: String, 
      required: [true, 'Subject is required'], 
      trim: true, 
      maxlength: [200, 'Subject cannot exceed 200 characters'] 
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'], 
      trim: true 
    },
    is_shared: { 
      type: Boolean, 
      default: false 
    },
    image_url: { 
      type: String, 
      trim: true, 
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: 'Invalid URL format for image_url',
      },
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    toJSON: {
      virtuals: true, // Include virtual fields in `toJSON` output
      transform: function (doc, ret) {
        delete ret.__v; // Remove the `__v` field from the output
        return ret;
      },
    },
  }
);

// Add an index for better query performance on frequently filtered fields
emailTemplateSchema.index({ is_shared: 1 });

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

module.exports = EmailTemplate;

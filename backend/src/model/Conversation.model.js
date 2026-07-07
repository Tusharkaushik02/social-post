const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      content: {
        type: String,
        default: "",
        trim: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
      },
    },

    // Key = userId, Value = unread messages for that user
    // Example:
    // {
    //   "64f12ab...": 3,
    //   "64f56cd...": 0
    // }
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },

    // Future support for group chats
    isGroup: {
      type: Boolean,
      default: false,
    },
    dmKey: {
      type: String,
      unique: true,
      sparse: true,
    }
  },
  {
    timestamps: true,
  }
);

   

/* ---------------- Indexes ---------------- */

// Find all conversations of a user
conversationSchema.index({ participants: 1 });

// Sort conversation list by latest message
conversationSchema.index({ "lastMessage.createdAt": -1 });

// Faster lookup for DM/group conversations
conversationSchema.index({
  participants: 1,
  isGroup: 1,
});

/* ---------------- Model ---------------- */

module.exports = mongoose.model("Conversation", conversationSchema);
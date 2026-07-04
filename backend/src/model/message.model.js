const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },

    // Users who have read this message
    readBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        default: [],
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    // Reply to another message
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Client-side UUID for idempotency
    clientMessageId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- Indexes ---------------- */

// Primary query: fetch conversation messages (newest first)
messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

// Load newer messages after reconnect
messageSchema.index({
  conversationId: 1,
  createdAt: 1,
});

// User's sent messages
messageSchema.index({
  sender: 1,
  createdAt: -1,
});

// Deduplication (client retries)
messageSchema.index(
  {
    clientMessageId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

// Unread message queries
messageSchema.index({
  conversationId: 1,
  readBy: 1,
});

module.exports = mongoose.model("Message", messageSchema);
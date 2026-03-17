import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  bio?: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  rating: number; 
  level: number;
  xp: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserInterface>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    profilePic: {
      type: String,
      default: "https://default-avatar.png"
    },

    bio: {
      type: String,
      default: ""
    },

    matchesPlayed: {
      type: Number,
      default: 0
    },

    wins: {
      type: Number,
      default: 0
    },

    losses: {
      type: Number,
      default: 0
    },

    draws: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 1000 
    },

    level: {
      type: Number,
      default: 1
    },

    xp: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserInterface>("user" , userSchema); 
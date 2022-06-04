import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { boolean } from "zod";
import { UserDocument } from "./user.model";

export interface SessionDocument extends Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    valid: { type: Schema.Types.Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const SessionModel = model<SessionDocument>("Session", sessionSchema);

export default SessionModel;

import { DocumentDefinition } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";

const createUser = async (
  input: DocumentDefinition<
    Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">
  >
) => {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
};

export { createUser };

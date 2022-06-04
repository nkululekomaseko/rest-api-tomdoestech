import mongoose, { mongo } from "mongoose";
import config from "config";

const connect = async () => {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Unable to connect to DB, ERROR:", error);
    process.exit(1);
  }
};

export default connect;

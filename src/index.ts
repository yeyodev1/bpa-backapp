import dotenv from "dotenv";
dotenv.config();

import { dbConnect } from "./config/mongo";
import { createApp } from "./app";

async function main() {
  const port = process.env.PORT || 8190;
  await dbConnect();

  const { server } = createApp();
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main();

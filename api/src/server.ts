import "express-async-errors";
import { server } from "./app";
import config from "./config/constants";
import "express-session";
import { Users } from "./types/db";
import { Selectable } from "kysely";

declare module "express-session" {
  interface SessionData {
    [key: string]: any;
    accessToken?: string;
    refreshToken?: string;
    user?: Selectable<Users>;
  }
}

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

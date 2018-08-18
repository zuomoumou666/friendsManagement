import { Router } from "./router";
import { makeFriends } from "../controllers";
const api = new Router();

api.setRoute("/friends", "post", makeFriends);
const router = new Router();

router.use("/api/v1", api.routes());

export { router };

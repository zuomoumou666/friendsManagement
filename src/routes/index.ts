import { Router } from "./router";
import { makeFriends } from "../controllers";
const api = new Router();

api.setRoute("/addFriends", "post", makeFriends);
const router = new Router();

router.use("/api/v1/friends", api.routes());

export { router };

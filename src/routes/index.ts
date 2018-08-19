import { Router } from "./router";
import { makeFriends, getFriendsList, getCommonFriends } from "../controllers";
const api = new Router();

api.setRoute("/addFriends", "post", makeFriends);
api.setRoute("/getFriendsList", "post", getFriendsList);
api.setRoute("/getCommonFriends", "post", getCommonFriends);

const router = new Router();

router.use("/api/v1/friends", api.routes());

export { router };

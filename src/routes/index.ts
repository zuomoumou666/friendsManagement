import { Router } from "./router";
import {
  makeFriends,
  getFriendsList,
  getCommonFriends,
  addSubscribe,
  addBlock,
  retrieveSubscribeList
} from "../controllers";
const api = new Router();

api.setRoute("/addFriends", "post", makeFriends);
api.setRoute("/getFriendsList", "post", getFriendsList);
api.setRoute("/getCommonFriends", "post", getCommonFriends);
api.setRoute("/addSubscribe", "post", addSubscribe);
api.setRoute("/addBlock", "post", addBlock);
api.setRoute("/retrieveSubscribeList", "post", retrieveSubscribeList);

const router = new Router();

router.use("/api/v1/friends", api.routes());

export { router };

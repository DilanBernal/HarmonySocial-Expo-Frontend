import UserBasicData from "@/core/dtos/user/UserBasicData";
import Artist from "./Artist";
import { Song } from "./Song";

type SearchResponse = {
  users: UserBasicData[];
  artists: Artist[];
  songs: Song[];
};

export default SearchResponse
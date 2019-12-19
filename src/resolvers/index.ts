import { Query } from './Query'
import { Subscription } from './Subscription'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { User } from './User'
import { Post } from './Post'
import {device} from "./Mutation/device";
import {Device} from "./Device";
import {letter} from "./Mutation/letter";
import {TR} from "./TR";
import {tr} from "./Mutation/tr";
import {DeviceTypeCategory} from "./DeviceTypeCategory";
import {changeuser} from "./Mutation/changeuser";
import {devicetypecategory} from "./Mutation/devicetypecategory";

export default {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...device,
    ...letter,
    ...tr,
    ...changeuser,
    ...devicetypecategory
  },
  Subscription,
  User,
  Post,
  Device,
  TR,
  DeviceTypeCategory
}

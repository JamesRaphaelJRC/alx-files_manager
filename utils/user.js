/**
 * Module with user utilities
 */
import redisClient from './redis';
import dbClient from './db';

const userUtils = {
  /**
   * Gets a user id and key of redis from request
   */
  async getUserIdAndKey(request) {
    const object = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return object;

    object.key = `auth_${xToken}`;

    object.userId = await redisClient.get(object.key);

    return object;
  },

  /**
   * Gets a user from database
   */
  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },
};

export default userUtils;

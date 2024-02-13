/* App controller module */

import { isAlive } from '../utils/redis';
import { isAlive as _isAlive, nbUsers as _nbUsers, nbFiles as _nbFiles }
    from '../utils/db';

class AppController {
  static getStatus(req, res) {
    const redisStatus = isAlive();
    const dbStatus = _isAlive();

    const output = { redis: redisStatus, db: dbStatus };

    return res.status(200).send(output);
  }

  static async getStats(req, res) {
    try {
      const nbUsers = await _nbUsers();
      const nbFiles = await _nbFiles();

      return res.status(200).send({ users: nbUsers, files: nbFiles });
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;

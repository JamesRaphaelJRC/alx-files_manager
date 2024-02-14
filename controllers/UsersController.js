// User controller module
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * creates a user using email and password
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    const existingUser = await dbClient.usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);

    const newUser = {
      email,
      password: hashedPassword,
    };

    let result;
    try {
      result = await dbClient.usersCollection.insertOne(newUser);
    } catch (err) {
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user.' });
    }

    const { insertedId } = result;
    return res.status(201).send({ email, id: insertedId });
  }
  // Retrieves the user base on the token used
  static async getMe(request, response) {
    const { userId } = await userUtils.getUserIdAndKey(request);

    const user = await userUtils.getUser({
      _id: ObjectId(userId),
    });

    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    const processedUser = { id: user._id, ...user };
    delete processedUser._id;
    delete processedUser.password;

    return response.status(200).send(processedUser);
  }
}

export default UsersController;

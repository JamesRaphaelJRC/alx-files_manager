// User controller module
import dbClient from '../utils/db';

const sha1 = require('sha1');

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
}

export default UsersController;

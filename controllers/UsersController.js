import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check for missing email or password
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in DB
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user object
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the new user into the 'users' collection
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Return the new user with only the email and id
    const { _id } = result.insertedId;
    const responseUser = { id: _id, email };

    return res.status(201).json(responseUser);
  }
}

export default UsersController;


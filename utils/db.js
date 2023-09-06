import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.client.connect();
    this.db = this.client.db(database);
  }

  isAlive() {
    return !!this.client && this.client.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    return usersCount;
  }

  async nbFiles() {
    const filesCollection = this.db.collection('files');
    const filesCount = await filesCollection.countDocuments();
    return filesCount;
  }
}

const dbClient = new DBClient();

export default dbClient;


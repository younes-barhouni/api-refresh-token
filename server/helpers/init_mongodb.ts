import mongoose from 'mongoose';

console.log(process.env.MONGODB_URI);

mongoose
  .connect(
    process.env.MONGODB_URI as string,
    {
      dbName: process.env.DB_NAME as string,
      useNewUrlParser: true,
    } as mongoose.ConnectOptions
  )
  .then(() => {
    console.log('mongodb connected.');
  })
  .catch((err) => console.log(err.message));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

import 'dotenv/config';
import app from './app';

const main = async () => {
  try {
    const { DATABASE_URL, PORT = 3000 } = process.env;
    if (!DATABASE_URL) {
      console.error("Missing DATABASE_URL environment variable");
      process.exit(1);
    }
    app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
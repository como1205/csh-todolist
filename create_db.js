const { Client } = require('pg');

async function createDatabase() {
  // Connect to the default postgres database first
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to postgres database');

    const dbName = 'csh_todolist';

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_catalog.pg_database WHERE datname = $1",
      [dbName]
    );

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully!`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
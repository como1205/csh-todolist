const path = require('path');
const pgPath = path.resolve('../backend/node_modules/pg');
const { Client } = require(pgPath);

async function setupDatabase() {
  const dbName = 'csh_todolist';

  // Connect to the default postgres database first to create our database
  const defaultClient = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
  });

  try {
    await defaultClient.connect();
    console.log('Connected to default postgres database');

    // Check if database exists
    const result = await defaultClient.query(
      "SELECT 1 FROM pg_catalog.pg_database WHERE datname = $1",
      [dbName]
    );

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      await defaultClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully!`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await defaultClient.end();
  }

  // Now connect to the newly created database and run the schema
  const dbClient = new Client({
    connectionString: `postgresql://postgres:postgres@localhost:5432/${dbName}`
  });

  try {
    await dbClient.connect();
    console.log(`Connected to ${dbName} database`);

    // Read and execute the schema
    const fs = require('fs');
    const schemaSQL = fs.readFileSync('../database/schema.sql', 'utf8');

    await dbClient.query(schemaSQL);
    console.log('Schema applied successfully!');

  } catch (err) {
    console.error('Error applying schema:', err.message);
  } finally {
    await dbClient.end();
  }
}

setupDatabase();
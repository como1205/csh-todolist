const path = require('path');
const pgPath = path.resolve('./node_modules/pg');
const { Client } = require(pgPath);

(async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/csh_todolist'
  });

  try {
    await client.connect();
    console.log('Successfully connected to csh_todolist database');
    
    // Check if the tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Tables in the database:');
    result.rows.forEach(row => console.log('  - ' + row.table_name));
    
    // Check if the expected tables exist
    const expectedTables = ['holidays', 'todos', 'users'];
    const existingTables = result.rows.map(row => row.table_name);
    
    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log('✓ Table ' + table + ' exists');
      } else {
        console.log('✗ Table ' + table + ' missing');
      }
    });
    
    // Test basic functionality by inserting and reading a test record
    // First, add a test user
    const testUserResult = await client.query(`
      INSERT INTO users (email, password, username, role) 
      VALUES ('test@example.com', 'hashed_password', 'Test User', 'USER') 
      RETURNING "userId";
    `);
    
    console.log('✓ Test user created with ID:', testUserResult.rows[0].userId);
    
    // Insert a test todo for that user
    const testTodoResult = await client.query(`
      INSERT INTO todos ("userId", title, content) 
      VALUES ($1, 'Test Todo', 'This is a test todo item') 
      RETURNING "todoId";
    `, [testUserResult.rows[0].userId]);
    
    console.log('✓ Test todo created with ID:', testTodoResult.rows[0].todoId);
    
    // Verify the data is there
    const verifyResult = await client.query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    console.log('✓ User verification successful:', verifyResult.rows.length, 'user(s) found');
    
    // Clean up test data
    await client.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    console.log('✓ Test data cleaned up');
    
  } catch (err) {
    console.error('Error during database verification:', err.message);
  } finally {
    await client.end();
  }
})();
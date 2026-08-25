import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function runDirectTest() {
  console.log('--- Direct Neon DB & Backend Logic Test ---');
  
  // 1. Fetch projects count
  const list = await sql`SELECT COUNT(*) as count FROM projects WHERE deleted_at IS NULL`;
  console.log('Current active projects count in Neon DB:', list[0]?.count);

  // 2. Test inserting a project
  const testId = `crud_test_${Date.now()}`;
  console.log('Inserting test project:', testId);
  await sql`
    INSERT INTO projects (
      id, owner_id, owner_name, title, description, status, category, completion
    ) VALUES (
      ${testId}, 'user_admin', 'Admin Test', 'Admin Panel CRUD Test', 'Testing backend CRUD', 'in_progress', 'Advanced', 80
    ) ON CONFLICT (id) DO NOTHING
  `;

  // 3. Test updating
  console.log('Updating test project...');
  await sql`
    UPDATE projects SET title = 'Admin Panel CRUD Test (UPDATED)', completion = 100, status = 'completed' WHERE id = ${testId}
  `;

  // 4. Verify update
  const updated = await sql`SELECT title, status, completion FROM projects WHERE id = ${testId}`;
  console.log('Updated row result:', updated[0]);

  // 5. Clean up test row
  await sql`DELETE FROM projects WHERE id = ${testId}`;
  console.log('Cleaned up test row successfully!');
}

runDirectTest().catch(console.error);

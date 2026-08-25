import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);
const BASE_URL = 'http://localhost:3000';

const adminHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': 'admin_master',
  'x-user-email': 'admin@nexus.com',
  'x-user-name': 'nexus admin',
  'x-user-role': 'admin'
};

async function testDeletionSync() {
  console.log('--- 1. Creating Temporary Test Project for Deletion Test ---');
  const tempId = `temp_del_${Date.now()}`;
  
  let res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: tempId,
      title: 'Temporary Deletion Test Project',
      description: 'This project will be deleted to test cross-system sync',
      category: 'Advanced',
      status: 'in_progress',
      visibility: 'public'
    })
  });
  let data = await res.json();
  console.log('Project Creation Result:', data.success, data.message);

  console.log('\n--- 2. Verifying Project Exists in Public API (Main Website) & Dashboard API ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  let foundPublic = (data.projects || []).some(p => p.id === tempId);
  console.log('Found in Public API (Main Website):', foundPublic);

  res = await fetch(`${BASE_URL}/api/projects`, { headers: adminHeaders });
  data = await res.json();
  let foundAdmin = (data.projects || []).some(p => p.id === tempId);
  console.log('Found in Admin API (Member Dashboard):', foundAdmin);

  console.log('\n--- 3. Deleting Project via Admin Panel API (Hard Delete) ---');
  res = await fetch(`${BASE_URL}/api/projects/${tempId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Deletion Result:', data.success, data.message);

  console.log('\n--- 4. Verifying Project Disappears Everywhere ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  foundPublic = (data.projects || []).some(p => p.id === tempId);
  console.log('Still in Public API (Main Website)?', foundPublic);

  res = await fetch(`${BASE_URL}/api/projects`, { headers: adminHeaders });
  data = await res.json();
  foundAdmin = (data.projects || []).some(p => p.id === tempId);
  console.log('Still in Admin API (Member Dashboard)?', foundAdmin);

  const dbRows = await sql`SELECT id FROM projects WHERE id = ${tempId}`;
  console.log('Rows in Neon DB PostgreSQL:', dbRows.length);

  if (!foundPublic && !foundAdmin && dbRows.length === 0) {
    console.log('\n SUCCESS: Deletion synchronization verified 100%! Deleted project completely removed from Main Website, Member Dashboard, and Neon DB!');
  } else {
    console.error('\n FAILURE: Project was not completely removed!');
  }
}

testDeletionSync().catch(console.error);

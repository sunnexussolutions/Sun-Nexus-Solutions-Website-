import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL missing!");
  process.exit(1);
}

const sql = neon(connectionString);

const isNexusAdmin = (name) => {
  if (!name) return false;
  const n = String(name).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  return n === 'nexusadmin' || n === 'admin' || n === 'sunnexus' || n === 'adminmaster' || n === 'useradmin' || n === 'nexus' || n === 'systemadmin' || n === 'administrator' || n.includes('admin');
};

async function cleanAllAdminTraces() {
  console.log("=== EXECUTING COMPLETE ZERO-ADMIN CLEANUP IN NEON DB ===\n");

  const projects = await sql`SELECT id, title, owner_name, team_members FROM projects WHERE deleted_at IS NULL`;
  console.log(`Auditing ${projects.length} active projects in DB:\n`);

  let totalAdminRemoved = 0;

  for (const p of projects) {
    let team = [];
    try {
      team = typeof p.team_members === 'string' ? JSON.parse(p.team_members) : (p.team_members || []);
    } catch {
      team = [];
    }

    const origCount = team.length;
    const cleanTeam = team.filter(m => {
      const name = typeof m === 'string' ? m : (m.name || m.fullName || '');
      return !isNexusAdmin(name);
    });

    const cleanOwner = isNexusAdmin(p.owner_name) ? '' : (p.owner_name || '');
    const removedCount = origCount - cleanTeam.length;
    totalAdminRemoved += removedCount;

    if (removedCount > 0 || cleanOwner !== p.owner_name) {
      console.log(`⚡ Cleaning project [${p.id}] "${p.title}"`);
      if (cleanOwner !== p.owner_name) console.log(`   Reset owner_name: "${p.owner_name}" -> "${cleanOwner}"`);
      if (removedCount > 0) console.log(`   Removed ${removedCount} admin team member entries.`);

      await sql`
        UPDATE projects 
        SET owner_name = ${cleanOwner}, 
            team_members = ${JSON.stringify(cleanTeam)} 
        WHERE id = ${p.id}
      `;
    }
  }

  console.log(`\n🎉 ZERO-ADMIN AUDIT COMPLETE! Total admin entries removed: ${totalAdminRemoved}`);
}

cleanAllAdminTraces().catch(console.error);

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

const isNexusAdmin = (name) => {
  if (!name) return false;
  const n = String(name).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  return n === 'nexusadmin' || n === 'admin' || n === 'sunnexus' || n === 'adminmaster' || n === 'useradmin' || n === 'nexus';
};

async function scrubAdminFromDb() {
  console.log('=== SCRUBBING NEXUS ADMIN FROM ALL PROJECTS IN POSTGRESQL ===\n');

  const rows = await sql`SELECT id, title, team_members, owner_name FROM projects`;
  let updatedCount = 0;

  for (const r of rows) {
    let team = [];
    try {
      team = typeof r.team_members === 'string' ? JSON.parse(r.team_members) : (r.team_members || []);
    } catch {
      team = [];
    }

    let changed = false;
    let cleanTeam = team.filter(m => {
      const nameVal = typeof m === 'string' ? m : (m.name || m.fullName || '');
      if (isNexusAdmin(nameVal)) {
        changed = true;
        return false;
      }
      return true;
    });

    let newOwnerName = r.owner_name;
    if (isNexusAdmin(r.owner_name)) {
      newOwnerName = cleanTeam.length > 0 ? (cleanTeam[0].name || cleanTeam[0].fullName) : 'Sun Nexus';
      changed = true;
    }

    if (changed) {
      await sql`
        UPDATE projects
        SET team_members = ${JSON.stringify(cleanTeam)},
            owner_name = ${newOwnerName}
        WHERE id = ${r.id}
      `;
      updatedCount++;
      console.log(`Scrubbed project [${r.id}] "${r.title}": team members count now ${cleanTeam.length}`);
    }
  }

  console.log(`\n🎉 Scrubbed Nexus Admin from ${updatedCount} project database records.`);
}

scrubAdminFromDb().catch(console.error);

import { neon } from '@neondatabase/serverless';

/**
 * SENIOR DEV DEBUGGER:
 * We are wrapping the query in a high-visibility logger to catch 
 * hidden browser security blocks.
 */
const neonUrl = import.meta.env.VITE_NEON_URL || '';

const sql = neonUrl ? neon(neonUrl) : null;

export const query = async (queryString, params = []) => {
  if (!sql) {
    console.warn("VITE_NEON_URL not provided, skipping direct cloud DB call.");
    return [];
  }
  console.log("📡 CALLING_CLOUD_DATABASE...", { query: queryString.substring(0, 50) + "..." });
  
  try {
    const results = await sql.query(queryString, params);
    console.log("✅ CLOUD_RESPONSE_RECEIVED");
    if (results && Array.isArray(results.rows)) {
      return results.rows;
    }
    if (Array.isArray(results)) {
      return results;
    }
    return results || [];
  } catch (error) {
    // If we hit a "Failed to fetch", it's usually a CORS or Network issue
    if (error.message.includes('fetch')) {
      console.error("🚨 NETWORK_BLOCKADE_DETECTED: Your browser or a firewall is blocking the connection to Neon.");
      throw new Error("Network Blocked. Check your Ad-blocker/Firewall or ensure your Neon URL is correct in .env.");
    }
    
    console.error('NEON_DATABASE_CRASH:', error.message);
    throw error; 
  }
};

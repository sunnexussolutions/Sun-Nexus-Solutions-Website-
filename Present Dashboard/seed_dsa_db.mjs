import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.VITE_NEON_URL || process.env.DATABASE_URL || '';
const sql = neon(DATABASE_URL);

async function seed() {
  try {
    console.log("Checking dsa_topics & dsa_problems tables...");

    await sql.query(`
      CREATE TABLE IF NOT EXISTS dsa_topics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT,
        icon TEXT,
        "order" INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE TABLE IF NOT EXISTS dsa_problems (
        id TEXT PRIMARY KEY,
        topic_id TEXT REFERENCES dsa_topics(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        number INTEGER DEFAULT 1,
        difficulty TEXT DEFAULT 'Easy',
        tags TEXT,
        description TEXT,
        examples TEXT,
        constraints TEXT,
        hints TEXT,
        time_complexity TEXT,
        space_complexity TEXT,
        tutorial TEXT,
        video_url TEXT,
        "order" INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("✅ Tables verified/created!");

    const topicId = 'arrays-hashing';
    await sql.query(`
      INSERT INTO dsa_topics (id, name, color, icon, "order")
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
    `, [topicId, 'Arrays & Hashing', '#7b5cff', 'Hash', 1]);

    console.log("Seeding Two Sum problem into dsa_problems DB table...");
    await sql.query(`
      INSERT INTO dsa_problems (
        id, topic_id, title, number, difficulty, tags, description, examples, constraints, hints, time_complexity, space_complexity, tutorial, video_url, "order"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        examples = EXCLUDED.examples,
        constraints = EXCLUDED.constraints,
        hints = EXCLUDED.hints,
        time_complexity = EXCLUDED.time_complexity,
        space_complexity = EXCLUDED.space_complexity,
        tutorial = EXCLUDED.tutorial,
        video_url = EXCLUDED.video_url
    `, [
      'two-sum',
      topicId,
      'Two Sum',
      1,
      'Easy',
      JSON.stringify(['Array', 'Hash Table']),
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      JSON.stringify([
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
        { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].' }
      ]),
      JSON.stringify([
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ]),
      JSON.stringify([
        'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
        'So, if we fix one of the numbers, say x, we have to scan the entire array to find target - x. Can we change an array search to a constant time lookup?',
        'Use a hash map to store the value and its index as we iterate.'
      ]),
      'O(n)',
      'O(n)',
      '### Approach: Hash Map (One-pass)\n\nWhile we iterate and insert elements into the hash map, we also look back to check if the current element complement (target - nums[i]) already exists in the hash map.\n\n```python\ndef twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n```',
      'https://www.youtube.com/watch?v=KLlXCFG5TnA',
      1
    ]);

    console.log("🎉 Two Sum problem successfully seeded into Neon Database!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

seed();

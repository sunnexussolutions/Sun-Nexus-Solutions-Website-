import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

export async function runDsaMigration() {
  console.log('🚀 Running DSA PostgreSQL Database Migrations on Neon...');

  // 1. Sheets Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_sheets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT,
      description TEXT,
      cover_image TEXT,
      is_published BOOLEAN DEFAULT TRUE,
      display_order INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('✅ dsa_sheets table created/updated');

  // 2. Topics Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_topics (
      id TEXT PRIMARY KEY,
      sheet_id TEXT REFERENCES dsa_sheets(id) ON DELETE SET NULL,
      title TEXT,
      name TEXT,
      slug TEXT,
      description TEXT,
      icon TEXT DEFAULT 'Layers',
      color TEXT DEFAULT '#2872A1',
      status TEXT DEFAULT 'PUBLISHED',
      display_order INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 1,
      is_visible BOOLEAN DEFAULT TRUE,
      roadmap_url TEXT,
      roadmap_content TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS sheet_id TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS title TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS name TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS slug TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS description TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Layers';`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#2872A1';`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 1;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS roadmap_url TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS roadmap_content TEXT;`;
    await sql`ALTER TABLE dsa_topics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;`;
  } catch (e) {
    console.warn('Column add notice:', e.message);
  }
  console.log('✅ dsa_topics table created/updated');

  // 3. Sections Table (Subtopics inside Chapters)
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_sections (
      id TEXT PRIMARY KEY,
      topic_id TEXT REFERENCES dsa_topics(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT DEFAULT 'EASY',
      status TEXT DEFAULT 'PUBLISHED',
      display_order INTEGER DEFAULT 1,
      is_visible BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await sql`ALTER TABLE dsa_sections ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'EASY';`;
    await sql`ALTER TABLE dsa_sections ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';`;
    await sql`ALTER TABLE dsa_sections ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;`;
    await sql`ALTER TABLE dsa_sections ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;`;
  } catch (e) {}
  console.log('✅ dsa_sections table created/updated');

  // 4. Problems Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_problems (
      id TEXT PRIMARY KEY,
      topic_id TEXT REFERENCES dsa_topics(id) ON DELETE SET NULL,
      section_id TEXT REFERENCES dsa_sections(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      slug TEXT,
      number INTEGER DEFAULT 1,
      description TEXT,
      difficulty TEXT DEFAULT 'EASY',
      problem_type TEXT DEFAULT 'ALGORITHM',
      status TEXT DEFAULT 'PUBLISHED',
      practice_url TEXT,
      video_url TEXT,
      article_url TEXT,
      solution_url TEXT,
      github_url TEXT,
      editorial_url TEXT,
      expected_concepts TEXT,
      tags TEXT,
      examples TEXT,
      constraints TEXT,
      hints TEXT,
      input_format TEXT,
      output_format TEXT,
      time_complexity TEXT,
      space_complexity TEXT,
      starter_code JSONB,
      tutorial TEXT,
      display_order INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 1,
      is_visible BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS section_id TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS slug TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS practice_url TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS video_url TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS article_url TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS solution_url TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS github_url TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS editorial_url TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS expected_concepts TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS problem_type TEXT DEFAULT 'ALGORITHM';`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS input_format TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS output_format TEXT;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS starter_code JSONB;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE dsa_problems ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;`;
  } catch (e) {}
  console.log('✅ dsa_problems table created/updated');

  // 5. Problem Examples Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_problem_examples (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      input TEXT NOT NULL,
      output TEXT NOT NULL,
      explanation TEXT,
      display_order INTEGER DEFAULT 1
    );
  `;
  console.log('✅ dsa_problem_examples table created');

  // 6. Problem Hints Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_hints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      hint_order INTEGER DEFAULT 1,
      content TEXT NOT NULL
    );
  `;
  console.log('✅ dsa_hints table created');

  // 7. Tags Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_tags (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );
  `;
  console.log('✅ dsa_tags table created');

  // 8. Problem-Tag Many-to-Many
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_problem_tags (
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      tag_id TEXT REFERENCES dsa_tags(id) ON DELETE CASCADE,
      PRIMARY KEY (problem_id, tag_id)
    );
  `;
  console.log('✅ dsa_problem_tags table created');

  // 9. Companies Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_companies (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );
  `;
  console.log('✅ dsa_companies table created');

  // 10. Problem-Company Many-to-Many
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_problem_companies (
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      company_id TEXT REFERENCES dsa_companies(id) ON DELETE CASCADE,
      PRIMARY KEY (problem_id, company_id)
    );
  `;
  console.log('✅ dsa_problem_companies table created');

  // 11. User Progress Table (Normalized, DB source of truth)
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_user_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'UNSOLVED',
      attempt_count INTEGER DEFAULT 0,
      first_attempt_at TIMESTAMPTZ,
      last_attempt_at TIMESTAMPTZ,
      solved_at TIMESTAMPTZ,
      best_runtime TEXT,
      best_memory TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_user_problem UNIQUE(user_id, problem_id)
    );
  `;
  console.log('✅ dsa_user_progress table created');

  // 12. Bookmarks Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_user_bookmark UNIQUE(user_id, problem_id)
    );
  `;
  console.log('✅ dsa_bookmarks table created');

  // 13. User Notes Table (Strictly User-Isolated)
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_user_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      note_text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_user_problem_note UNIQUE(user_id, problem_id)
    );
  `;
  console.log('✅ dsa_user_notes table created');

  // 14. User Revisions Table (Strictly User-Isolated)
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_user_revisions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_user_problem_revision UNIQUE(user_id, problem_id)
    );
  `;
  console.log('✅ dsa_user_revisions table created');

  // 15. Submissions Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      status TEXT NOT NULL,
      runtime_ms INTEGER,
      memory_kb INTEGER,
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('✅ dsa_submissions table created');

  // 16. Performance Indexes
  try {
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_problems_topic ON dsa_problems(topic_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_problems_section ON dsa_problems(section_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_problems_status ON dsa_problems(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_problems_diff ON dsa_problems(difficulty);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_user_progress_user ON dsa_user_progress(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_user_notes_user ON dsa_user_notes(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dsa_user_revisions_user ON dsa_user_revisions(user_id);`;
    console.log('✅ Performance indexes created');
  } catch (e) {
    console.warn('Index notice:', e.message);
  }

  // 17. Daily Problems Table
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_daily_problems (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      problem_id TEXT REFERENCES dsa_problems(id) ON DELETE CASCADE,
      date DATE NOT NULL UNIQUE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('✅ dsa_daily_problems table created');

  // 14. Add Indexes for High Performance Querying
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_problems_topic ON dsa_problems(topic_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_problems_difficulty ON dsa_problems(difficulty);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_progress_user ON dsa_user_progress(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_progress_status ON dsa_user_progress(status);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_bookmarks_user ON dsa_bookmarks(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_submissions_user ON dsa_submissions(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dsa_submissions_problem ON dsa_submissions(problem_id);`;
  console.log('✅ Performance indexes created');

  console.log('🎉 All DSA database tables and indexes verified successfully!');
}

// ════════════════════════════════════════════════════════════════════════════════
// SEEDING ORIGINAL DSA CURRICULUM INTO NEON POSTGRES
// ════════════════════════════════════════════════════════════════════════════════
export async function seedDsaData() {
  console.log('🌱 Seeding original DSA curriculum and problems...');

  const TOPICS = [
    { id: '01-basics', title: 'Basics & Foundations', slug: 'basics-foundations', description: 'Syntax, Logic Building, Time & Space Complexity', icon: 'Layers', color: '#2872A1', order: 1 },
    { id: '02-arrays', title: 'Arrays & Memory Layout', slug: 'arrays-memory-layout', description: 'Traversal, Prefix Sums, Partitioning, Subarrays', icon: 'Hash', color: '#2872A1', order: 2 },
    { id: '03-strings', title: 'Strings & Character Encoding', slug: 'strings-character-encoding', description: 'Pattern Matching, Palindromes, Anagrams', icon: 'Code', color: '#3B82F6', order: 3 },
    { id: '04-searching-sorting', title: 'Searching & Sorting', slug: 'searching-sorting', description: 'Binary Search in 1D/2D, QuickSort, MergeSort, Inversion Count', icon: 'Target', color: '#0EA5E9', order: 4 },
    { id: '05-linked-lists', title: 'Linked Lists', slug: 'linked-lists', description: 'Singly, Doubly, Fast & Slow Pointers, Reversal', icon: 'Link', color: '#14B8A6', order: 5 },
    { id: '06-recursion', title: 'Recursion & Backtracking Basics', slug: 'recursion-backtracking-basics', description: 'Call Stack, Base Cases, Subsequence Generation', icon: 'RotateCcw', color: '#10B981', order: 6 },
    { id: '07-bit-manipulation', title: 'Bit Manipulation', slug: 'bit-manipulation', description: 'Bitwise Operators, XOR Tricks, Bitmasks', icon: 'Cpu', color: '#84CC16', order: 7 },
    { id: '08-stack-queue', title: 'Stacks & Queues', slug: 'stacks-queues', description: 'Monotonic Stacks, Sliding Window Queues, Deque', icon: 'Database', color: '#F59E0B', order: 8 },
    { id: '09-sliding-window', title: 'Sliding Window & Two Pointers', slug: 'sliding-window-two-pointers', description: 'Fixed/Dynamic Windows, Substring Subarrays', icon: 'Zap', color: '#F97316', order: 9 },
    { id: '10-binary-trees', title: 'Binary Trees', slug: 'binary-trees', description: 'Traversals (DFS/BFS), Views, Path Sums, Ancestors', icon: 'FolderTree', color: '#EF4444', order: 10 },
    { id: '11-bst', title: 'Binary Search Trees', slug: 'binary-search-trees', description: 'BST Properties, Validating, Balancing, Floor/Ceil', icon: 'FolderTree', color: '#EC4899', order: 11 },
    { id: '12-heaps', title: 'Heaps & Priority Queues', slug: 'heaps-priority-queues', description: 'Min/Max Heaps, Top K Elements, Median Streams', icon: 'Layers', color: '#D946EF', order: 12 },
    { id: '13-greedy', title: 'Greedy Algorithms', slug: 'greedy-algorithms', description: 'Interval Scheduling, Fractional Knapsack, Jump Game', icon: 'Sparkles', color: '#A855F7', order: 13 },
    { id: '14-backtracking', title: 'Backtracking & Pruning', slug: 'backtracking-pruning', description: 'N-Queens, Sudoku Solver, Word Search, Permutations', icon: 'RotateCcw', color: '#8B5CF6', order: 14 },
    { id: '15-graphs', title: 'Graphs & Networks', slug: 'graphs-networks', description: 'BFS/DFS, Topological Sort, Dijkstra, Bellman-Ford, MST', icon: 'Network', color: '#6366F1', order: 15 },
    { id: '16-dp', title: 'Dynamic Programming', slug: 'dynamic-programming', description: '1D DP, 2D Grid DP, Knapsack, Subsequences, MCM, Bitmask DP', icon: 'Brain', color: '#4F46E5', order: 16 },
    { id: '17-tries', title: 'Tries (Prefix Trees)', slug: 'tries-prefix-trees', description: 'Prefix Searches, Auto-complete, Maximum XOR', icon: 'FolderTree', color: '#2563EB', order: 17 },
    { id: '18-advanced', title: 'Advanced Data Structures', slug: 'advanced-data-structures', description: 'Disjoint Set Union (DSU), Segment Trees, Fenwick Trees', icon: 'Cpu', color: '#1D4ED8', order: 18 }
  ];

  for (const t of TOPICS) {
    await sql`
      INSERT INTO dsa_topics (id, title, name, slug, description, icon, color, display_order, "order", is_visible)
      VALUES (${t.id}, ${t.title}, ${t.title}, ${t.slug}, ${t.description}, ${t.icon}, ${t.color}, ${t.order}, ${t.order}, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        display_order = EXCLUDED.display_order,
        "order" = EXCLUDED."order";
    `;
  }
  console.log('✅ 18 Topics seeded');

  // Seed Sections
  const SECTIONS = [
    { id: 'sec-01-syntax', topicId: '01-basics', title: 'Language Syntax & I/O', difficulty: 'EASY', order: 1 },
    { id: 'sec-01-complexity', topicId: '01-basics', title: 'Asymptotic Analysis & Big-O', difficulty: 'EASY', order: 2 },
    { id: 'sec-01-math', topicId: '01-basics', title: 'Basic Math & Number Theory', difficulty: 'EASY', order: 3 },
    { id: 'sec-02-easy', topicId: '02-arrays', title: 'Array Fundamentals & Traversal', difficulty: 'EASY', order: 1 },
    { id: 'sec-02-medium', topicId: '02-arrays', title: 'Subarrays & Prefix Sum Patterns', difficulty: 'MEDIUM', order: 2 },
    { id: 'sec-04-binary-search', topicId: '04-searching-sorting', title: 'Binary Search on 1D Arrays', difficulty: 'EASY', order: 1 },
    { id: 'sec-09-dynamic', topicId: '09-sliding-window', title: 'Dynamic Expanding/Shrinking Window', difficulty: 'MEDIUM', order: 1 },
    { id: 'sec-10-traversals', topicId: '10-binary-trees', title: 'Pre/In/Post Order & BFS', difficulty: 'EASY', order: 1 },
    { id: 'sec-16-1d', topicId: '16-dp', title: '1D State DP & Fibonacci Patterns', difficulty: 'EASY', order: 1 }
  ];

  for (const s of SECTIONS) {
    await sql`
      INSERT INTO dsa_sections (id, topic_id, title, difficulty, display_order, is_visible)
      VALUES (${s.id}, ${s.topicId}, ${s.title}, ${s.difficulty}, ${s.order}, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        difficulty = EXCLUDED.difficulty,
        display_order = EXCLUDED.display_order;
    `;
  }
  console.log('✅ Sections seeded');

  // Seed Original Problems
  const PROBLEMS = [
    {
      id: 'prob-count-digits',
      topicId: '01-basics',
      sectionId: 'sec-01-math',
      title: 'Count Digits in Integer',
      slug: 'count-digits-in-integer',
      number: 1,
      difficulty: 'EASY',
      description: 'Given an integer `n`, return the total number of digits in `n` that divide `n` evenly (i.e. `n % digit == 0`). If a digit is `0`, it cannot divide any number and should be ignored.',
      constraints: '1 <= n <= 10^9',
      timeComplexity: 'O(log10(n))',
      spaceComplexity: 'O(1)',
      starterCode: {
        javascript: `function countDigits(n) {\n    let count = 0;\n    let temp = n;\n    while (temp > 0) {\n        let digit = temp % 10;\n        if (digit !== 0 && n % digit === 0) {\n            count++;\n        }\n        temp = Math.floor(temp / 10);\n    }\n    return count;\n}`,
        python: `class Solution:\n    def countDigits(self, n: int) -> int:\n        count = 0\n        temp = n\n        while temp > 0:\n            digit = temp % 10\n            if digit != 0 and n % digit == 0:\n                count += 1\n            temp //= 10\n        return count`,
        cpp: `class Solution {\npublic:\n    int countDigits(int n) {\n        int count = 0;\n        int temp = n;\n        while (temp > 0) {\n            int digit = temp % 10;\n            if (digit != 0 && n % digit == 0) count++;\n            temp /= 10;\n        }\n        return count;\n    }\n};`,
        java: `class Solution {\n    public int countDigits(int n) {\n        int count = 0;\n        int temp = n;\n        while (temp > 0) {\n            int digit = temp % 10;\n            if (digit != 0 && n % digit == 0) count++;\n            temp /= 10;\n        }\n        return count;\n    }\n}`
      },
      tags: ['Math', 'Basic Logic'],
      companies: ['Amazon', 'TCS', 'Infosys'],
      examples: [
        { input: 'n = 12', output: '2', explanation: 'Both 1 and 2 divide 12 evenly.' },
        { input: 'n = 2446', output: '4', explanation: '2, 4, 4 and 6 all divide 2446 without a remainder.' }
      ],
      hints: [
        'Extract each digit using modulo 10: d = temp % 10.',
        'Check if d != 0 and n % d == 0.',
        'Divide temp by 10 in each step until temp becomes 0.'
      ]
    },
    {
      id: 'two-sum',
      topicId: '02-arrays',
      sectionId: 'sec-02-easy',
      title: 'Two Sum Target Index',
      slug: 'two-sum-target-index',
      number: 2,
      difficulty: 'EASY',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      starterCode: {
        javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
        python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []`,
        cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (mp.count(complement)) return {mp[complement], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
        java: `class Solution {\n    public int twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) return new int[] { map.get(complement), i };\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`
      },
      tags: ['Array', 'Hash Map'],
      companies: ['Google', 'Amazon', 'Apple', 'Meta'],
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
      ],
      hints: [
        'A brute force approach checks all pairs in O(n^2).',
        'Use a hash map to store previously seen numbers for O(1) lookup.'
      ]
    },
    {
      id: 'prob-kadane-max-subarray',
      topicId: '02-arrays',
      sectionId: 'sec-02-medium',
      title: 'Maximum Subarray (Kadane’s Algorithm)',
      slug: 'maximum-subarray-kadanes',
      number: 3,
      difficulty: 'MEDIUM',
      description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
      constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      starterCode: {
        javascript: `function maxSubArray(nums) {\n    let maxSum = nums[0];\n    let currSum = 0;\n    for (const n of nums) {\n        currSum = Math.max(n, currSum + n);\n        maxSum = Math.max(maxSum, currSum);\n    }\n    return maxSum;\n}`,
        python: `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        max_sum = nums[0]\n        curr_sum = 0\n        for n in nums:\n            curr_sum = max(n, curr_sum + n)\n            max_sum = max(max_sum, curr_sum)\n        return max_sum`,
        cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSum = nums[0];\n        int currSum = 0;\n        for (int n : nums) {\n            currSum = max(n, currSum + n);\n            maxSum = max(maxSum, currSum);\n        }\n        return maxSum;\n    }\n};`,
        java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0];\n        int currSum = 0;\n        for (int n : nums) {\n            currSum = Math.max(n, currSum + n);\n            maxSum = Math.max(maxSum, currSum);\n        }\n        return maxSum;\n    }\n}`
      },
      tags: ['Array', 'Dynamic Programming'],
      companies: ['Microsoft', 'Amazon', 'LinkedIn', 'Uber'],
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6.' }
      ],
      hints: [
        'Maintain the current prefix sum. If it goes below 0, reset to 0.'
      ]
    },
    {
      id: 'prob-binary-search',
      topicId: '04-searching-sorting',
      sectionId: 'sec-04-binary-search',
      title: 'Binary Search Implementation',
      slug: 'binary-search-implementation',
      number: 4,
      difficulty: 'EASY',
      description: 'Given a sorted integer array `nums` in ascending order and a target value `target`, return the index of `target` if found, or `-1` if not found. Runtime complexity must be O(log n).',
      constraints: '1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      starterCode: {
        javascript: `function search(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        let mid = low + Math.floor((high - low) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
        python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        low, high = 0, len(nums) - 1\n        while low <= high:\n            mid = (low + high) // 2\n            if nums[mid] == target: return mid\n            elif nums[mid] < target: low = mid + 1\n            else: high = mid - 1\n        return -1`,
        cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int low = 0, high = nums.size() - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n};`,
        java: `class Solution {\n    public int search(int[] nums, int target) {\n        int low = 0, high = nums.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n}`
      },
      tags: ['Binary Search', 'Array'],
      companies: ['Adobe', 'Apple', 'Google'],
      examples: [
        { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' }
      ],
      hints: [
        'Calculate mid = low + (high - low) / 2 to avoid integer overflow.'
      ]
    },
    {
      id: 'prob-climbing-stairs',
      topicId: '16-dp',
      sectionId: 'sec-16-1d',
      title: 'Climbing Stairs Combinations',
      slug: 'climbing-stairs-combinations',
      number: 5,
      difficulty: 'EASY',
      description: 'You are climbing a staircase with `n` steps. Each time you can climb either 1 or 2 steps. In how many distinct ways can you reach the top?',
      constraints: '1 <= n <= 45',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      starterCode: {
        javascript: `function climbStairs(n) {\n    if (n <= 2) return n;\n    let prev2 = 1, prev1 = 2;\n    for (let i = 3; i <= n; i++) {\n        let curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`,
        python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        prev2, prev1 = 1, 2\n        for _ in range(3, n + 1):\n            curr = prev1 + prev2\n            prev2, prev1 = prev1, curr\n        return prev1`,
        cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n};`,
        java: `class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}`
      },
      tags: ['Dynamic Programming', 'Math'],
      companies: ['Uber', 'Adobe', 'Oracle'],
      examples: [
        { input: 'n = 3', output: '3', explanation: 'Ways: (1+1+1), (1+2), (2+1).' }
      ],
      hints: [
        'Notice that ways(n) = ways(n - 1) + ways(n - 2).'
      ]
    }
  ];

  for (const p of PROBLEMS) {
    await sql`
      INSERT INTO dsa_problems (
        id, topic_id, section_id, title, slug, number, description, difficulty,
        constraints, time_complexity, space_complexity, starter_code, display_order, "order", is_visible, is_featured
      ) VALUES (
        ${p.id}, ${p.topicId}, ${p.sectionId}, ${p.title}, ${p.slug}, ${p.number}, ${p.description}, ${p.difficulty},
        ${p.constraints}, ${p.timeComplexity}, ${p.spaceComplexity}, ${JSON.stringify(p.starterCode)}, ${p.number}, ${p.number}, TRUE, TRUE
      )
      ON CONFLICT (id) DO UPDATE SET
        topic_id = EXCLUDED.topic_id,
        section_id = EXCLUDED.section_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        difficulty = EXCLUDED.difficulty,
        constraints = EXCLUDED.constraints,
        starter_code = EXCLUDED.starter_code;
    `;

    // Examples
    await sql`DELETE FROM dsa_problem_examples WHERE problem_id = ${p.id}`;
    for (let i = 0; i < p.examples.length; i++) {
      const ex = p.examples[i];
      await sql`
        INSERT INTO dsa_problem_examples (problem_id, input, output, explanation, display_order)
        VALUES (${p.id}, ${ex.input}, ${ex.output}, ${ex.explanation || null}, ${i + 1});
      `;
    }

    // Hints
    await sql`DELETE FROM dsa_hints WHERE problem_id = ${p.id}`;
    for (let i = 0; i < p.hints.length; i++) {
      await sql`
        INSERT INTO dsa_hints (problem_id, hint_order, content)
        VALUES (${p.id}, ${i + 1}, ${p.hints[i]});
      `;
    }

    // Tags
    for (const tag of p.tags) {
      const tagId = tag.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await sql`
        INSERT INTO dsa_tags (id, name) VALUES (${tagId}, ${tag})
        ON CONFLICT (id) DO NOTHING;
      `;
      await sql`
        INSERT INTO dsa_problem_tags (problem_id, tag_id) VALUES (${p.id}, ${tagId})
        ON CONFLICT DO NOTHING;
      `;
    }

    // Companies
    for (const comp of p.companies) {
      const compId = comp.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await sql`
        INSERT INTO dsa_companies (id, name) VALUES (${compId}, ${comp})
        ON CONFLICT (id) DO NOTHING;
      `;
      await sql`
        INSERT INTO dsa_problem_companies (problem_id, company_id) VALUES (${p.id}, ${compId})
        ON CONFLICT DO NOTHING;
      `;
    }
  }
  console.log('✅ Problems, examples, hints, tags & companies seeded');

  // Daily Problem
  const todayStr = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO dsa_daily_problems (problem_id, date, is_active)
    VALUES ('two-sum', ${todayStr}::date, TRUE)
    ON CONFLICT (date) DO UPDATE SET problem_id = EXCLUDED.problem_id;
  `;
  console.log(`✅ Daily problem set for ${todayStr}`);

  console.log('🎉 Seeding completed successfully!');
}

async function main() {
  try {
    await runDsaMigration();
    await seedDsaData();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration/Seed error:', err);
    process.exit(1);
  }
}

main();

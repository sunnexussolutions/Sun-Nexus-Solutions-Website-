import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.VITE_NEON_URL;
if (!dbUrl) {
  console.error('DATABASE_URL or VITE_NEON_URL is not set in .env');
  process.exit(1);
}
const sql = neon(dbUrl);

const ADDITIONAL_PROBLEMS = [
  // ── Basics ──
  {
    id: 'prob-check-palindrome-num',
    topicId: '01-basics',
    title: 'Check Palindrome Number',
    difficulty: 'Easy',
    pattern: 'Math / Digit Extraction',
    practiceUrl: 'https://leetcode.com/problems/palindrome-number/',
    articleUrl: 'https://takeuforward.org/data-structure/check-if-a-number-is-palindrome-or-not/',
    videoUrl: 'https://www.youtube.com/watch?v=yubRKw_hYlE',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    tags: ['Math', 'Basic Logic'],
    companies: ['Amazon', 'Microsoft']
  },
  {
    id: 'prob-gcd-lcm',
    topicId: '01-basics',
    title: 'GCD and LCM (Euclidean Algorithm)',
    difficulty: 'Easy',
    pattern: 'Euclidean Algorithm',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/gcd-of-two-numbers3459/1',
    articleUrl: 'https://takeuforward.org/data-structure/find-gcd-of-two-numbers/',
    description: 'Given two numbers a and b, find their Greatest Common Divisor (GCD) using the Euclidean algorithm.',
    tags: ['Math', 'Recursion'],
    companies: ['Adobe', 'Infosys']
  },
  {
    id: 'prob-armstrong-number',
    topicId: '01-basics',
    title: 'Check Armstrong Number',
    difficulty: 'Easy',
    pattern: 'Digit Math',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1',
    articleUrl: 'https://takeuforward.org/maths/check-if-a-number-is-armstrong-number-or-not/',
    description: 'A number is called an Armstrong number if the sum of digits raised to the power of number of digits equals the number itself.',
    tags: ['Math'],
    companies: ['TCS', 'Wipro']
  },
  // ── Arrays ──
  {
    id: 'prob-largest-element-array',
    topicId: '02-arrays',
    title: 'Largest Element in Array',
    difficulty: 'Easy',
    pattern: 'Linear Scan',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1',
    articleUrl: 'https://takeuforward.org/data-structure/find-the-largest-element-in-an-array/',
    description: 'Given an array of integers, find the largest element in the array.',
    tags: ['Array'],
    companies: ['Amazon', 'Google']
  },
  {
    id: 'prob-second-largest',
    topicId: '02-arrays',
    title: 'Second Largest Element Without Sorting',
    difficulty: 'Easy',
    pattern: 'Single Pass Scan',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/second-largest3735/1',
    articleUrl: 'https://takeuforward.org/data-structure/find-second-smallest-and-second-largest-element-in-an-array/',
    description: 'Given an array of integers, return the second largest distinct element in O(n) without sorting.',
    tags: ['Array'],
    companies: ['Amazon', 'Microsoft']
  },
  {
    id: 'prob-check-sorted-rotated',
    topicId: '02-arrays',
    title: 'Check if Array is Sorted and Rotated',
    difficulty: 'Easy',
    pattern: 'Array Traversal',
    practiceUrl: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/',
    articleUrl: 'https://takeuforward.org/data-structure/check-if-an-array-is-sorted/',
    description: 'Given an array nums, return true if the array was originally sorted in non-decreasing order, then rotated some number of positions.',
    tags: ['Array'],
    companies: ['Google', 'Meta']
  },
  {
    id: 'prob-remove-duplicates-sorted',
    topicId: '02-arrays',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    pattern: 'Two Pointers (Slow & Fast)',
    practiceUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    articleUrl: 'https://takeuforward.org/data-structure/remove-duplicates-in-place-from-sorted-array/',
    description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.',
    tags: ['Array', 'Two Pointers'],
    companies: ['Amazon', 'Microsoft', 'Apple']
  },
  {
    id: 'prob-rotate-array-k',
    topicId: '02-arrays',
    title: 'Rotate Array by K Places',
    difficulty: 'Medium',
    pattern: 'Reversal Algorithm',
    practiceUrl: 'https://leetcode.com/problems/rotate-array/',
    articleUrl: 'https://takeuforward.org/data-structure/rotate-array-by-k-elements/',
    description: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.',
    tags: ['Array', 'Math'],
    companies: ['Amazon', 'Microsoft', 'Uber']
  },
  {
    id: 'prob-move-zeroes',
    topicId: '02-arrays',
    title: 'Move Zeroes to End',
    difficulty: 'Easy',
    pattern: 'Two Pointers In-Place',
    practiceUrl: 'https://leetcode.com/problems/move-zeroes/',
    articleUrl: 'https://takeuforward.org/data-structure/move-all-zeros-to-the-end-of-the-array/',
    description: 'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements.',
    tags: ['Array', 'Two Pointers'],
    companies: ['Meta', 'Apple', 'Bloomberg']
  },
  {
    id: 'prob-union-two-sorted',
    topicId: '02-arrays',
    title: 'Union of Two Sorted Arrays',
    difficulty: 'Medium',
    pattern: 'Two Pointers Merge',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1',
    articleUrl: 'https://takeuforward.org/data-structure/union-of-two-sorted-arrays/',
    description: 'Given two sorted arrays nums1 and nums2, return the distinct union of elements from both arrays in sorted order.',
    tags: ['Array', 'Two Pointers'],
    companies: ['Amazon', 'Goldman Sachs']
  },
  {
    id: 'prob-find-missing-number',
    topicId: '02-arrays',
    title: 'Find Missing Number in Array',
    difficulty: 'Easy',
    pattern: 'XOR / Gauss Summation',
    practiceUrl: 'https://leetcode.com/problems/missing-number/',
    articleUrl: 'https://takeuforward.org/arrays/find-the-missing-number-in-an-array/',
    description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing.',
    tags: ['Array', 'Bit Manipulation'],
    companies: ['Amazon', 'Microsoft', 'Google']
  },
  {
    id: 'prob-max-consecutive-ones',
    topicId: '02-arrays',
    title: 'Maximum Consecutive Ones',
    difficulty: 'Easy',
    pattern: 'Count Streak',
    practiceUrl: 'https://leetcode.com/problems/max-consecutive-ones/',
    articleUrl: 'https://takeuforward.org/data-structure/count-maximum-consecutive-ones-in-the-array/',
    description: 'Given a binary array nums, return the maximum number of consecutive 1s in the array.',
    tags: ['Array'],
    companies: ['Google', 'Amazon']
  },
  {
    id: 'prob-single-number',
    topicId: '02-arrays',
    title: 'Find the Number that Appears Once',
    difficulty: 'Easy',
    pattern: 'XOR Cancellation',
    practiceUrl: 'https://leetcode.com/problems/single-number/',
    articleUrl: 'https://takeuforward.org/arrays/find-the-number-that-appears-once-and-the-other-numbers-twice/',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(n) time and O(1) space.',
    tags: ['Array', 'Bit Manipulation'],
    companies: ['Amazon', 'Google', 'Meta']
  },
  {
    id: 'prob-sort-colors-dutch',
    topicId: '02-arrays',
    title: 'Sort an Array of 0s, 1s and 2s (Dutch National Flag)',
    difficulty: 'Medium',
    pattern: '3-Way Partitioning (Dutch National Flag)',
    practiceUrl: 'https://leetcode.com/problems/sort-colors/',
    articleUrl: 'https://takeuforward.org/data-structure/sort-an-array-of-0s-1s-and-2s/',
    description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent.',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Microsoft', 'Amazon', 'Meta']
  },
  {
    id: 'prob-majority-element',
    topicId: '02-arrays',
    title: 'Majority Element (> n/2 times) - Moore Voting',
    difficulty: 'Easy',
    pattern: 'Boyer-Moore Voting Algorithm',
    practiceUrl: 'https://leetcode.com/problems/majority-element/',
    articleUrl: 'https://takeuforward.org/data-structure/find-the-majority-element-that-occurs-more-than-n-2-times/',
    description: 'Given an array nums of size n, return the majority element that appears more than ⌊n / 2⌋ times.',
    tags: ['Array', 'Counting'],
    companies: ['Amazon', 'Google', 'Adobe']
  },
  {
    id: 'prob-rearrange-positive-negative',
    topicId: '02-arrays',
    title: 'Rearrange Array Elements by Sign',
    difficulty: 'Medium',
    pattern: 'Two Pointers Index Placement',
    practiceUrl: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/',
    articleUrl: 'https://takeuforward.org/arrays/rearrange-array-elements-by-sign/',
    description: 'You are given a 0-indexed integer array nums of even length consisting of an equal number of positive and negative integers. Rearrange them such that signs alternate.',
    tags: ['Array', 'Two Pointers'],
    companies: ['Amazon', 'Microsoft']
  },
  {
    id: 'prob-next-permutation',
    topicId: '02-arrays',
    title: 'Next Permutation',
    difficulty: 'Medium',
    pattern: 'Lexicographical Generation',
    practiceUrl: 'https://leetcode.com/problems/next-permutation/',
    articleUrl: 'https://takeuforward.org/data-structure/next_permutation-find-next-lexicographically-greater-permutation/',
    description: 'A permutation of an array of integers is an arrangement of its members into a sequence. Find the next lexicographical greater permutation.',
    tags: ['Array', 'Two Pointers'],
    companies: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    id: 'prob-leaders-in-array',
    topicId: '02-arrays',
    title: 'Leaders in an Array',
    difficulty: 'Easy',
    pattern: 'Right-to-Left Max Scan',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1',
    articleUrl: 'https://takeuforward.org/data-structure/leaders-in-an-array/',
    description: 'An element is called a Leader if it is greater than or equal to all the elements to its right side.',
    tags: ['Array'],
    companies: ['Amazon', 'Adobe']
  },
  {
    id: 'prob-longest-consecutive-sequence',
    topicId: '02-arrays',
    title: 'Longest Consecutive Sequence in Array',
    difficulty: 'Medium',
    pattern: 'Hash Set Lookup (O(n))',
    practiceUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    articleUrl: 'https://takeuforward.org/data-structure/longest-consecutive-sequence-in-an-array/',
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.',
    tags: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Spotify']
  },
  {
    id: 'prob-set-matrix-zeroes',
    topicId: '02-arrays',
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    pattern: 'In-Place Matrix State Marking',
    practiceUrl: 'https://leetcode.com/problems/set-matrix-zeroes/',
    articleUrl: 'https://takeuforward.org/data-structure/set-matrix-zero/',
    description: 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0s in-place.',
    tags: ['Array', 'Matrix'],
    companies: ['Microsoft', 'Amazon', 'Meta']
  },
  {
    id: 'prob-rotate-image-matrix',
    topicId: '02-arrays',
    title: 'Rotate Matrix by 90 Degrees Clockwise',
    difficulty: 'Medium',
    pattern: 'Transpose and Reverse Rows',
    practiceUrl: 'https://leetcode.com/problems/rotate-image/',
    articleUrl: 'https://takeuforward.org/data-structure/rotate-image-by-90-degree/',
    description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees clockwise in-place.',
    tags: ['Array', 'Matrix', 'Math'],
    companies: ['Amazon', 'Microsoft', 'Apple']
  },
  {
    id: 'prob-spiral-matrix',
    topicId: '02-arrays',
    title: 'Spiral Traversal of Matrix',
    difficulty: 'Medium',
    pattern: '4-Boundary Layer Simulation',
    practiceUrl: 'https://leetcode.com/problems/spiral-matrix/',
    articleUrl: 'https://takeuforward.org/data-structure/spiral-traversal-of-matrix/',
    description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    tags: ['Array', 'Matrix', 'Simulation'],
    companies: ['Microsoft', 'Amazon', 'Google']
  },
  {
    id: 'prob-subarray-sum-k',
    topicId: '02-arrays',
    title: 'Count Subarrays with Given Sum K',
    difficulty: 'Medium',
    pattern: 'Prefix Sum + Hash Map Frequency',
    practiceUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    articleUrl: 'https://takeuforward.org/arrays/count-subarray-sum-equals-k/',
    description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
    tags: ['Array', 'Hash Table', 'Prefix Sum'],
    companies: ['Meta', 'Amazon', 'Google']
  },
  {
    id: 'prob-pascals-triangle',
    topicId: '02-arrays',
    title: 'Pascal’s Triangle',
    difficulty: 'Easy',
    pattern: 'Combinatorics / Iterative Generation',
    practiceUrl: 'https://leetcode.com/problems/pascals-triangle/',
    articleUrl: 'https://takeuforward.org/data-structure/program-to-generate-pascals-triangle/',
    description: 'Given an integer numRows, return the first numRows of Pascal\'s triangle.',
    tags: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Google', 'Twitter']
  },
  {
    id: 'prob-3sum',
    topicId: '02-arrays',
    title: '3 Sum - Triplet Sums to Zero',
    difficulty: 'Medium',
    pattern: 'Sorting + Two Pointers',
    practiceUrl: 'https://leetcode.com/problems/3sum/',
    articleUrl: 'https://takeuforward.org/data-structure/3-sum-find-triplets-that-add-up-to-a-zero/',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google']
  },
  {
    id: 'prob-4sum',
    topicId: '02-arrays',
    title: '4 Sum Problem',
    difficulty: 'Medium',
    pattern: 'Sorting + Nested Two Pointers',
    practiceUrl: 'https://leetcode.com/problems/4sum/',
    articleUrl: 'https://takeuforward.org/data-structure/4-sum-find-quads-that-add-up-to-a-target-value/',
    description: 'Given an array nums of n integers, return an array of all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that the sum is target.',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Amazon', 'Google']
  },
  {
    id: 'prob-merge-intervals',
    topicId: '02-arrays',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    pattern: 'Interval Sorting & Greedily Extending',
    practiceUrl: 'https://leetcode.com/problems/merge-intervals/',
    articleUrl: 'https://takeuforward.org/data-structure/merge-overlapping-sub-intervals/',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    tags: ['Array', 'Sorting'],
    companies: ['Google', 'Meta', 'Amazon', 'Bloomberg']
  },
  {
    id: 'prob-merge-sorted-no-space',
    topicId: '02-arrays',
    title: 'Merge Two Sorted Arrays Without Extra Space',
    difficulty: 'Hard',
    pattern: 'Gap Method / Two Pointers Swap',
    practiceUrl: 'https://leetcode.com/problems/merge-sorted-array/',
    articleUrl: 'https://takeuforward.org/data-structure/merge-two-sorted-arrays-without-extra-space/',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into nums1 in-place.',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Microsoft', 'Amazon', 'LinkedIn']
  },
  {
    id: 'prob-repeating-and-missing',
    topicId: '02-arrays',
    title: 'Find the Repeating and Missing Number',
    difficulty: 'Medium',
    pattern: 'Math Equations / XOR Partition',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/find-missing-and-repeating2512/1',
    articleUrl: 'https://takeuforward.org/data-structure/find-the-repeating-and-missing-numbers/',
    description: 'Given an unsorted array of size n containing numbers from 1 to n where one number is repeated twice and one is missing, find both.',
    tags: ['Array', 'Math', 'Bit Manipulation'],
    companies: ['Amazon', 'Goldman Sachs']
  },
  {
    id: 'prob-count-inversions',
    topicId: '02-arrays',
    title: 'Count Inversions in Array',
    difficulty: 'Hard',
    pattern: 'Modified Merge Sort',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1',
    articleUrl: 'https://takeuforward.org/data-structure/count-inversions-in-an-array/',
    description: 'Given an array of integers, find the inversion count: how far (or close) the array is from being sorted.',
    tags: ['Array', 'Divide and Conquer', 'Merge Sort'],
    companies: ['Amazon', 'Google', 'Flipkart']
  },
  {
    id: 'prob-reverse-pairs',
    topicId: '02-arrays',
    title: 'Reverse Pairs (nums[i] > 2 * nums[j])',
    difficulty: 'Hard',
    pattern: 'Merge Sort Count',
    practiceUrl: 'https://leetcode.com/problems/reverse-pairs/',
    articleUrl: 'https://takeuforward.org/data-structure/count-reverse-pairs/',
    description: 'Given an integer array nums, return the number of reverse pairs where i < j and nums[i] > 2 * nums[j].',
    tags: ['Array', 'Divide and Conquer', 'Binary Indexed Tree'],
    companies: ['Amazon', 'Google', 'Meta']
  },
  {
    id: 'prob-max-product-subarray',
    topicId: '02-arrays',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    pattern: 'Prefix-Suffix Traversal / Min-Max DP',
    practiceUrl: 'https://leetcode.com/problems/maximum-product-subarray/',
    articleUrl: 'https://takeuforward.org/data-structure/maximum-product-subarray-in-an-array/',
    description: 'Given an integer array nums, find a subarray that has the largest product, and return the product.',
    tags: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Google']
  },
  // ── Strings ──
  {
    id: 'prob-remove-outer-parentheses',
    topicId: '03-strings',
    title: 'Remove Outermost Parentheses',
    difficulty: 'Easy',
    pattern: 'Balance Counter',
    practiceUrl: 'https://leetcode.com/problems/remove-outermost-parentheses/',
    articleUrl: 'https://takeuforward.org/data-structure/remove-outermost-parentheses/',
    description: 'A valid parentheses string s is primitive if it is nonempty, and there does not exist a way to split it into s = A + B.',
    tags: ['String', 'Stack'],
    companies: ['Google', 'Amazon']
  },
  {
    id: 'prob-reverse-words-string',
    topicId: '03-strings',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    pattern: 'Two Pointers Tokenization',
    practiceUrl: 'https://leetcode.com/problems/reverse-words-in-a-string/',
    articleUrl: 'https://takeuforward.org/data-structure/reverse-words-in-a-string/',
    description: 'Given an input string s, reverse the order of the words.',
    tags: ['Two Pointers', 'String'],
    companies: ['Microsoft', 'Amazon', 'Apple']
  },
  {
    id: 'prob-largest-odd-number-string',
    topicId: '03-strings',
    title: 'Largest Odd Number in String',
    difficulty: 'Easy',
    pattern: 'Right-to-Left Search',
    practiceUrl: 'https://leetcode.com/problems/largest-odd-number-in-string/',
    articleUrl: 'https://takeuforward.org/strings/largest-odd-number-in-a-string/',
    description: 'You are given a string num representing a large integer. Return the largest-valued odd integer substring.',
    tags: ['String', 'Math'],
    companies: ['Amazon', 'Google']
  },
  {
    id: 'prob-longest-common-prefix',
    topicId: '03-strings',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    pattern: 'Vertical / Horizontal Scanning',
    practiceUrl: 'https://leetcode.com/problems/longest-common-prefix/',
    articleUrl: 'https://takeuforward.org/data-structure/longest-common-prefix/',
    description: 'Write a function to find the longest common prefix string amongst an array of strings.',
    tags: ['String', 'Trie'],
    companies: ['Amazon', 'Google', 'Meta']
  },
  {
    id: 'prob-isomorphic-strings',
    topicId: '03-strings',
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    pattern: 'Bijective Hash Mapping',
    practiceUrl: 'https://leetcode.com/problems/isomorphic-strings/',
    articleUrl: 'https://takeuforward.org/strings/isomorphic-strings/',
    description: 'Given two strings s and t, determine if they are isomorphic.',
    tags: ['Hash Table', 'String'],
    companies: ['Amazon', 'LinkedIn']
  },
  {
    id: 'prob-rotate-string-check',
    topicId: '03-strings',
    title: 'Check if One String is a Rotation of Another',
    difficulty: 'Easy',
    pattern: 'Double String Substring Search',
    practiceUrl: 'https://leetcode.com/problems/rotate-string/',
    articleUrl: 'https://takeuforward.org/data-structure/check-if-one-string-is-a-rotation-of-another/',
    description: 'Given two strings s and goal, return true if and only if s can become goal after some number of shifts.',
    tags: ['String', 'String Matching'],
    companies: ['Google', 'Microsoft']
  },
  {
    id: 'prob-valid-anagram',
    topicId: '03-strings',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    pattern: 'Character Frequency Counting',
    practiceUrl: 'https://leetcode.com/problems/valid-anagram/',
    articleUrl: 'https://takeuforward.org/data-structure/check-if-two-strings-are-anagrams-of-each-other/',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    tags: ['Hash Table', 'String', 'Sorting'],
    companies: ['Amazon', 'Meta', 'Uber']
  },
  {
    id: 'prob-sort-characters-frequency',
    topicId: '03-strings',
    title: 'Sort Characters By Frequency',
    difficulty: 'Medium',
    pattern: 'Bucket Sort / Priority Queue',
    practiceUrl: 'https://leetcode.com/problems/sort-characters-by-frequency/',
    articleUrl: 'https://takeuforward.org/data-structure/sort-characters-by-frequency/',
    description: 'Given a string s, sort it in decreasing order based on the frequency of the characters.',
    tags: ['Hash Table', 'String', 'Bucket Sort'],
    companies: ['Amazon', 'Bloomberg']
  },
  {
    id: 'prob-nesting-depth-parentheses',
    topicId: '03-strings',
    title: 'Maximum Nesting Depth of Parentheses',
    difficulty: 'Easy',
    pattern: 'Max Counter Tracking',
    practiceUrl: 'https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/',
    articleUrl: 'https://takeuforward.org/strings/maximum-nesting-depth-of-the-parentheses/',
    description: 'Given a valid parentheses string s, return the maximum nesting depth of s.',
    tags: ['String', 'Stack'],
    companies: ['Meta', 'Amazon']
  },
  {
    id: 'prob-roman-to-integer',
    topicId: '03-strings',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    pattern: 'Right-to-Left Value Subtraction',
    practiceUrl: 'https://leetcode.com/problems/roman-to-integer/',
    articleUrl: 'https://takeuforward.org/data-structure/roman-to-integer/',
    description: 'Given a roman numeral, convert it to an integer.',
    tags: ['Hash Table', 'Math', 'String'],
    companies: ['Amazon', 'Microsoft', 'Adobe']
  },
  {
    id: 'prob-string-to-integer-atoi',
    topicId: '03-strings',
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    pattern: 'State Parsing & 32-Bit Clamping',
    practiceUrl: 'https://leetcode.com/problems/string-to-integer-atoi/',
    articleUrl: 'https://takeuforward.org/data-structure/string-to-integer-atoi/',
    description: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.',
    tags: ['String'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google']
  },
  {
    id: 'prob-count-distinct-substrings-k',
    topicId: '03-strings',
    title: 'Count Number of Substrings with Exactly K Distinct Characters',
    difficulty: 'Medium',
    pattern: 'Sliding Window: AtMost(K) - AtMost(K-1)',
    practiceUrl: 'https://www.geeksforgeeks.org/problems/count-number-of-substrings4528/1',
    articleUrl: 'https://takeuforward.org/data-structure/count-number-of-substrings-with-at-most-k-distinct-characters/',
    description: 'Given a string of lowercase alphabets, count all possible substrings that have exactly k distinct characters.',
    tags: ['String', 'Sliding Window'],
    companies: ['Amazon', 'Microsoft']
  },
  {
    id: 'prob-longest-palindromic-substring',
    topicId: '03-strings',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    pattern: 'Expand Around Center (O(n^2)) / Manacher Algorithm',
    practiceUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
    articleUrl: 'https://takeuforward.org/data-structure/longest-palindromic-substring/',
    description: 'Given a string s, return the longest palindromic substring in s.',
    tags: ['String', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta']
  },
  {
    id: 'prob-sum-of-beauty-all-substrings',
    topicId: '03-strings',
    title: 'Sum of Beauty of All Substrings',
    difficulty: 'Medium',
    pattern: 'Nested Frequency Map',
    practiceUrl: 'https://leetcode.com/problems/sum-of-beauty-of-all-substrings/',
    articleUrl: 'https://takeuforward.org/strings/sum-of-beauty-of-all-substrings/',
    description: 'The beauty of a string is the difference in frequencies between the most frequent and least frequent characters. Return the sum of beauty of all substrings.',
    tags: ['Hash Table', 'String', 'Counting'],
    companies: ['Google', 'Amazon']
  }
];

async function seedComprehensiveDSA() {
  console.log('Seeding comprehensive DSA problems...');
  let count = 0;

  for (const p of ADDITIONAL_PROBLEMS) {
    await sql`
      INSERT INTO dsa_problems (
        id, topic_id, title, slug, number, description, difficulty,
        practice_url, video_url, article_url, expected_concepts, is_visible, updated_at
      ) VALUES (
        ${p.id}, ${p.topicId}, ${p.title}, ${p.id},
        (SELECT COALESCE(MAX(number), 0) + 1 FROM dsa_problems),
        ${p.description}, ${p.difficulty}, ${p.practiceUrl}, ${p.videoUrl}, ${p.articleUrl},
        ${p.pattern}, TRUE, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        topic_id = EXCLUDED.topic_id,
        difficulty = EXCLUDED.difficulty,
        description = EXCLUDED.description,
        practice_url = EXCLUDED.practice_url,
        video_url = EXCLUDED.video_url,
        article_url = EXCLUDED.article_url,
        expected_concepts = EXCLUDED.expected_concepts,
        is_visible = TRUE,
        updated_at = CURRENT_TIMESTAMP;
    `;

    // Tags
    if (Array.isArray(p.tags)) {
      for (const tName of p.tags) {
        const cleanT = tName.trim();
        const tId = cleanT.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`INSERT INTO dsa_tags (id, name) VALUES (${tId}, ${cleanT}) ON CONFLICT (name) DO NOTHING;`;
        const tRow = await sql`SELECT id FROM dsa_tags WHERE LOWER(name) = LOWER(${cleanT}) LIMIT 1`;
        if (tRow && tRow.length > 0) {
          await sql`INSERT INTO dsa_problem_tags (problem_id, tag_id) VALUES (${p.id}, ${tRow[0].id}) ON CONFLICT DO NOTHING;`;
        }
      }
    }

    // Companies
    if (Array.isArray(p.companies)) {
      for (const cName of p.companies) {
        const cleanC = cName.trim();
        const cId = cleanC.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`INSERT INTO dsa_companies (id, name) VALUES (${cId}, ${cleanC}) ON CONFLICT (name) DO NOTHING;`;
        const cRow = await sql`SELECT id FROM dsa_companies WHERE LOWER(name) = LOWER(${cleanC}) LIMIT 1`;
        if (cRow && cRow.length > 0) {
          await sql`INSERT INTO dsa_problem_companies (problem_id, company_id) VALUES (${p.id}, ${cRow[0].id}) ON CONFLICT DO NOTHING;`;
        }
      }
    }

    count++;
  }

  console.log(`Successfully seeded ${count} additional high-quality DSA problems into Neon DB!`);
}

seedComprehensiveDSA().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

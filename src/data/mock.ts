// Premium Mock Data with FAANG Company Tags & 20+ Problems

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  companies: string[];
  acceptance: number;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: { input: string; expected: string }[];
}

export const PROBLEMS: Problem[] = [
  {
    id: "p1", number: 1, title: "Two Sum", slug: "two-sum",
    difficulty: "Easy", tags: ["Array", "Hash Table"], companies: ["Google", "Amazon", "Apple"],
    acceptance: 54.2,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.",
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    starterCode: { python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ", javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    " },
    testCases: [{ input: "[2,7,11,15]\n9", expected: "[0,1]" }]
  },
  {
    id: "p2", number: 2, title: "Add Two Numbers", slug: "add-two-numbers",
    difficulty: "Medium", tags: ["Linked List", "Math", "Recursion"], companies: ["Amazon", "Microsoft", "Meta"],
    acceptance: 42.1,
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }],
    constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9"],
    starterCode: { python: "class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        ", javascript: "var addTwoNumbers = function(l1, l2) {\n    " },
    testCases: []
  },
  {
    id: "p3", number: 3, title: "Longest Substring Without Repeating Characters", slug: "longest-substring",
    difficulty: "Medium", tags: ["Hash Table", "String", "Sliding Window"], companies: ["Google", "Amazon", "Adobe"],
    acceptance: 34.5,
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [{ input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' }],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    starterCode: { python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        ", javascript: "var lengthOfLongestSubstring = function(s) {\n    " },
    testCases: []
  },
  {
    id: "p4", number: 4, title: "Median of Two Sorted Arrays", slug: "median-two-sorted",
    difficulty: "Hard", tags: ["Array", "Binary Search", "Divide and Conquer"], companies: ["Google", "Microsoft", "Apple"],
    acceptance: 38.6,
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }],
    constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000"],
    starterCode: { python: "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        ", javascript: "var findMedianSortedArrays = function(nums1, nums2) {\n    " },
    testCases: []
  },
  {
    id: "p5", number: 5, title: "Longest Palindromic Substring", slug: "longest-palindromic",
    difficulty: "Medium", tags: ["String", "Dynamic Programming"], companies: ["Amazon", "Microsoft", "Uber"],
    acceptance: 32.4,
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    examples: [{ input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' }],
    constraints: ["1 <= s.length <= 1000"],
    starterCode: { python: "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        ", javascript: "var longestPalindrome = function(s) {\n    " },
    testCases: []
  },
  {
    id: "p6", number: 11, title: "Container With Most Water", slug: "container-water",
    difficulty: "Medium", tags: ["Array", "Two Pointers", "Greedy"], companies: ["Google", "Adobe", "Meta"],
    acceptance: 54.1,
    description: "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
    constraints: ["n == height.length", "2 <= n <= 10^5"],
    starterCode: { python: "class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        ", javascript: "var maxArea = function(height) {\n    " },
    testCases: []
  },
  {
    id: "p7", number: 15, title: "3Sum", slug: "3sum",
    difficulty: "Medium", tags: ["Array", "Two Pointers", "Sorting"], companies: ["Meta", "Amazon", "Google"],
    acceptance: 33.2,
    description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
    examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
    constraints: ["3 <= nums.length <= 3000"],
    starterCode: { python: "class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        ", javascript: "var threeSum = function(nums) {\n    " },
    testCases: []
  },
  {
    id: "p8", number: 20, title: "Valid Parentheses", slug: "valid-parentheses",
    difficulty: "Easy", tags: ["String", "Stack"], companies: ["Microsoft", "Amazon", "Netflix"],
    acceptance: 40.5,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [{ input: 's = "()"', output: "true" }],
    constraints: ["1 <= s.length <= 10^4"],
    starterCode: { python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        ", javascript: "var isValid = function(s) {\n    " },
    testCases: []
  },
  {
    id: "p9", number: 21, title: "Merge Two Sorted Lists", slug: "merge-two-sorted",
    difficulty: "Easy", tags: ["Linked List", "Recursion"], companies: ["Amazon", "Microsoft", "Apple"],
    acceptance: 63.4,
    description: "You are given the heads of two sorted linked lists `list1` and `l2`. Merge the two lists into one sorted list.",
    examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }],
    constraints: ["The number of nodes in both lists is in the range [0, 50]."],
    starterCode: { python: "class Solution:\n    def mergeTwoLists(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        ", javascript: "var mergeTwoLists = function(l1, l2) {\n    " },
    testCases: []
  },
  {
    id: "p10", number: 23, title: "Merge k Sorted Lists", slug: "merge-k-sorted",
    difficulty: "Hard", tags: ["Linked List", "Heap", "Divide and Conquer"], companies: ["Google", "Amazon", "Meta"],
    acceptance: 49.2,
    description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
    constraints: ["k == lists.length", "0 <= k <= 10^4"],
    starterCode: { python: "class Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        ", javascript: "var mergeKLists = function(lists) {\n    " },
    testCases: []
  },
  {
    id: "p11", number: 33, title: "Search in Rotated Sorted Array", slug: "search-rotated",
    difficulty: "Medium", tags: ["Array", "Binary Search"], companies: ["Microsoft", "Google", "Amazon"],
    acceptance: 39.8,
    description: "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.",
    examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }],
    constraints: ["1 <= nums.length <= 5000"],
    starterCode: { python: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        ", javascript: "var search = function(nums, target) {\n    " },
    testCases: []
  },
  {
    id: "p12", number: 42, title: "Trapping Rain Water", slug: "trapping-rain-water",
    difficulty: "Hard", tags: ["Array", "Two Pointers", "Stack", "Monotonic Stack"], companies: ["Google", "Amazon", "Apple", "Meta"],
    acceptance: 59.5,
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4"],
    starterCode: { python: "class Solution:\n    def trap(self, height: List[int]) -> int:\n        ", javascript: "var trap = function(height) {\n    " },
    testCases: []
  },
  {
    id: "p13", number: 49, title: "Group Anagrams", slug: "group-anagrams",
    difficulty: "Medium", tags: ["Array", "Hash Table", "String", "Sorting"], companies: ["Amazon", "Microsoft", "Google"],
    acceptance: 67.2,
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
    constraints: ["1 <= strs.length <= 10^4"],
    starterCode: { python: "class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        ", javascript: "var groupAnagrams = function(strs) {\n    " },
    testCases: []
  },
  {
    id: "p14", number: 53, title: "Maximum Subarray", slug: "maximum-subarray",
    difficulty: "Medium", tags: ["Array", "Divide and Conquer", "Dynamic Programming"], companies: ["Amazon", "Microsoft", "Meta"],
    acceptance: 50.4,
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: { python: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        ", javascript: "var maxSubArray = function(nums) {\n    " },
    testCases: []
  },
  {
    id: "p15", number: 70, title: "Climbing Stairs", slug: "climbing-stairs",
    difficulty: "Easy", tags: ["Math", "Dynamic Programming", "Memoization"], companies: ["Amazon", "Apple", "Google"],
    acceptance: 52.8,
    description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    examples: [{ input: "n = 3", output: "3" }],
    constraints: ["1 <= n <= 45"],
    starterCode: { python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        ", javascript: "var climbStairs = function(n) {\n    " },
    testCases: []
  },
  {
    id: "p16", number: 94, title: "Binary Tree Inorder Traversal", slug: "binary-tree-inorder",
    difficulty: "Easy", tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"], companies: ["Microsoft", "Google", "Amazon"],
    acceptance: 74.3,
    description: "Given the `root` of a binary tree, return the inorder traversal of its nodes' values.",
    examples: [{ input: "root = [1,null,2,3]", output: "[1,3,2]" }],
    constraints: ["The number of nodes in the tree is in the range [0, 100]."],
    starterCode: { python: "class Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        ", javascript: "var inorderTraversal = function(root) {\n    " },
    testCases: []
  },
  {
    id: "p17", number: 121, title: "Best Time to Buy and Sell Stock", slug: "buy-sell-stock",
    difficulty: "Easy", tags: ["Array", "Dynamic Programming"], companies: ["Amazon", "Meta", "Google", "Microsoft"],
    acceptance: 54.7,
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell.",
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 and sell on day 5, profit = 6-1 = 5." }],
    constraints: ["1 <= prices.length <= 10^5"],
    starterCode: { python: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        ", javascript: "var maxProfit = function(prices) {\n    " },
    testCases: []
  },
  {
    id: "p18", number: 141, title: "Linked List Cycle", slug: "linked-list-cycle",
    difficulty: "Easy", tags: ["Hash Table", "Linked List", "Two Pointers"], companies: ["Amazon", "Apple", "Microsoft"],
    acceptance: 48.9,
    description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.",
    examples: [{ input: "head = [3,2,0,-4], pos = 1", output: "true" }],
    constraints: ["The number of nodes in the list is in the range [0, 10^4]."],
    starterCode: { python: "class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        ", javascript: "var hasCycle = function(head) {\n    " },
    testCases: []
  },
  {
    id: "p19", number: 200, title: "Number of Islands", slug: "number-of-islands",
    difficulty: "Medium", tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], companies: ["Amazon", "Google", "Microsoft", "Meta"],
    acceptance: 57.8,
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.",
    examples: [{ input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" }],
    constraints: ["m == grid.length", "n == grid[i].length"],
    starterCode: { python: "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        ", javascript: "var numIslands = function(grid) {\n    " },
    testCases: []
  },
  {
    id: "p20", number: 206, title: "Reverse Linked List", slug: "reverse-linked-list",
    difficulty: "Easy", tags: ["Linked List", "Recursion"], companies: ["Amazon", "Apple", "Meta"],
    acceptance: 75.1,
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
    constraints: ["The number of nodes in the list is the range [0, 5000]."],
    starterCode: { python: "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        ", javascript: "var reverseList = function(head) {\n    " },
    testCases: []
  }
];

export const LANGUAGES = [
  { id: "python", name: "Python", ext: ".py", judge0: 71, piston: "python", version: "3.10.0", icon: "PY", color: "from-blue-400 to-yellow-400" },
  { id: "javascript", name: "JavaScript", ext: ".js", judge0: 63, piston: "javascript", version: "18.15.0", icon: "JS", color: "from-yellow-400 to-amber-500" },
  { id: "cpp", name: "C++", ext: ".cpp", judge0: 54, piston: "c++", version: "10.2.0", icon: "C+", color: "from-blue-600 to-indigo-700" },
  { id: "c", name: "C", ext: ".c", judge0: 50, piston: "c", version: "10.2.0", icon: "C", color: "from-slate-500 to-slate-700" },
  { id: "java", name: "Java", ext: ".java", judge0: 62, piston: "java", version: "15.0.2", icon: "JA", color: "from-orange-500 to-red-500" },
  { id: "rust", name: "Rust", ext: ".rs", judge0: 73, piston: "rust", version: "1.68.2", icon: "RS", color: "from-orange-600 to-amber-700" },
  { id: "go", name: "Go", ext: ".go", judge0: 60, piston: "go", version: "1.16.2", icon: "GO", color: "from-cyan-500 to-blue-500" },
  { id: "html", name: "HTML5", ext: ".html", judge0: 0, piston: "", version: "Live", icon: "HT", color: "from-orange-500 to-rose-500" },
  { id: "css", name: "CSS3", ext: ".css", judge0: 0, piston: "", version: "Live", icon: "CS", color: "from-blue-500 to-cyan-500" },
  { id: "csharp", name: "C#", ext: ".cs", judge0: 51, piston: "csharp", version: "6.12.0", icon: "C#", color: "from-purple-600 to-violet-700" },
  { id: "typescript", name: "TypeScript", ext: ".ts", judge0: 74, piston: "typescript", version: "5.0.3", icon: "TS", color: "from-blue-500 to-blue-700" },
  { id: "php", name: "PHP", ext: ".php", judge0: 68, piston: "php", version: "8.2.3", icon: "PH", color: "from-indigo-500 to-purple-600" },
  { id: "ruby", name: "Ruby", ext: ".rb", judge0: 72, piston: "ruby", version: "3.0.1", icon: "RB", color: "from-red-500 to-rose-700" },
  { id: "swift", name: "Swift", ext: ".swift", judge0: 83, piston: "swift", version: "5.3.3", icon: "SW", color: "from-orange-400 to-red-400" },
  { id: "kotlin", name: "Kotlin", ext: ".kt", judge0: 78, piston: "kotlin", version: "1.8.20", icon: "KT", color: "from-purple-500 to-pink-500" },
  { id: "bash", name: "Bash", ext: ".sh", judge0: 46, piston: "bash", version: "5.2.0", icon: "SH", color: "from-emerald-600 to-green-700" },
  { id: "sql", name: "SQL (SQLite)", ext: ".sql", judge0: 82, piston: "sqlite3", version: "3.36.0", icon: "SQ", color: "from-sky-500 to-blue-600" },
  { id: "json", name: "JSON", ext: ".json", judge0: 0, piston: "", version: "Validator", icon: "{}", color: "from-amber-500 to-orange-500" },
  { id: "markdown", name: "Markdown", ext: ".md", judge0: 0, piston: "", version: "Preview", icon: "MD", color: "from-slate-400 to-slate-600" },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export interface Contest {
  id: string; title: string; status: "Live" | "Upcoming" | "Ended";
  startsAt: string; durationMins: number; participants: number;
  prize: string; problems: number; tag: string; banner: string;
}

export const CONTESTS: Contest[] = [
  { id: "c1", title: "Nova Weekly #142", status: "Live", startsAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), durationMins: 120, participants: 8421, prize: "$5,000", problems: 4, tag: "Algorithms", banner: "from-violet-600 via-fuchsia-500 to-cyan-400" },
  { id: "c2", title: "AI x Code Hackathon", status: "Upcoming", startsAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), durationMins: 1440, participants: 3120, prize: "$25,000", problems: 6, tag: "AI / ML", banner: "from-emerald-500 via-teal-400 to-cyan-400" },
  { id: "c4", title: "Nova Biweekly #87", status: "Ended", startsAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), durationMins: 90, participants: 12048, prize: "$1,500", problems: 4, tag: "Algorithms", banner: "from-indigo-600 via-violet-500 to-purple-400" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Aarav Kumar", handle: "@arav.dev", country: "IN", rating: 3148, solved: 1284, streak: 312 },
  { rank: 2, name: "Mei Chen", handle: "@meichen", country: "CN", rating: 3091, solved: 1198, streak: 240 },
  { rank: 3, name: "Diego Rivera", handle: "@drivera", country: "MX", rating: 2987, solved: 1156, streak: 199 },
  { rank: 4, name: "Sophie Laurent", handle: "@sophie.l", country: "FR", rating: 2901, solved: 1102, streak: 156 },
  { rank: 5, name: "Lucas Muller", handle: "@lmuller", country: "DE", rating: 2854, solved: 1051, streak: 144 },
  { rank: 6, name: "Sara Ahmed", handle: "@sahmed", country: "EG", rating: 2801, solved: 999, streak: 122 },
  { rank: 7, name: "Hiro Tanaka", handle: "@htanaka", country: "JP", rating: 2780, solved: 980, streak: 110 },
  { rank: 8, name: "Olivia Smith", handle: "@osmith", country: "US", rating: 2745, solved: 955, streak: 99 },
  { rank: 9, name: "Noah Brown", handle: "@nbrown", country: "CA", rating: 2719, solved: 940, streak: 88 },
  { rank: 10, name: "Ananya Singh", handle: "@asingh", country: "IN", rating: 2698, solved: 921, streak: 80 },
  { rank: 11, name: "Fatima Khan", handle: "@fkhan", country: "AE", rating: 2610, solved: 870, streak: 73 },
  { rank: 12, name: "Ethan Wright", handle: "@ewright", country: "GB", rating: 2554, solved: 833, streak: 67 },
  { rank: 13, name: "Maria Garcia", handle: "@mgarcia", country: "ES", rating: 2481, solved: 790, streak: 61 },
  { rank: 14, name: "Kim Min-jun", handle: "@minjun", country: "KR", rating: 2408, solved: 772, streak: 58 },
  { rank: 15, name: "Liam O'Connor", handle: "@liamoc", country: "IE", rating: 2366, solved: 710, streak: 50 },
  { rank: 16, name: "Nadia Petrova", handle: "@npetrova", country: "PL", rating: 2299, solved: 680, streak: 44 },
  { rank: 17, name: "Chen Wei", handle: "@chenwei", country: "SG", rating: 2238, solved: 640, streak: 39 },
  { rank: 18, name: "Ibrahim Musa", handle: "@imusa", country: "NG", rating: 2180, solved: 604, streak: 36 },
  { rank: 19, name: "Emma Novak", handle: "@enovak", country: "CZ", rating: 2115, solved: 570, streak: 33 },
  { rank: 20, name: "Ravi Patel", handle: "@rpatel", country: "IN", rating: 2080, solved: 540, streak: 29 },
];

export const BLOG_POSTS = [
  { id: "b1", title: "Mastering Dynamic Programming in 30 Days", excerpt: "A practical, problem-first roadmap to DP covering memoization, tabulation, patterns, and interview-level examples.", category: "DSA Guide", author: "Aarav Kumar", date: "Mar 14, 2026", readMins: 12, emoji: "DP", gradient: "from-violet-500 to-fuchsia-500" },
  { id: "b2", title: "How AI Is Transforming Code Reviews", excerpt: "From static linters to context-aware AI copilots, here is how modern engineering teams review code faster.", category: "AI", author: "Mei Chen", date: "Mar 10, 2026", readMins: 8, emoji: "AI", gradient: "from-cyan-500 to-emerald-500" },
  { id: "b3", title: "The 7 System Design Patterns You Must Know", excerpt: "Caching, sharding, queues, rate limiting, event sourcing, CQRS, and observability explained for interviews.", category: "Interview Prep", author: "Diego Rivera", date: "Mar 7, 2026", readMins: 14, emoji: "SD", gradient: "from-amber-500 to-pink-500" },
  { id: "b4", title: "From Beginner to FAANG: A 12-Month Plan", excerpt: "A complete path covering DSA, projects, system design, resume polish, mock interviews, and consistency habits.", category: "Career", author: "Sophie Laurent", date: "Mar 2, 2026", readMins: 18, emoji: "FA", gradient: "from-emerald-500 to-cyan-500" },
  { id: "b5", title: "Sliding Window Patterns That Solve 40+ Problems", excerpt: "Learn fixed window, variable window, frequency maps, at-most-k, and shortest-valid-window techniques.", category: "DSA Guide", author: "Ananya Singh", date: "Feb 26, 2026", readMins: 11, emoji: "SW", gradient: "from-blue-500 to-violet-500" },
  { id: "b6", title: "Prompt Engineering for Developers", excerpt: "Concrete prompts to debug, refactor, test, and document code using AI without losing engineering control.", category: "AI", author: "Sara Ahmed", date: "Feb 22, 2026", readMins: 7, emoji: "PE", gradient: "from-pink-500 to-violet-500" },
  { id: "b7", title: "How to Build an ATS-Friendly Developer Resume", excerpt: "Write impact bullets, choose projects, add metrics, pass ATS filters, and tell a clear engineering story.", category: "Career", author: "Olivia Smith", date: "Feb 18, 2026", readMins: 10, emoji: "CV", gradient: "from-slate-500 to-cyan-500" },
  { id: "b8", title: "Graph Algorithms Roadmap for Interviews", excerpt: "BFS, DFS, topological sort, Union Find, shortest paths, MST, and connected components in one guide.", category: "DSA Guide", author: "Hiro Tanaka", date: "Feb 14, 2026", readMins: 16, emoji: "GR", gradient: "from-indigo-500 to-blue-500" },
  { id: "b9", title: "Mock Interview Checklist: What Interviewers Actually Score", excerpt: "Communication, constraints, edge cases, complexity, dry runs, and implementation quality broken down clearly.", category: "Interview Prep", author: "Fatima Khan", date: "Feb 10, 2026", readMins: 9, emoji: "MI", gradient: "from-rose-500 to-orange-500" },
  { id: "b10", title: "Why Rust and Go Are Winning Backend Systems", excerpt: "A pragmatic comparison of safety, performance, concurrency, ecosystem, and production team adoption.", category: "Programming Tips", author: "Lucas Muller", date: "Feb 6, 2026", readMins: 12, emoji: "RS", gradient: "from-orange-500 to-red-500" },
];

export const TESTIMONIALS = [
  { name: "Priya Sharma",  role: "SDE-2 @ Stripe",   avatar: "PS", quote: "CodeNova’s AI assistant explained tricky DP problems better than any mentor I’ve had. Landed Stripe in 4 months.", color: "from-violet-500 to-fuchsia-500" },
  { name: "Daniel Park",   role: "ML Engineer @ Meta", avatar: "DP", quote: "The live contests are addictive. The leaderboard pushed me to grind 200+ problems. Worth every minute.", color: "from-emerald-500 to-cyan-500" },
  { name: "Yuki Tanaka",   role: "CS Student, MIT",  avatar: "YT", quote: "Honestly the best UI of any coding platform I’ve used. The 19-language compiler is a game changer for my assignments.", color: "from-amber-500 to-orange-500" },
  { name: "Marcus Johnson", role: "Backend @ Vercel", avatar: "MJ", quote: "I prepared for system design rounds entirely on CodeNova. The mock interviews with AI are spookily realistic.", color: "from-blue-500 to-indigo-500" },
];

export const ACHIEVEMENTS = [
  { id: "a1", name: "First Submit",   desc: "Submit your first solution",  emoji: "🚀", unlocked: true,  rarity: "Common" },
  { id: "a2", name: "Streak Master",  desc: "Code 30 days in a row",       emoji: "🔥", unlocked: true,  rarity: "Rare" },
];

export const HEATMAP: number[][] = Array.from({ length: 53 }, () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)));

export const SKILL_DATA = [
  { name: "Arrays", value: 92 },
  { name: "Strings", value: 88 },
  { name: "DP", value: 71 },
];

export const RECENT_SUBMISSIONS = [
  { id: "s1", problem: "Two Sum", language: "Python", status: "Accepted", runtime: "42 ms", memory: "16.1 MB", time: "2 min ago" },
];

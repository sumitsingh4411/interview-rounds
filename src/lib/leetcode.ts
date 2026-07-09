/**
 * Question title → official LeetCode slug.
 *
 * Every slug here is checked against LeetCode's public problem list by
 * `npm run verify:leetcode`. A question that has no real LeetCode equivalent
 * (an aptitude section, a machine-coding task, a behavioural prompt) is simply
 * absent — we would rather show no link than a link to a search that finds
 * nothing.
 */
const SLUGS: Record<string, string> = {
  // DSA
  'two sum — return indices of numbers adding to a target': 'two-sum',
  'valid parentheses — check balanced brackets': 'valid-parentheses',
  'merge two sorted linked lists': 'merge-two-sorted-lists',
  'best time to buy and sell stock': 'best-time-to-buy-and-sell-stock',
  'group anagrams from a list of strings': 'group-anagrams',
  'number of islands in a 2d grid': 'number-of-islands',
  'longest substring without repeating characters':
    'longest-substring-without-repeating-characters',
  'course schedule — detect a cycle / topological sort': 'course-schedule',
  'lru cache with o(1) get and put': 'lru-cache',
  'kth largest element in an array': 'kth-largest-element-in-an-array',
  'word ladder — shortest transformation sequence': 'word-ladder',
  'merge k sorted lists': 'merge-k-sorted-lists',
  'median of two sorted arrays': 'median-of-two-sorted-arrays',
  'serialize and deserialize a binary tree': 'serialize-and-deserialize-binary-tree',
  'trapping rain water': 'trapping-rain-water',
  'container with most water': 'container-with-most-water',
  'product of array except self': 'product-of-array-except-self',
  'longest palindromic substring': 'longest-palindromic-substring',
  'search in a rotated sorted array': 'search-in-rotated-sorted-array',
  'coin change — fewest coins to make an amount': 'coin-change',
  'climbing stairs': 'climbing-stairs',
  'maximum subarray (kadane)': 'maximum-subarray',
  'validate a binary search tree': 'validate-binary-search-tree',
  'lowest common ancestor of a binary tree':
    'lowest-common-ancestor-of-a-binary-tree',
  'clone a graph': 'clone-graph',
  'implement a trie (prefix tree)': 'implement-trie-prefix-tree',
  'top k frequent elements': 'top-k-frequent-elements',
  'meeting rooms ii — minimum rooms required': 'meeting-rooms-ii',
  'longest increasing subsequence': 'longest-increasing-subsequence',
  'sliding window maximum': 'sliding-window-maximum',
  'word search in a grid': 'word-search',
  'rotting oranges': 'rotting-oranges',
  'reverse nodes in k-group': 'reverse-nodes-in-k-group',
  'edit distance': 'edit-distance',

  // Online assessment
  'implement a min-stack supporting getmin in o(1)': 'min-stack',
  'rotate a matrix 90 degrees in place': 'rotate-image',
  'find the missing number in 1..n': 'missing-number',
  'longest common prefix among strings': 'longest-common-prefix',
  'move zeroes to the end in place': 'move-zeroes',
  'spiral order traversal of a matrix': 'spiral-matrix',
};

/** Titles vary in punctuation; the map is keyed on a normalized form. */
export function normalizeTitle(title: string): string {
  return title
    .trim()
    .replace(/[.?!]+$/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function leetcodeSlug(title: string): string | null {
  return SLUGS[normalizeTitle(title)] ?? null;
}

/** Exported so the verifier can check every slug against the real problem list. */
export const ALL_SLUGS: string[] = Object.values(SLUGS);

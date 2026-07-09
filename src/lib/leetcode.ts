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
  'reverse a linked list': 'reverse-linked-list',
  'valid anagram': 'valid-anagram',
  'contains duplicate': 'contains-duplicate',
  'maximum depth of a binary tree': 'maximum-depth-of-binary-tree',
  'invert a binary tree': 'invert-binary-tree',
  'diameter of a binary tree': 'diameter-of-binary-tree',
  'same tree': 'same-tree',
  'subtree of another tree': 'subtree-of-another-tree',
  '3sum': '3sum',
  'merge intervals': 'merge-intervals',
  'insert interval': 'insert-interval',
  'binary tree level order traversal': 'binary-tree-level-order-traversal',
  'kth smallest element in a bst': 'kth-smallest-element-in-a-bst',
  'construct binary tree from preorder and inorder traversal':
    'construct-binary-tree-from-preorder-and-inorder-traversal',
  subsets: 'subsets',
  permutations: 'permutations',
  'combination sum': 'combination-sum',
  'house robber': 'house-robber',
  'house robber ii': 'house-robber-ii',
  'word break': 'word-break',
  'unique paths': 'unique-paths',
  'jump game': 'jump-game',
  'rotate array': 'rotate-array',
  'find minimum in rotated sorted array': 'find-minimum-in-rotated-sorted-array',
  'daily temperatures': 'daily-temperatures',
  'decode ways': 'decode-ways',
  'pacific atlantic water flow': 'pacific-atlantic-water-flow',
  'course schedule ii': 'course-schedule-ii',
  'longest consecutive sequence': 'longest-consecutive-sequence',
  'maximum product subarray': 'maximum-product-subarray',
  'set matrix zeroes': 'set-matrix-zeroes',
  'sort colors': 'sort-colors',
  'pow(x, n)': 'powx-n',
  'min cost to connect all points': 'min-cost-to-connect-all-points',
  'find median from data stream': 'find-median-from-data-stream',
  'largest rectangle in histogram': 'largest-rectangle-in-histogram',
  'minimum window substring': 'minimum-window-substring',
  'binary tree maximum path sum': 'binary-tree-maximum-path-sum',
  'word search ii': 'word-search-ii',
  'regular expression matching': 'regular-expression-matching',

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

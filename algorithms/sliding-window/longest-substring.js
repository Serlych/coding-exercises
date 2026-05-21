// Given a string, find the length of the longest substring without repeating characters.
// Example 1:

// Input: "abcabcbb"
// Output: 3
// Explanation: The answer is "abc", with the length of 3.
// Example 2:

// Input: "bbbbb"
// Output: 1
// Explanation: The answer is "b", with the length of 1.
// Example 3:

// Input: "pwwkew"
// Output: 3
// Explanation: The answer is "wke", with the length of 3.
// Note that the answer must be a substring, "pwke" is a subsequence and not a substring.

function lengthOfLongestSubstring(str) {
    let hash = {};
    let max = 0;
    let noRepeat = 0;
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] in hash) {
            noRepeat = Math.min(i - hash[str[i]], noRepeat + 1);
        } else {
            noRepeat += 1;
        }
        
        max = Math.max(noRepeat, max);
        hash[str[i]] = i;
    }
    
    return max;
}

console.log(lengthOfLongestSubstring("abcabcbb"));
console.log(lengthOfLongestSubstring("abccd"));
console.log(lengthOfLongestSubstring("bbbbb"));
console.log(lengthOfLongestSubstring("pwwkew"));

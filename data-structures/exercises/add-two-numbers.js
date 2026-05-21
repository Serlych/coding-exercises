// You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse
// order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.
// You may assume the two numbers do not contain any leading zero, except the number 0 itself.

// Example:

// Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
// Output: 7 -> 0 -> 8
// Explanation: 342 + 465 = 807.

function ListNode(val) {
    this.val = val;
    this.next = null;
}

function addTwoNumbers(l1, l2) {
    function getReversedNumbers(list) {
        const result = [];
        
        let current = list;
        while(current) {
            result.push(current.val);
            current = current.next;
        }
        
        return BigInt(result.reverse().join(''));
    }
    
    let result = getReversedNumbers(l1) + getReversedNumbers(l2);
    result = result.toString().split('').reverse();
    
    const resultList = new ListNode(result[0]);
    let current = resultList;
    
    for (let i = 1; i < result.length; i++) {
        current.next = new ListNode(result[i]);
        current = current.next;
    }
    
    return resultList;
}

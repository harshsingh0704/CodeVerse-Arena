const questionsData = [{
  title: "Two Sum",

  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",

  constraints:
    "2 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9\nExactly one solution exists.",

  testCases: [
  {
    input: `4
2 7 11 15
9`,
    output: `0 1`
  },
  {
    input: `3
3 2 4
6`,
    output: `1 2`
  },
  {
    input: `2
3 3
6`,
    output: `0 1`
  }
  ],

  hints: [
    "Use a HashMap.",
    "Store value -> index.",
    "Look for target-current."
  ],

  referenceCode: [
    {
      language: "cpp",
      code: `vector<int> twoSum(vector<int>& nums, int target){
unordered_map<int,int> mp;
for(int i=0;i<nums.size();i++){
int rem=target-nums[i];
if(mp.count(rem)) return {mp[rem],i};
mp[nums[i]]=i;
}
return {};
}`
    }
  ]
},
{
title:"Best Time to Buy and Sell Stock",

description:
"Find the maximum profit by choosing one day to buy and one future day to sell.",

constraints:
"1 <= prices.length <= 10^5",

testCases:[
{
input:"[7,1,5,3,6,4]",
output:"5"
},
{
input:"[7,6,4,3,1]",
output:"0"
}
],

hints:[
"Track minimum price.",
"Update answer every day.",
"One traversal."
],

referenceCode:[
{
language:"cpp",
code:`int maxProfit(vector<int>& prices){
int mn=prices[0];
int ans=0;
for(int p:prices){
mn=min(mn,p);
ans=max(ans,p-mn);
}
return ans;
}`
}
]
},
{
title:"Valid Parentheses",

description:
"Determine if the input string contains valid parentheses.",

constraints:
"1 <= s.length <= 10^4",

testCases:[
{
input:"()[]{}",
output:"true"
},
{
input:"(]",
output:"false"
},
{
input:"([{}])",
output:"true"
}
],

hints:[
"Stack problem.",
"Push opening brackets.",
"Match while popping."
],

referenceCode:[
{
language:"cpp",
code:`bool isValid(string s){
stack<char> st;
for(char c:s){
if(c=='('||c=='{'||c=='[') st.push(c);
else{
if(st.empty()) return false;
char t=st.top();
st.pop();
if(c==')'&&t!='(') return false;
if(c=='}'&&t!='{') return false;
if(c==']'&&t!='[') return false;
}
}
return st.empty();
}`
}
]
},
{
title:"Binary Search",

description:
"Given a sorted array, return the index of target.",

constraints:
"Array is sorted.",

testCases:[
{
input:"nums=[-1,0,3,5,9,12], target=9",
output:"4"
},
{
input:"nums=[-1,0,3,5,9,12], target=2",
output:"-1"
}
],

hints:[
"Use low/high.",
"Find middle.",
"Discard half."
],

referenceCode:[
{
language:"cpp",
code:`int search(vector<int>& nums,int target){
int l=0,r=nums.size()-1;
while(l<=r){
int m=l+(r-l)/2;
if(nums[m]==target) return m;
if(nums[m]<target) l=m+1;
else r=m-1;
}
return -1;
}`
}
]
},
{
title:"Merge Sorted Array",

description:
"Merge nums2 into nums1 in-place.",

constraints:
"Use O(1) extra space.",

testCases:[
{
input:"nums1=[1,2,3,0,0,0], nums2=[2,5,6]",
output:"[1,2,2,3,5,6]"
}
],

hints:[
"Start from end.",
"Compare largest.",
"Fill backwards."
],

referenceCode:[
{
language:"cpp",
code:`void merge(vector<int>& nums1,int m,vector<int>& nums2,int n){
int i=m-1,j=n-1,k=m+n-1;
while(j>=0){
if(i>=0&&nums1[i]>nums2[j]) nums1[k--]=nums1[i--];
else nums1[k--]=nums2[j--];
}
}`
}
]
},
{
title:"Contains Duplicate",

description:
"Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",

constraints:
"1 <= nums.length <= 10^5",

testCases:[
{
input:"[1,2,3,1]",
output:"true"
},
{
input:"[1,2,3,4]",
output:"false"
}
],

hints:[
"HashSet stores visited numbers.",
"Check before inserting.",
"O(n) solution."
],

referenceCode:[
{
language:"cpp",
code:`bool containsDuplicate(vector<int>& nums){
unordered_set<int> st;
for(int x:nums){
if(st.count(x)) return true;
st.insert(x);
}
return false;
}`
}
]
},

{
title:"Maximum Subarray",

description:
"Find the contiguous subarray having the largest sum.",

constraints:
"1 <= nums.length <= 10^5",

testCases:[
{
input:"[-2,1,-3,4,-1,2,1,-5,4]",
output:"6"
},
{
input:"[1]",
output:"1"
}
],

hints:[
"Kadane's Algorithm.",
"Reset negative prefix.",
"Track maximum sum."
],

referenceCode:[
{
language:"cpp",
code:`int maxSubArray(vector<int>& nums){
int cur=0,ans=INT_MIN;
for(int x:nums){
cur=max(x,cur+x);
ans=max(ans,cur);
}
return ans;
}`
}
]
},

{
title:"Move Zeroes",

description:
"Move all zeroes to the end while maintaining the relative order of non-zero elements.",

constraints:
"1 <= nums.length <= 10^4",

testCases:[
{
input:"[0,1,0,3,12]",
output:"[1,3,12,0,0]"
}
],

hints:[
"Use two pointers.",
"Swap non-zero values.",
"In-place solution."
],

referenceCode:[
{
language:"cpp",
code:`void moveZeroes(vector<int>& nums){
int j=0;
for(int i=0;i<nums.size();i++){
if(nums[i]!=0)
swap(nums[i],nums[j++]);
}
}`
}
]
},

{
title:"Product of Array Except Self",

description:
"Return an array answer such that answer[i] equals the product of all elements except nums[i].",

constraints:
"Do not use division.",

testCases:[
{
input:"[1,2,3,4]",
output:"[24,12,8,6]"
},
{
input:"[-1,1,0,-3,3]",
output:"[0,0,9,0,0]"
}
],

hints:[
"Prefix products.",
"Suffix products.",
"O(1) extra space possible."
],

referenceCode:[
{
language:"cpp",
code:`vector<int> productExceptSelf(vector<int>& nums){
int n=nums.size();
vector<int> ans(n,1);
int pre=1,suf=1;
for(int i=0;i<n;i++){
ans[i]=pre;
pre*=nums[i];
}
for(int i=n-1;i>=0;i--){
ans[i]*=suf;
suf*=nums[i];
}
return ans;
}`
}
]
},

{
title:"Longest Consecutive Sequence",

description:
"Return the length of the longest consecutive elements sequence.",

constraints:
"1 <= nums.length <= 10^5",

testCases:[
{
input:"[100,4,200,1,3,2]",
output:"4"
},
{
input:"[0,3,7,2,5,8,4,6,0,1]",
output:"9"
}
],

hints:[
"HashSet.",
"Start only from sequence beginning.",
"O(n)."
],

referenceCode:[
{
language:"cpp",
code:`int longestConsecutive(vector<int>& nums){
unordered_set<int> st(nums.begin(),nums.end());
int ans=0;
for(int x:st){
if(!st.count(x-1)){
int cur=x,len=1;
while(st.count(cur+1)){
cur++;
len++;
}
ans=max(ans,len);
}
}
return ans;
}`
}
]
},

{
title:"Rotate Array",

description:
"Rotate the array to the right by k steps.",

constraints:
"1 <= nums.length <= 10^5",

testCases:[
{
input:"nums=[1,2,3,4,5,6,7], k=3",
output:"[5,6,7,1,2,3,4]"
},
{
input:"nums=[-1,-100,3,99], k=2",
output:"[3,99,-1,-100]"
}
],

hints:[
"Reverse entire array.",
"Reverse first k.",
"Reverse remaining."
],

referenceCode:[
{
language:"cpp",
code:`void rotate(vector<int>& nums,int k){
k%=nums.size();
reverse(nums.begin(),nums.end());
reverse(nums.begin(),nums.begin()+k);
reverse(nums.begin()+k,nums.end());
}`
}
]
},
{
title:"Valid Anagram",

description:
"Given two strings s and t, return true if t is an anagram of s, otherwise return false.",

constraints:
"1 <= s.length,t.length <= 5 * 10^4",

testCases:[
{
input:'s="anagram", t="nagaram"',
output:"true"
},
{
input:'s="rat", t="car"',
output:"false"
}
],

hints:[
"Count character frequencies.",
"Compare frequency arrays.",
"O(n) solution."
],

referenceCode:[
{
language:"cpp",
code:`bool isAnagram(string s,string t){
if(s.size()!=t.size()) return false;
vector<int> cnt(26,0);
for(char c:s) cnt[c-'a']++;
for(char c:t){
cnt[c-'a']--;
if(cnt[c-'a']<0) return false;
}
return true;
}`
}
]
},

{
title:"Group Anagrams",

description:
"Group the strings that are anagrams of each other.",

constraints:
"1 <= strs.length <= 10^4",

testCases:[
{
input:'["eat","tea","tan","ate","nat","bat"]',
output:'[["eat","tea","ate"],["tan","nat"],["bat"]]'
}
],

hints:[
"Sort every string.",
"Sorted string becomes key.",
"Use HashMap."
],

referenceCode:[
{
language:"cpp",
code:`vector<vector<string>> groupAnagrams(vector<string>& strs){
unordered_map<string,vector<string>> mp;
for(string s:strs){
string key=s;
sort(key.begin(),key.end());
mp[key].push_back(s);
}
vector<vector<string>> ans;
for(auto &it:mp) ans.push_back(it.second);
return ans;
}`
}
]
},

{
title:"Two Sum II",

description:
"Given a sorted array, return the indices of two numbers that add up to target.",

constraints:
"Array is sorted in non-decreasing order.",

testCases:[
{
input:"numbers=[2,7,11,15], target=9",
output:"[1,2]"
}
],

hints:[
"Use two pointers.",
"Move left/right pointer.",
"O(n)."
],

referenceCode:[
{
language:"cpp",
code:`vector<int> twoSum(vector<int>& numbers,int target){
int l=0,r=numbers.size()-1;
while(l<r){
int sum=numbers[l]+numbers[r];
if(sum==target) return {l+1,r+1};
if(sum<target) l++;
else r--;
}
return {};
}`
}
]
},

{
title:"3Sum",

description:
"Return all unique triplets that sum to zero.",

constraints:
"3 <= nums.length <= 3000",

testCases:[
{
input:"[-1,0,1,2,-1,-4]",
output:"[[-1,-1,2],[-1,0,1]]"
}
],

hints:[
"Sort first.",
"Fix one element.",
"Use two pointers."
],

referenceCode:[
{
language:"cpp",
code:`vector<vector<int>> threeSum(vector<int>& nums){
sort(nums.begin(),nums.end());
vector<vector<int>> ans;
for(int i=0;i<nums.size();i++){
if(i&&nums[i]==nums[i-1]) continue;
int l=i+1,r=nums.size()-1;
while(l<r){
int sum=nums[i]+nums[l]+nums[r];
if(sum==0){
ans.push_back({nums[i],nums[l],nums[r]});
l++;r--;
while(l<r&&nums[l]==nums[l-1]) l++;
while(l<r&&nums[r]==nums[r+1]) r--;
}
else if(sum<0) l++;
else r--;
}
}
return ans;
}`
}
]
},

{
title:"Container With Most Water",

description:
"Find two lines that together with the x-axis form a container containing the most water.",

constraints:
"2 <= height.length <= 10^5",

testCases:[
{
input:"[1,8,6,2,5,4,8,3,7]",
output:"49"
}
],

hints:[
"Two pointers.",
"Move smaller height.",
"Track maximum area."
],

referenceCode:[
{
language:"cpp",
code:`int maxArea(vector<int>& h){
int l=0,r=h.size()-1,ans=0;
while(l<r){
ans=max(ans,min(h[l],h[r])*(r-l));
if(h[l]<h[r]) l++;
else r--;
}
return ans;
}`
}
]
},

{
title:"Longest Substring Without Repeating Characters",

description:
"Return the length of the longest substring without repeating characters.",

constraints:
"0 <= s.length <= 5 * 10^4",

testCases:[
{
input:'"abcabcbb"',
output:"3"
},
{
input:'"bbbbb"',
output:"1"
}
],

hints:[
"Sliding Window.",
"HashMap of last index.",
"Expand and shrink."
],

referenceCode:[
{
language:"cpp",
code:`int lengthOfLongestSubstring(string s){
unordered_map<char,int> mp;
int left=0,ans=0;
for(int right=0;right<s.size();right++){
if(mp.count(s[right]))
left=max(left,mp[s[right]]+1);
mp[s[right]]=right;
ans=max(ans,right-left+1);
}
return ans;
}`
}
]
},
];

module.exports = questionsData;
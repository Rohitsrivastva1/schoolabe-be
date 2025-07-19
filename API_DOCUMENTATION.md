# DSA API Documentation

## Base URL
```
http://localhost:5000/api/dsa
```

## Authentication
All endpoints require authentication via HTTP-only cookie containing JWT token.

---

## 1. Categories

### Get All Categories
**GET** `/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Arrays",
    "description": "Master array manipulation, searching, and sorting algorithms",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Strings",
    "description": "Learn string processing, pattern matching, and text algorithms",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 3,
    "name": "Linked Lists",
    "description": "Understand linked list operations and implementations",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 4,
    "name": "Trees",
    "description": "Explore binary trees, BST, and tree traversal algorithms",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 5,
    "name": "Dynamic Programming",
    "description": "Solve complex problems using dynamic programming techniques",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 6,
    "name": "Graphs",
    "description": "Learn graph algorithms, BFS, DFS, and shortest path problems",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Category by ID
**GET** `/categories/:id`

**Response:**
```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Arrays",
    "description": "Master array manipulation, searching, and sorting algorithms",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create Category (Admin Only)
**POST** `/categories`

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Description of the new category"
}
```

**Response:**
```json
{
  "id": 7,
  "name": "New Category",
  "description": "Description of the new category",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Questions

### Get Questions by Category
**GET** `/questions/category/:categoryId`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Two Sum",
    "description": {
      "problem": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "examples": [
        {
          "input": "nums = [2,7,11,15], target = 9",
          "output": "[0,1]",
          "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      "constraints": [
        "2 <= nums.length <= 104",
        "-109 <= nums[i] <= 109",
        "-109 <= target <= 109"
      ]
    },
    "questionVideoUrl": "https://www.youtube.com/watch?v=demo1",
    "solutionVideoUrl": "https://www.youtube.com/watch?v=demo2",
    "explanation": "Use a hash map to store complements. For each number, check if its complement exists.",
    "DsaCategoryId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Maximum Subarray",
    "description": {
      "problem": "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      "examples": [
        {
          "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          "output": "6",
          "explanation": "The subarray [4,-1,2,1] has the largest sum 6."
        }
      ],
      "constraints": [
        "1 <= nums.length <= 105",
        "-104 <= nums[i] <= 104"
      ]
    },
    "questionVideoUrl": "https://www.youtube.com/watch?v=demo3",
    "solutionVideoUrl": "https://www.youtube.com/watch?v=demo4",
    "explanation": "Use Kadane's algorithm to find the maximum subarray sum.",
    "DsaCategoryId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Question by ID
**GET** `/questions/:id`

**Response:**
```json
{
  "id": 1,
  "title": "Two Sum",
  "description": {
    "problem": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109"
    ]
  },
  "questionVideoUrl": "https://www.youtube.com/watch?v=demo1",
  "solutionVideoUrl": "https://www.youtube.com/watch?v=demo2",
  "explanation": "Use a hash map to store complements. For each number, check if its complement exists.",
  "DsaCategoryId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Create Question (Admin Only)
**POST** `/questions`

**Request Body:**
```json
{
  "title": "New Question",
  "description": {
    "problem": "Problem description here...",
    "examples": [
      {
        "input": "input example",
        "output": "output example",
        "explanation": "explanation here"
      }
    ],
    "constraints": [
      "constraint 1",
      "constraint 2"
    ]
  },
  "questionVideoUrl": "https://youtube.com/watch?v=video1",
  "solutionVideoUrl": "https://youtube.com/watch?v=video2",
  "explanation": "Solution explanation",
  "DsaCategoryId": 1
}
```

---

## 3. Test Cases

### Get Test Cases by Question ID
**GET** `/testcases/question/:questionId`

**Response:**
```json
[
  {
    "id": 1,
    "input": "[2,7,11,15]\n9",
    "expectedOutput": "[0,1]",
    "isPublic": true,
    "questionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "input": "[3,2,4]\n6",
    "expectedOutput": "[1,2]",
    "isPublic": true,
    "questionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 3,
    "input": "[3,3]\n6",
    "expectedOutput": "[0,1]",
    "isPublic": false,
    "questionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Create Test Case (Admin Only)
**POST** `/testcases`

**Request Body:**
```json
{
  "input": "test input",
  "expectedOutput": "expected output",
  "isPublic": true,
  "questionId": 1
}
```

---

## 4. Submissions

### Get Submissions by Question ID
**GET** `/submissions/question/:questionId`

**Response:**
```json
[
  {
    "id": 1,
    "code": "class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int complement = target - nums[i];\n      if (map.containsKey(complement)) {\n        return new int[] { map.get(complement), i };\n      }\n      map.put(nums[i], i);\n    }\n    return new int[0];\n  }\n}",
    "language": "java",
    "output": "All test cases passed!",
    "userId": 1,
    "DsaQuestionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
    "language": "python",
    "output": "All test cases passed!",
    "userId": 2,
    "DsaQuestionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Submit Solution
**POST** `/submissions`

**Request Body:**
```json
{
  "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
  "language": "python",
  "DsaQuestionId": 1
}
```

**Response:**
```json
{
  "id": 3,
  "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
  "language": "python",
  "output": "All test cases passed!",
  "userId": 3,
  "DsaQuestionId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access Denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Question not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## How to Run Seeder

To populate your database with dummy data:

```bash
npm run seed
```

This will create:
- 6 DSA categories (Arrays, Strings, Linked Lists, Trees, Dynamic Programming, Graphs)
- 4 sample questions with rich descriptions
- Multiple test cases for each question
- Sample submissions in different programming languages 
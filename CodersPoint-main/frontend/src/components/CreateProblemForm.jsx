import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Plus,
    Trash2,
    Code2,
    FileText,
    Lightbulb,
    BookOpen,
    CheckCircle2,
    Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    constraints: z.string().min(1, "Constraints are required"),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testcases: z
        .array(
            z.object({
                input: z.string().min(1, "Input is required"),
                output: z.string().min(1, "Output is required"),
            })
        )
        .min(1, "At least one test case is required"),
    examples: z.object({
        JAVASCRIPT: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        PYTHON: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        JAVA: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
        PYTHON: z.string().min(1, "Python code snippet is required"),
        JAVA: z.string().min(1, "Java solution is required"),
    }),
    referenceSolutions: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
        PYTHON: z.string().min(1, "Python solution is required"),
        JAVA: z.string().min(1, "Java solution is required"),
    }),
});

const sampledpData = {
    title: "Climbing Stairs",
    category: "dp", // Dynamic Programming
    description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    constraints: "1 <= n <= 45",
    hints: "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
    editorial:
        "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
    testcases: [
        {
            input: "2",
            output: "2",
        },
        {
            input: "3",
            output: "3",
        },
        {
            input: "4",
            output: "5",
        },
    ],
    examples: {
        JAVASCRIPT: {
            input: "n = 2",
            output: "2",
            explanation:
                "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
        },
        PYTHON: {
            input: "n = 3",
            output: "3",
            explanation:
                "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
        },
        JAVA: {
            input: "n = 4",
            output: "5",
            explanation:
                "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    },
};

// Sample problem data for another type of question
const sampleStringProblem = {
    title: "Valid Palindrome",
    description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints:
        "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
    hints: "Consider using two pointers, one from the start and one from the end, moving towards the center.",
    editorial:
        "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
    testcases: [
        {
            input: "A man, a plan, a canal: Panama",
            output: "true",
        },
        {
            input: "race a car",
            output: "false",
        },
        {
            input: "helleh",
            output: "true",
        },
    ],
    examples: {
        JAVASCRIPT: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        PYTHON: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        JAVA: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
        PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
        JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
    },
    referenceSolutions: {
        JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
        PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
        JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
    },
};

const CreateProblemForm = () => {
    const [sampleType, setSampleType] = useState("DP");
    const navigation = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            testcases: [{ input: "", output: "" }],
            tags: [""],
            examples: {
                JAVASCRIPT: { input: "", output: "", explanation: "" },
                PYTHON: { input: "", output: "", explanation: "" },
                JAVA: { input: "", output: "", explanation: "" },
            },
            codeSnippets: {
                JAVASCRIPT:
                    "function solution() {\n  // Write your code here\n}",
                PYTHON: "def solution():\n    # Write your code here\n    pass",
                JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
            },
            referenceSolutions: {
                JAVASCRIPT: "// Add your reference solution here",
                PYTHON: "# Add your reference solution here",
                JAVA: "// Add your reference solution here",
            },
        },
    });

    const {
        fields: testCaseFields,
        append: appendTestCase,
        remove: removeTestCase,
        replace: replacetestcases,
    } = useFieldArray({
        control,
        name: "testcases",
    });

    const {
        fields: tagFields,
        append: appendTag,
        remove: removeTag,
        replace: replaceTags,
    } = useFieldArray({
        control,
        name: "tags",
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (value) => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.post(
                "/problems/create-problem",
                value
            );
            console.log(res.data);
            toast.success(res.data.message || "Problem Created successfully⚡");
            navigation("/");
        } catch (error) {
            console.log(error);
            toast.error("Error creating problem");
        } finally {
            setIsLoading(false);
        }
    };

    const loadSampleData = () => {
        const sampleData =
            sampleType === "DP" ? sampledpData : sampleStringProblem;

        replaceTags(sampleData.tags.map((tag) => tag));
        replacetestcases(sampleData.testcases.map((tc) => tc));

        // Reset the form with sample data
        reset(sampleData);
    };

    const inputClass =
        "input w-full rounded-xl border-white/10 bg-base-300/40 focus:border-primary focus:outline-none";
    const textareaClass =
        "textarea w-full resize-y rounded-xl border-white/10 bg-base-300/40 p-3 focus:border-primary focus:outline-none";
    const selectClass =
        "select w-full rounded-xl border-white/10 bg-base-300/40 focus:border-primary focus:outline-none";
    const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";
    const errorClass = "mt-1.5 block text-sm text-error";
    const sectionClass = "glass-panel rounded-2xl p-5 md:p-6";
    const subCardClass =
        "rounded-xl border border-white/5 bg-base-100/40 p-4 md:p-6";
    const sectionHeadingClass =
        "font-display mb-4 flex items-center gap-2 text-lg font-bold text-base-content md:mb-6 md:text-xl";

    return (
        <div className="animate-fade-in-up">
            <div className="glass-panel rounded-2xl p-6 md:p-8">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:mb-8 md:flex-row md:items-center">
                    <h2 className="font-display flex items-center gap-3 text-2xl font-bold text-base-content md:text-3xl">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-content shadow-md shadow-primary/30">
                            <FileText className="h-5 w-5 md:h-6 md:w-6" />
                        </span>
                        Create Problem
                    </h2>

                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="join overflow-hidden rounded-xl">
                            <button
                                type="button"
                                className={`btn join-item rounded-none border-white/10 ${
                                    sampleType === "DP" ? "btn-primary" : "btn-ghost"
                                }`}
                                onClick={() => setSampleType("array")}
                            >
                                DP Problem
                            </button>
                            <button
                                type="button"
                                className={`btn join-item rounded-none border-white/10 ${
                                    sampleType === "string"
                                        ? "btn-primary"
                                        : "btn-ghost"
                                }`}
                                onClick={() => setSampleType("string")}
                            >
                                String Problem
                            </button>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary gap-2 rounded-xl"
                            onClick={loadSampleData}
                        >
                            <Download className="h-4 w-4" />
                            Load Sample
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Title</label>
                            <input
                                type="text"
                                className={`${inputClass} text-base md:text-lg`}
                                {...register("title")}
                                placeholder="Enter problem title"
                            />
                            {errors.title && (
                                <span className={errorClass}>
                                    {errors.title.message}
                                </span>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Description</label>
                            <textarea
                                className={`${textareaClass} min-h-32 text-base md:text-lg`}
                                {...register("description")}
                                placeholder="Enter problem description"
                            />
                            {errors.description && (
                                <span className={errorClass}>
                                    {errors.description.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Difficulty</label>
                            <select
                                className={`${selectClass} text-base md:text-lg`}
                                {...register("difficulty")}
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                            {errors.difficulty && (
                                <span className={errorClass}>
                                    {errors.difficulty.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className={sectionClass}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className={sectionHeadingClass.replace("mb-4 md:mb-6", "mb-0")}>
                                <BookOpen className="h-5 w-5 text-secondary" />
                                Tags
                            </h3>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-xl"
                                onClick={() => appendTag("")}
                            >
                                <Plus className="h-4 w-4" /> Add Tag
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {tagFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        className={`${inputClass} flex-1`}
                                        {...register(`tags.${index}`)}
                                        placeholder="Enter tag"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-square btn-sm rounded-xl"
                                        onClick={() => removeTag(index)}
                                        disabled={tagFields.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4 text-error" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.tags && (
                            <span className={`${errorClass} block`}>
                                {errors.tags.message}
                            </span>
                        )}
                    </div>

                    {/* Test Cases */}
                    <div className={sectionClass}>
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className={sectionHeadingClass.replace("mb-4 md:mb-6", "mb-0")}>
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                Test Cases
                            </h3>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-xl"
                                onClick={() =>
                                    appendTestCase({
                                        input: "",
                                        output: "",
                                    })
                                }
                            >
                                <Plus className="h-4 w-4" /> Add Test Case
                            </button>
                        </div>
                        <div className="space-y-4">
                            {testCaseFields.map((field, index) => (
                                <div key={field.id} className={subCardClass}>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="font-display text-base font-semibold text-base-content md:text-lg">
                                            Test Case #{index + 1}
                                        </h4>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm rounded-xl text-error"
                                            onClick={() => removeTestCase(index)}
                                            disabled={testCaseFields.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                        <div>
                                            <label className={labelClass}>Input</label>
                                            <textarea
                                                className={`${textareaClass} min-h-24`}
                                                {...register(
                                                    `testcases.${index}.input`
                                                )}
                                                placeholder="Enter test case input"
                                            />
                                            {errors.testcases?.[index]?.input && (
                                                <span className={errorClass}>
                                                    {
                                                        errors.testcases[index]
                                                            .input.message
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label className={labelClass}>
                                                Expected Output
                                            </label>
                                            <textarea
                                                className={`${textareaClass} min-h-24`}
                                                {...register(
                                                    `testcases.${index}.output`
                                                )}
                                                placeholder="Enter expected output"
                                            />
                                            {errors.testcases?.[index]?.output && (
                                                <span className={errorClass}>
                                                    {
                                                        errors.testcases[index]
                                                            .output.message
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.testcases && !Array.isArray(errors.testcases) && (
                            <span className={`${errorClass} block`}>
                                {errors.testcases.message}
                            </span>
                        )}
                    </div>

                    {/* Code Editor Sections */}
                    <div className="space-y-6 md:space-y-8">
                        {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                            <div key={language} className={sectionClass}>
                                <h3 className={sectionHeadingClass}>
                                    <Code2 className="h-5 w-5 text-primary" />
                                    {language}
                                </h3>

                                <div className="space-y-4 md:space-y-6">
                                    {/* Starter Code */}
                                    <div className={subCardClass}>
                                        <h4 className="mb-4 text-base font-semibold text-base-content md:text-lg">
                                            Starter Code Template
                                        </h4>
                                        <div className="overflow-hidden rounded-xl border border-white/10">
                                            <Controller
                                                name={`codeSnippets.${language}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Editor
                                                        height="300px"
                                                        language={language.toLowerCase()}
                                                        theme="vs-dark"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        options={{
                                                            minimap: {
                                                                enabled: false,
                                                            },
                                                            fontSize: 14,
                                                            lineNumbers: "on",
                                                            roundedSelection: false,
                                                            scrollBeyondLastLine: false,
                                                            automaticLayout: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors.codeSnippets?.[language] && (
                                            <span className={`${errorClass} block`}>
                                                {errors.codeSnippets[language].message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Reference Solution */}
                                    <div className={subCardClass}>
                                        <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-base-content md:text-lg">
                                            <CheckCircle2 className="h-5 w-5 text-success" />
                                            Reference Solution
                                        </h4>
                                        <div className="overflow-hidden rounded-xl border border-white/10">
                                            <Controller
                                                name={`referenceSolutions.${language}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Editor
                                                        height="300px"
                                                        language={language.toLowerCase()}
                                                        theme="vs-dark"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        options={{
                                                            minimap: {
                                                                enabled: false,
                                                            },
                                                            fontSize: 14,
                                                            lineNumbers: "on",
                                                            roundedSelection: false,
                                                            scrollBeyondLastLine: false,
                                                            automaticLayout: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors.referenceSolutions?.[language] && (
                                            <span className={`${errorClass} block`}>
                                                {
                                                    errors.referenceSolutions[language]
                                                        .message
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* Examples */}
                                    <div className={subCardClass}>
                                        <h4 className="mb-4 text-base font-semibold text-base-content md:text-lg">
                                            Example
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                            <div>
                                                <label className={labelClass}>Input</label>
                                                <textarea
                                                    className={`${textareaClass} min-h-20`}
                                                    {...register(
                                                        `examples.${language}.input`
                                                    )}
                                                    placeholder="Example input"
                                                />
                                                {errors.examples?.[language]?.input && (
                                                    <span className={errorClass}>
                                                        {
                                                            errors.examples[language]
                                                                .input.message
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <label className={labelClass}>Output</label>
                                                <textarea
                                                    className={`${textareaClass} min-h-20`}
                                                    {...register(
                                                        `examples.${language}.output`
                                                    )}
                                                    placeholder="Example output"
                                                />
                                                {errors.examples?.[language]?.output && (
                                                    <span className={errorClass}>
                                                        {
                                                            errors.examples[language]
                                                                .output.message
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelClass}>
                                                    Explanation
                                                </label>
                                                <textarea
                                                    className={`${textareaClass} min-h-24`}
                                                    {...register(
                                                        `examples.${language}.explanation`
                                                    )}
                                                    placeholder="Explain the example"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Information */}
                    <div className={sectionClass}>
                        <h3 className={sectionHeadingClass}>
                            <Lightbulb className="h-5 w-5 text-warning" />
                            Additional Information
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Constraints</label>
                                <textarea
                                    className={`${textareaClass} min-h-24`}
                                    {...register("constraints")}
                                    placeholder="Enter problem constraints"
                                />
                                {errors.constraints && (
                                    <span className={errorClass}>
                                        {errors.constraints.message}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>Hints (Optional)</label>
                                <textarea
                                    className={`${textareaClass} min-h-24`}
                                    {...register("hints")}
                                    placeholder="Enter hints for solving the problem"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Editorial (Optional)
                                </label>
                                <textarea
                                    className={`${textareaClass} min-h-32`}
                                    {...register("editorial")}
                                    placeholder="Enter problem editorial/solution explanation"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-white/5 pt-6">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg glow-primary gap-2 rounded-xl"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5" />
                                    Create Problem
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProblemForm;

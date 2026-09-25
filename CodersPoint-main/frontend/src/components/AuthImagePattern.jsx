import { Code, Terminal, FileCode, Braces } from "lucide-react";
import { useEffect, useState } from "react";

const CodeBackground = ({ title, subtitle }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Code snippets to display in the background
    const codeSnippets = [
        `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
        `function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };

  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) return false;
    }
  }

  return stack.length === 0;
}`,
    ];

    // Rotate through code snippets
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [codeSnippets.length]);

    return (
        <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-base-300 p-12 text-base-content lg:flex">
            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
            <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-[100px]" />

            {/* Floating code symbols */}
            <div className="absolute inset-0 opacity-[0.08]">
                <div className="absolute left-[15%] top-[10%] animate-pulse">
                    <Braces size={40} />
                </div>
                <div className="absolute left-[80%] top-[30%] animate-pulse delay-300">
                    <FileCode size={50} />
                </div>
                <div className="absolute left-[20%] top-[70%] animate-pulse delay-700">
                    <Terminal size={45} />
                </div>
                <div className="absolute left-[75%] top-[60%] animate-pulse delay-500">
                    <Code size={55} />
                </div>
                <div className="absolute left-[45%] top-[85%] animate-pulse delay-200">
                    <Braces size={35} />
                </div>
                <div className="absolute left-[60%] top-[15%] animate-pulse delay-100">
                    <Terminal size={30} />
                </div>
            </div>

            <div className="z-10 flex max-w-md flex-col items-center">
                {/* Code editor mockup */}
                <div className="mb-8 w-full overflow-hidden rounded-2xl border border-white/5 bg-base-100 shadow-2xl shadow-black/40">
                    {/* Editor header */}
                    <div className="flex items-center bg-base-200 px-4 py-3">
                        <div className="mr-4 flex space-x-2">
                            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="font-mono text-xs opacity-60">
                            problem.js
                        </div>
                    </div>

                    {/* Code content */}
                    <div className="relative h-64 overflow-hidden p-4 font-mono text-xs sm:text-sm">
                        <pre className="whitespace-pre-wrap text-secondary transition-opacity duration-1000">
                            {codeSnippets[activeIndex]}
                        </pre>

                        {/* Blinking cursor */}
                        <div className="animate-blink absolute bottom-4 right-4 h-4 w-2 bg-base-content"></div>
                    </div>
                </div>

                {/* Logo */}
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                        <Code className="h-6 w-6 text-primary-content" />
                    </div>
                </div>

                {/* Text content */}
                <h2 className="font-display mb-4 text-center text-2xl font-bold">
                    {title}
                </h2>
                <p className="text-center text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
};

export default CodeBackground;

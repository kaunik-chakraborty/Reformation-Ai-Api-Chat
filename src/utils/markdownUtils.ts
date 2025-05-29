/**
 * Utility functions for processing markdown content, especially code blocks
 */

/**
 * Process message content to ensure proper code block formatting
 * @param content The original content to process
 * @param isUserMessage Whether the message is from the user
 * @returns Processed content with fixed code blocks
 */
export const processMessageContent = (content: string, isUserMessage: boolean): string => {
  // If the message is from the user, just return it as is
  if (isUserMessage) return content;
  
  let processedContent = content;
  
  // Sometimes AI responses have incomplete code blocks or issues with code block formatting
  // Check if there are uneven numbers of code block markers
  const codeBlockMatches = content.match(/```/g);
  const codeBlockMarkers = codeBlockMatches ? codeBlockMatches.length : 0;
  if (codeBlockMarkers > 0 && codeBlockMarkers % 2 !== 0) {
    // Add a closing code block marker if there's an uneven number
    processedContent = processedContent + "\n```";
    console.log("Fixed unbalanced code blocks in message");
  }
  
  // Handle cases where model might return "Code Example: ..." without proper markdown
  const codePatterns = [
    "Code Example:",
    "Here is",
    "Here's",
    "Python code",
    "JavaScript code",
    "TypeScript code",
    "Java code",
    "C\\+\\+ code",  // Escape the + characters
    "Ruby code",
    "Go code"
  ];
  
  const containsCodeIndicator = codePatterns.some(pattern => processedContent.includes(pattern));
  
  if (containsCodeIndicator && !processedContent.includes("```")) {
    // Try to find where the code starts and wrap it in code blocks
    const escapedPatterns = codePatterns.map(pattern => 
      pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const patternRegex = new RegExp(escapedPatterns.join('|'), 'i');
    const parts = processedContent.split(patternRegex);
    
    if (parts.length > 1) {
      processedContent = `${parts[0]}\n\n\`\`\`\n${parts[1].trim()}\n\`\`\``;
      console.log("Added code block formatting to code section");
    }
  }
  
  return processedContent;
};

/**
 * Extract language from code fence if available
 * @param codeBlock The code block with potential language declaration
 * @returns The language identifier or undefined
 */
export const extractLanguage = (codeBlock: string): string | undefined => {
  // Look for ```language format
  const match = codeBlock.match(/^```([a-zA-Z0-9_-]+)/);
  return match ? match[1] : undefined;
};

/**
 * Strip language declaration and code fences from a code block
 * @param codeBlock The code block with fences
 * @returns The clean code content without fences
 */
export const stripCodeFences = (codeBlock: string): string => {
  // Remove opening fence (```language or just ```)
  let cleaned = codeBlock.replace(/^```[a-zA-Z0-9_-]*\s*\n/, '');
  // Remove closing fence
  cleaned = cleaned.replace(/\n```\s*$/, '');
  return cleaned;
}; 
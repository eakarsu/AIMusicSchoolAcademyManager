import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaRobot, FaCopy, FaRedo, FaCheck } from 'react-icons/fa';

export default function AIOutput({ content, timestamp, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Parse content - handle string, object with content field, or raw object
  const getDisplayContent = () => {
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object') {
      // Look for common content fields
      if (content.content) return content.content;
      if (content.plan) return content.plan;
      if (content.report) return content.report;
      if (content.program) return content.program;
      if (content.assessment) return content.assessment;
      if (content.lesson_plan) return content.lesson_plan;
      if (content.campaign) return content.campaign;
      if (content.result) return content.result;
      if (content.data) {
        if (typeof content.data === 'string') return content.data;
        return JSON.stringify(content.data, null, 2);
      }
      // Convert object to readable markdown
      return objectToMarkdown(content);
    }
    return String(content);
  };

  const objectToMarkdown = (obj, depth = 0) => {
    let md = '';
    for (const [key, value] of Object.entries(obj)) {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        md += `${'#'.repeat(Math.min(depth + 2, 4))} ${label}\n\n`;
        md += objectToMarkdown(value, depth + 1);
      } else if (Array.isArray(value)) {
        md += `**${label}:**\n\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            md += objectToMarkdown(item, depth + 1);
            md += '\n---\n\n';
          } else {
            md += `- ${item}\n`;
          }
        });
        md += '\n';
      } else {
        md += `**${label}:** ${value}\n\n`;
      }
    }
    return md;
  };

  const displayContent = getDisplayContent();

  return (
    <div className="ai-output-card">
      <div className="ai-output-header">
        <h3><FaRobot /> AI Generated Content</h3>
        <div className="ai-output-actions">
          <button onClick={handleCopy}>
            {copied ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
          </button>
          {onRegenerate && (
            <button onClick={onRegenerate}>
              <FaRedo /> Regenerate
            </button>
          )}
        </div>
      </div>
      <div className="ai-output-body">
        <ReactMarkdown>{displayContent}</ReactMarkdown>
      </div>
      {timestamp && (
        <div className="ai-output-timestamp">
          Generated on {new Date(timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
}

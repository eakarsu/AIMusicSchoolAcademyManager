import React from 'react';
import AIReport from './AIReport';

export default function AIOutput({ content, timestamp, onRegenerate }) {
  return (
    <AIReport
      response={content}
      title="AI generated result"
      eyebrow="Generated AI result"
      timestamp={timestamp}
      onRegenerate={onRegenerate}
    />
  );
}

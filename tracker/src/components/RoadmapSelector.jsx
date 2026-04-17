import React from 'react';

export default function RoadmapSelector({ meta }) {
  return (
    <div className="roadmap-selector">
      <span>roadmap://</span>
      <select defaultValue={meta.id} aria-label="Select roadmap">
        <option value={meta.id}>{meta.title}</option>
      </select>
    </div>
  );
}

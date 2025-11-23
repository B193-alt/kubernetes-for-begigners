import React from 'react';

export interface Pod {
  id: string;
  name: string;
  status: 'Running' | 'Pending' | 'Crashed';
  color: string;
}

export interface Node {
  id: string;
  name: string;
  capacity: number;
  pods: Pod[];
  status: 'Ready' | 'NotReady';
}

export interface Concept {
  id: string;
  title: string;
  analogy: string; // The "Layman" term
  description: string;
  icon: React.ReactNode;
  visualAction?: string; // Action trigger for the visualizer
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
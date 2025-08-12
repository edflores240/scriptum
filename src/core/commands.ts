// src/core/commands.ts
import { EditorView } from 'prosemirror-view';
import { createSchema } from './schema';

export interface EditorCommand {
  id: string;
  label: string;
  description?: string;
  category: string;
  action: (view: EditorView) => void;
}

export const createCommands = (): EditorCommand[] => [
  // Command definitions...
];
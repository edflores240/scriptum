import { EditorView } from "prosemirror-view";

export interface EditorCommand {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  category: 'text' | 'list' | 'media' | 'embed' | 'separator' | 'advanced';
  action: (view: EditorView) => void;
}

export interface AddToolbarProps {
  onCommand: (command: EditorCommand) => void;
  isVisible: boolean;
  onClose: () => void;
  editorView: EditorView | null;
}

export interface SlashCommandProps {
  query: string;
  position: { x: number; y: number };
  onCommand: (command: EditorCommand) => void;
  onClose: () => void;
  editorView: EditorView | null;
}

export interface FloatingToolbarProps {
  isVisible: boolean;
  position: { x: number; y: number };
  editorView: EditorView | null;
}

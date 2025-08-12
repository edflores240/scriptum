import React, { useEffect, useRef, useState, useCallback } from "react";
import { EditorState, Transaction, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { 
  Plus, 
  Type, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Hash,
  Minus,
  MoreHorizontal,
  Table,
  ChevronRight,
  Quote,
  AtSign,
  Eraser,
  Monitor,
  Image,
  Video,
  Link,
  BarChart3,
  FileText,
  Download,
  Upload,
  Search,
  Bold,
  Italic,
  Underline,
  Code,
  X,
  Moon,
  Sun,
  GripVertical,
  Palette
} from 'lucide-react';

// Extend schema to include list nodes and additional features
const scriptumSchema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
  marks: basicSchema.spec.marks,
});

// Theme context
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// Types for editor functionality
interface EditorCommand {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  category: 'text' | 'list' | 'media' | 'embed' | 'separator' | 'advanced';
  action: (view: EditorView) => void;
}

interface AddToolbarProps {
  onCommand: (command: EditorCommand) => void;
  isVisible: boolean;
  onClose: () => void;
  editorView: EditorView | null;
}

interface SlashCommandProps {
  query: string;
  position: { x: number; y: number };
  onCommand: (command: EditorCommand) => void;
  onClose: () => void;
  editorView: EditorView | null;
}

interface FloatingToolbarProps {
  isVisible: boolean;
  position: { x: number; y: number };
  editorView: EditorView | null;
}

// Command implementations
const createCommands = (): EditorCommand[] => [
  // Text & Headers
  {
    id: 'heading1',
    label: 'Heading 1',
    icon: <Type className="icon" />,
    description: 'Large section heading',
    category: 'text',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from, $to } = selection;
      
      // Check if we're in a paragraph or can replace with heading
      if ($from.parent.type === scriptumSchema.nodes.paragraph || 
          $from.parent.type === scriptumSchema.nodes.heading) {
        const start = $from.start();
        const end = $to.end();
        const heading = scriptumSchema.nodes.heading.create(
          { level: 1 }, 
          $from.parent.content
        );
        
        dispatch(tr.replaceWith(start, end, heading).scrollIntoView());
      } else {
        // Insert new heading if not in replaceable content
        const heading = scriptumSchema.nodes.heading.create({ level: 1 });
        dispatch(tr.replaceSelectionWith(heading).scrollIntoView());
      }
    }
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    icon: <Type className="icon" />,
    description: 'Medium section heading',
    category: 'text',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from, $to } = selection;
      
      if ($from.parent.type === scriptumSchema.nodes.paragraph || 
          $from.parent.type === scriptumSchema.nodes.heading) {
        const start = $from.start();
        const end = $to.end();
        const heading = scriptumSchema.nodes.heading.create(
          { level: 2 }, 
          $from.parent.content
        );
        
        dispatch(tr.replaceWith(start, end, heading).scrollIntoView());
      } else {
        const heading = scriptumSchema.nodes.heading.create({ level: 2 });
        dispatch(tr.replaceSelectionWith(heading).scrollIntoView());
      }
    }
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    icon: <Type className="icon" />,
    description: 'Small section heading',
    category: 'text',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from, $to } = selection;
      
      if ($from.parent.type === scriptumSchema.nodes.paragraph || 
          $from.parent.type === scriptumSchema.nodes.heading) {
        const start = $from.start();
        const end = $to.end();
        const heading = scriptumSchema.nodes.heading.create(
          { level: 3 }, 
          $from.parent.content
        );
        
        dispatch(tr.replaceWith(start, end, heading).scrollIntoView());
      } else {
        const heading = scriptumSchema.nodes.heading.create({ level: 3 });
        dispatch(tr.replaceSelectionWith(heading).scrollIntoView());
      }
    }
  },
  
  // Lists
  {
    id: 'bullet',
    label: 'Bullet List',
    icon: <List className="icon" />,
    description: 'Create a bullet point list',
    category: 'list',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from } = selection;
      
      // Create a list item with an empty paragraph
      const listItem = scriptumSchema.nodes.list_item.create(
        null, 
        scriptumSchema.nodes.paragraph.create()
      );
      const bulletList = scriptumSchema.nodes.bullet_list.create(null, [listItem]);
      
      // If we're in a paragraph, replace it; otherwise insert
      if ($from.parent.type === scriptumSchema.nodes.paragraph && $from.parent.textContent === '') {
        const start = $from.start();
        const end = $from.end();
        dispatch(tr.replaceWith(start, end, bulletList).scrollIntoView());
      } else {
        dispatch(tr.replaceSelectionWith(bulletList).scrollIntoView());
      }
    }
  },
  {
    id: 'numbered',
    label: 'Numbered List',
    icon: <ListOrdered className="icon" />,
    description: 'Create a numbered list',
    category: 'list',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from } = selection;
      
      const listItem = scriptumSchema.nodes.list_item.create(
        null, 
        scriptumSchema.nodes.paragraph.create()
      );
      const orderedList = scriptumSchema.nodes.ordered_list.create(null, [listItem]);
      
      if ($from.parent.type === scriptumSchema.nodes.paragraph && $from.parent.textContent === '') {
        const start = $from.start();
        const end = $from.end();
        dispatch(tr.replaceWith(start, end, orderedList).scrollIntoView());
      } else {
        dispatch(tr.replaceSelectionWith(orderedList).scrollIntoView());
      }
    }
  },
  {
    id: 'checklist',
    label: 'To-do List',
    icon: <CheckSquare className="icon" />,
    description: 'Create a task checklist',
    category: 'list',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from } = selection;
      
      // For now, create a bullet list (task list would need custom schema)
      const listItem = scriptumSchema.nodes.list_item.create(
        null, 
        scriptumSchema.nodes.paragraph.create(null, scriptumSchema.text('☐ '))
      );
      const bulletList = scriptumSchema.nodes.bullet_list.create(null, [listItem]);
      
      if ($from.parent.type === scriptumSchema.nodes.paragraph && $from.parent.textContent === '') {
        const start = $from.start();
        const end = $from.end();
        dispatch(tr.replaceWith(start, end, bulletList).scrollIntoView());
      } else {
        dispatch(tr.replaceSelectionWith(bulletList).scrollIntoView());
      }
    }
  },
  
  // Text Formatting
  {
    id: 'quote',
    label: 'Quote',
    icon: <Quote className="icon" />,
    description: 'Create a quote block',
    category: 'text',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from, $to } = selection;
      
      if ($from.parent.type === scriptumSchema.nodes.paragraph) {
        const start = $from.start();
        const end = $to.end();
        const quote = scriptumSchema.nodes.blockquote.create(
          null, 
          scriptumSchema.nodes.paragraph.create(null, $from.parent.content)
        );
        dispatch(tr.replaceWith(start, end, quote).scrollIntoView());
      } else {
        const quote = scriptumSchema.nodes.blockquote.create(
          null, 
          scriptumSchema.nodes.paragraph.create()
        );
        dispatch(tr.replaceSelectionWith(quote).scrollIntoView());
      }
    }
  },
  {
    id: 'code-block',
    label: 'Code',
    icon: <Code className="icon" />,
    description: 'Insert a code block',
    category: 'text',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { selection, tr } = state;
      const { $from } = selection;
      
      const codeBlock = scriptumSchema.nodes.code_block.create();
      
      if ($from.parent.type === scriptumSchema.nodes.paragraph && $from.parent.textContent === '') {
        const start = $from.start();
        const end = $from.end();
        dispatch(tr.replaceWith(start, end, codeBlock).scrollIntoView());
      } else {
        dispatch(tr.replaceSelectionWith(codeBlock).scrollIntoView());
      }
    }
  },
  
  // Separators
  {
    id: 'divider',
    label: 'Divider',
    icon: <Minus className="icon" />,
    description: 'Add a divider line',
    category: 'separator',
    action: (view: EditorView) => {
      const { state, dispatch } = view;
      const { tr } = state;
      
      const rule = scriptumSchema.nodes.horizontal_rule.create();
      const paragraph = scriptumSchema.nodes.paragraph.create();
      
      // Insert horizontal rule and a new paragraph after it
      const transaction = tr
        .replaceSelectionWith(rule)
        .insert(tr.selection.to, paragraph)
        .setSelection(scriptumSchema.resolve(tr.selection.to - 1))
        .scrollIntoView();
        
      dispatch(transaction);
    }
  },
  
  // Advanced placeholders
  {
    id: 'table',
    label: 'Table',
    icon: <Table className="icon" />,
    description: 'Insert a table',
    category: 'advanced',
    action: (view: EditorView) => {
      console.log('Table insertion - to be implemented');
    }
  },
  {
    id: 'image',
    label: 'Image',
    icon: <Image className="icon" />,
    description: 'Upload an image',
    category: 'media',
    action: (view: EditorView) => {
      console.log('Image insertion - to be implemented');
    }
  },
  {
    id: 'video',
    label: 'Video',
    icon: <Video className="icon" />,
    description: 'Embed a video',
    category: 'media',
    action: (view: EditorView) => {
      console.log('Video insertion - to be implemented');
    }
  }
];

// Slash command detection plugin
const slashCommandPlugin = (onSlashCommand: (query: string, pos: { x: number; y: number }) => void) => {
  return new Plugin({
    key: new PluginKey('slashCommand'),
    state: {
      init: () => ({ active: false, query: '' }),
      apply: (tr: Transaction, value: { active: boolean; query: string }) => {
        const { selection } = tr;
        const { $from } = selection;
        
        if (selection.empty && $from.parent.textContent) {
          const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
          const slashIndex = textBefore.lastIndexOf('/');
          
          if (slashIndex !== -1 && slashIndex === textBefore.length - 1) {
            return { active: true, query: '' };
          } else if (slashIndex !== -1 && value.active) {
            const query = textBefore.slice(slashIndex + 1);
            return { active: true, query };
          }
        }
        
        return { active: false, query: '' };
      }
    },
    view: (view: EditorView) => ({
      update: (view: EditorView, prevState: EditorState) => {
        const pluginState = slashCommandPlugin.getState(view.state);
        const prevPluginState = slashCommandPlugin.getState(prevState);
        
        if (pluginState?.active && !prevPluginState?.active) {
          const coords = view.coordsAtPos(view.state.selection.from);
          onSlashCommand(pluginState.query, { x: coords.left, y: coords.bottom });
        }
      }
    })
  });
};

// Floating Toolbar Component
const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ isVisible, position, editorView }) => {
  if (!isVisible || !editorView) return null;

  const applyMark = (markType: string) => {
    const { state, dispatch } = editorView;
    const { tr, selection } = state;
    const mark = scriptumSchema.marks[markType];
    
    if (mark && !selection.empty) {
      const hasMark = state.doc.rangeHasMark(selection.from, selection.to, mark);
      
      if (hasMark) {
        // Remove the mark if it already exists
        dispatch(tr.removeMark(selection.from, selection.to, mark));
      } else {
        // Add the mark if it doesn't exist
        dispatch(tr.addMark(selection.from, selection.to, mark.create()));
      }
    }
  };

  return (
    <div 
      className="floating-toolbar"
      style={{ 
        left: position.x, 
        top: position.y - 50,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="floating-toolbar__content">
        <button 
          onClick={() => applyMark('strong')}
          className="floating-toolbar__button"
          title="Bold"
        >
          <Bold className="icon" />
        </button>
        <button 
          onClick={() => applyMark('em')}
          className="floating-toolbar__button"
          title="Italic"
        >
          <Italic className="icon" />
        </button>
        <button 
          onClick={() => applyMark('code')}
          className="floating-toolbar__button"
          title="Code"
        >
          <Code className="icon" />
        </button>
        <div className="floating-toolbar__divider" />
        <button 
          onClick={() => console.log('Link - to be implemented')}
          className="floating-toolbar__button"
          title="Link"
        >
          <Link className="icon" />
        </button>
      </div>
    </div>
  );
};

// Add Toolbar Component
const AddToolbar: React.FC<AddToolbarProps> = ({ onCommand, isVisible, onClose, editorView }) => {
  if (!isVisible) return null;

  const commands = createCommands();
  
  const categories = {
    text: 'Text & Formatting',
    list: 'Lists',
    separator: 'Layout',
    media: 'Media',
    advanced: 'Advanced'
  };

  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.category]) acc[command.category] = [];
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, EditorCommand[]>);

  return (
    <div className="add-toolbar">
      <div className="add-toolbar__header">
        <div className="add-toolbar__title">Add content</div>
        <button 
          onClick={onClose}
          className="add-toolbar__close"
          aria-label="Close menu"
        >
          <X className="icon" />
        </button>
      </div>
      
      <div className="add-toolbar__content">
        {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
          <div key={category} className="add-toolbar__section">
            <div className="add-toolbar__section-title">
              {categories[category as keyof typeof categories]}
            </div>
            <div className="add-toolbar__grid">
              {categoryCommands.map((command) => (
                <button
                  key={command.id}
                  onClick={() => {
                    if (editorView) {
                      command.action(editorView);
                    }
                    onCommand(command);
                    onClose();
                  }}
                  className="add-toolbar__item"
                >
                  <div className="add-toolbar__item-icon">
                    {command.icon}
                  </div>
                  <div className="add-toolbar__item-content">
                    <div className="add-toolbar__item-label">{command.label}</div>
                    {command.description && (
                      <div className="add-toolbar__item-description">{command.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Slash Command Menu
const SlashCommandMenu: React.FC<SlashCommandProps> = ({ query, position, onCommand, onClose, editorView }) => {
  const allCommands = createCommands();
  
  const filteredCommands = allCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredCommands.length === 0) return null;

  return (
    <div 
      className="slash-menu"
      style={{ 
        left: position.x, 
        top: position.y + 8
      }}
    >
      <div className="slash-menu__content">
        {filteredCommands.slice(0, 8).map((command, index) => (
          <button
            key={command.id}
            onClick={() => {
              if (editorView) {
                command.action(editorView);
              }
              onCommand(command);
              onClose();
            }}
            className={`slash-menu__item ${index === 0 ? 'slash-menu__item--selected' : ''}`}
          >
            <div className="slash-menu__item-icon">
              {command.icon}
            </div>
            <div className="slash-menu__item-content">
              <div className="slash-menu__item-label">{command.label}</div>
              {command.description && (
                <div className="slash-menu__item-description">{command.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Block Handle Component
const BlockHandle: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="block-handle">
      <GripVertical className="icon" />
    </div>
  );
};

// Main Editor Component
export const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showAddToolbar, setShowAddToolbar] = useState(false);
  const [showSlashCommand, setShowSlashCommand] = useState(false);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPosition, setSlashPosition] = useState({ x: 0, y: 0 });
  const [floatingPosition, setFloatingPosition] = useState({ x: 0, y: 0 });
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  const handleSlashCommand = useCallback((query: string, pos: { x: number; y: number }) => {
    setSlashQuery(query);
    setSlashPosition(pos);
    setShowSlashCommand(true);
    setShowAddToolbar(false);
  }, []);

  const handleCommand = useCallback((command: EditorCommand) => {
    console.log(`Executing command: ${command.label}`);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!editorRef.current) return;
  
    const startingDoc = scriptumSchema.node("doc", null, [
      scriptumSchema.node("paragraph", null, scriptumSchema.text("Start writing your document...")),
    ]);
  
    const state = EditorState.create({
      doc: startingDoc,
      schema: scriptumSchema,
      plugins: [
        history(),
        keymap(baseKeymap),
        slashCommandPlugin(handleSlashCommand)
      ],
    });
  
    const view = new EditorView(editorRef.current, { 
      state,
      handleKeyDown: (view, event) => {
        if (event.key === 'Escape') {
          setShowSlashCommand(false);
          setShowAddToolbar(false);
          setShowFloatingToolbar(false);
          return true;
        }
        return false;
      },
      handleTextInput: (view, from, to, text) => {
        setShowSlashCommand(false);
        return false;
      }
    });
    
    viewRef.current = view;

    // Handle text selection for floating toolbar
    const handleSelectionChange = () => {
      const selection = view.state.selection;
      if (selection.empty) {
        setShowFloatingToolbar(false);
      } else {
        const coords = view.coordsAtPos(selection.from);
        const endCoords = view.coordsAtPos(selection.to);
        setFloatingPosition({ 
          x: (coords.left + endCoords.right) / 2, 
          y: coords.top 
        });
        setShowFloatingToolbar(true);
      }
    };

    view.dom.addEventListener('mouseup', handleSelectionChange);
    view.dom.addEventListener('keyup', handleSelectionChange);
  
    return () => {
      view.dom.removeEventListener('mouseup', handleSelectionChange);
      view.dom.removeEventListener('keyup', handleSelectionChange);
      view.destroy();
    };
  }, [handleSlashCommand]);

  // Handle clicks outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.add-toolbar') && !target.closest('.scriptum-add-button')) {
        setShowAddToolbar(false);
      }
      if (!target.closest('.slash-menu')) {
        setShowSlashCommand(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`scriptum-container theme-${theme}`}>
        {/* Header */}
        <div className="scriptum-header">
          <div className="scriptum-header__content">
            <div className="scriptum-header__left">
              <div className="scriptum-header__title">Untitled Document</div>
              <div className="scriptum-header__breadcrumb">
                <span>My Documents</span>
                <ChevronRight className="icon scriptum-header__separator" />
                <span>Untitled Document</span>
              </div>
            </div>
            <div className="scriptum-header__right">
              <button 
                onClick={toggleTheme}
                className="scriptum-header__theme-toggle"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="icon" /> : <Sun className="icon" />}
              </button>
              <button className="scriptum-header__action">
                <MoreHorizontal className="icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className="scriptum-editor-wrapper">
          <div className="scriptum-editor-container">
            {/* Add Button */}
            <div className="scriptum-add-button-wrapper">
              <button
                onClick={() => setShowAddToolbar(!showAddToolbar)}
                className="scriptum-add-button"
                title="Add content block"
              >
                <Plus className="icon" />
              </button>
              
              <AddToolbar
                isVisible={showAddToolbar}
                onCommand={handleCommand}
                onClose={() => setShowAddToolbar(false)}
                editorView={viewRef.current}
              />
            </div>

            {/* Block Handle */}
            <BlockHandle isVisible={hoveredBlock !== null} />

            {/* Editor Content */}
            <div
              ref={editorRef}
              className="scriptum-editor"
              onMouseEnter={() => setHoveredBlock(0)}
              onMouseLeave={() => setHoveredBlock(null)}
            />
          </div>

          {/* Floating Toolbar */}
          <FloatingToolbar
            isVisible={showFloatingToolbar}
            position={floatingPosition}
            editorView={viewRef.current}
          />

          {/* Slash Command Menu */}
          {showSlashCommand && (
            <SlashCommandMenu
              query={slashQuery}
              position={slashPosition}
              onCommand={handleCommand}
              onClose={() => setShowSlashCommand(false)}
              editorView={viewRef.current}
            />
          )}
        </div>

        {/* Footer */}
        <div className="scriptum-footer">
          <div className="scriptum-footer__left">
            <Search className="icon" />
            <span>Type '/' for commands</span>
          </div>
          <div className="scriptum-footer__right">
            <span>Last edited 2 minutes ago</span>
            <div className="scriptum-footer__separator">•</div>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>

 
    </ThemeContext.Provider>
  );
};
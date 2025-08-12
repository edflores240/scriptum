import { createEditor } from "./core/index";
// import "./styles/editor.css";

export function init(selector: string, content?: string) {
  const el = document.querySelector(selector) as HTMLElement;
  if (!el) throw new Error(`Element ${selector} not found`);
  return createEditor({ element: el, content });
}

// Expose globally
(window as any).ScriptumEditor = { init };

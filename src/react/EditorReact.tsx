import { useEffect, useRef } from "react";
import { createEditor } from "../core/index";

export function EditorReact({ content }: { content?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      createEditor({ element: ref.current, content });
    }
  }, [content]);

  return <div ref={ref} className="scriptum-editor"></div>;
}

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser as PMDOMParser } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";

export interface CoreEditorOptions {
  element: HTMLElement;
  content?: string;
}

export function createEditor({ element, content }: CoreEditorOptions) {
  const state = EditorState.create({
    doc: PMDOMParser.fromSchema(basicSchema).parse(
      new DOMParser().parseFromString(content || "<p></p>", "text/html")
    ),
    plugins: exampleSetup({ schema: basicSchema }),
  });

  return new EditorView(element, { state });
}

// src/core/schema.ts
import { Schema } from 'prosemirror-model';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

export const createSchema = () => {
  return new Schema({
    nodes: addListNodes(baseSchema.spec.nodes, "paragraph block*", "block"),
    marks: baseSchema.spec.marks,
  });
};
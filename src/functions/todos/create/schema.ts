export default {
  type: 'object',
  properties: {
    name: { type: 'string' },
    dueDate: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
} as const;

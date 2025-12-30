import type { FormKitSchemaNode } from '@formkit/core';

export const permissionSchema: FormKitSchemaNode[] = [
  {
    $formkit: 'text',
    name: 'name',
    label: 'Permission',
    placeholder: 'E.g.: view_users',
    validation: 'required|length:3,50',
  },
  {
    $formkit: 'textarea',
    rows: 8,
    name: 'description',
    label: 'Description',
    placeholder: 'A short description for your permission',
    validation: 'length:0,255',
  },
];


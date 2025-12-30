import type { FormKitSchemaNode } from '@formkit/core';

export const departmentSchema: FormKitSchemaNode[] = [
  {
    $formkit: 'text',
    name: 'name',
    label: 'Department Name',
    placeholder: 'E.g.: Human Resources ...',
    validation: 'required|length:3,250',
  },
  {
    $formkit: 'textarea',
    name: 'description',
    label: 'Description',
    rows: 5,
    placeholder: 'A short description for your department',
    validation: 'length:0,255',
  },
];

import type { FormKitSchemaNode } from '@formkit/core';

/**
 * FormKit schema for profile edit form
 * Contains all form fields with validation rules matching Laravel backend validation
 */
export const profileEditSchema: FormKitSchemaNode[] = [
    {
        $formkit: 'date',
        name: 'birth_date',
        label: 'Birth Date',
    },
    {
        $formkit: 'select',
        name: 'gender',
        label: 'Gender',
        options: {
            male: 'Male',
            female: 'Female',
        },
    },
    {
        $formkit: 'tel',
        placeholder: '5432198765',
        name: 'phone',
        label: 'Phone Number',
        validation: 'length:10, 10|digits',
    },
    {
        $formkit: 'password',
        name: 'password',
        label: 'New Password',
        validation: 'length:8',
        help: 'Leave as blank if you do not want to change your password.',
        outerClass: 'half',
    },
    {
        $formkit: 'password',
        name: 'password_confirmation',
        label: 'Password Confirmation',
        validation: 'confirm:password',
        outerClass: 'half',
    },
    {
        $formkit: 'select',
        name: 'tfa',
        label: 'Two Factor Authentication',
        options: {
            1: 'On',
            0: 'Off',
        },
    },
];

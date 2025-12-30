//import { tr } from '@formkit/i18n';
import { generateClasses } from '@formkit/themes';

export const formkitConfig = {
    //locales: { tr },
    //locale: 'tr',
    config: {
        classes: generateClasses({
            global: {
                label: 'text-weight-medium text-primary',
                help: 'text-caption text-grey',
                message: 'text-negative text-caption',
                outer: 'formkit-outer',
            },
            'family:text': {
                input: 'q-pa-sm text-primary bg-grey-2 border-1',
            },
            textarea: {
                input: 'q-pa-sm text-primary bg-grey-2 border-1',
            },
            select: {
                inner: 'bg-grey-2 rounded-borders border-1',
                input: 'q-pa-sm bg-transparent border-none full-width outline-none',
            },
            file: {
                noFiles: 'text-caption text-grey-6',
                fileItem: 'text-primary',
            },
            date: {
                inner: 'bg-grey-2 rounded-borders border-1 flex items-center',
                input: 'q-pa-sm bg-transparent border-none full-width outline-none',
            },
        }),
    },
};
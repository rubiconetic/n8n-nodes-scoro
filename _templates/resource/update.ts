// import type { INodeProperties } from 'n8n-workflow';
// import { requestProperty } from '../../shared/descriptions';

// export const showOnlyFor__Resource_PascalCase__Update = {
//     operation: ['update'],
//     resource: ['__resource_singular__'],
// };

// export const __resource_singular__UpdateDescription: INodeProperties[] = [
//     {
//         displayName: '__Resource_PascalCase__',
//         name: '__resource_singular__Id',
//         type: 'resourceLocator',
//         displayOptions: { show: showOnlyFor__Resource_PascalCase__Update },
//         default: { mode: 'list', value: '' },
//         required: true,
//         modes: [
//             {
//                 displayName: 'From List',
//                 name: 'list',
//                 type: 'list',
//                 placeholder: 'Select a __resource_singular__...',
//                 typeOptions: {
//                     searchListMethod: 'get__Resource_PascalCase_Plural__',
//                     searchable: true,
//                 },
//             },
//             {
//                 displayName: 'By ID',
//                 name: 'id',
//                 type: 'string',
//                 placeholder: 'Enter __Resource_Sentence_Case__ ID',
//                 validation: [
//                     {
//                         type: 'regex',
//                         properties: {
//                             regex: '^[0-9]+$',
//                             errorMessage: '__Resource_Sentence_Case__ ID must be numeric',
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         ...requestProperty,
//         displayOptions: {
//             show: showOnlyFor__Resource_PascalCase__Update,
//         }
//     }
// ];
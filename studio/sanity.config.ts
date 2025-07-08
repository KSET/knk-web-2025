import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import {schemaTypes} from './schemas'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
export const dataset = process.env.SANITY_STUDIO_DATASET!

export default defineConfig({
  name: 'knk-2025',
  title: 'KNK 2025',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({
              type: 'artist',
              title: 'Artists',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'workshop',
              title: 'Workshops',
              S,
              context,
            }),
            ...S.documentTypeListItems().filter((listItem) => {
              const id = listItem.getId()
              return id !== undefined && !['artist', 'workshop'].includes(id)
            }),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})

import {
  convertLexicalToHTML,
  consolidateHTMLConverters,
} from '@payloadcms/richtext-lexical'

import { defaultSanitizedEditorConfig } from '@payloadcms/richtext-lexical' // <= make sure this package is installed

const editorConfig = defaultSanitizedEditorConfig

async function lexicalToHTML(editorData: any) {
  return await convertLexicalToHTML({
    converters: consolidateHTMLConverters({ editorConfig }),
    data: editorData,
  })
}

export default lexicalToHTML
const editor = new EditorJS({
  holder: 'editorjs',
/** 
   * Available Tools list. 
   * Pass Tool's class or Settings object for each Tool you want to use 
   */
 tools:{
     header:Header,
     delimiter: Delimiter,
     paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    embed: Embed,
    image: SimpleImage,
 }
}
);
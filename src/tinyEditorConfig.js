export const tinyEditorConfig = (language, filesLength) => {
  console.log(filesLength)
  return {
    browser_spellcheck: true,
    language,
    font_family_formats:
      "Open Sans=Open Sans, sans-serif; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'",
    content_css: false,
    height: 500,
    automatic_uploads: true,
    file_picker_types: 'image',
    image_title: true,
    menubar: false,
    statusbar: false,
    draggable_modal: true,
    image_advtab: true,
    image_caption: true,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    toolbar_mode: 'sliding',
    contextmenu: 'link image table',
    plugins:
      'importcss searchreplace autolink save directionality ' +
      'code visualblocks visualchars fullscreen image link media template codesample ' +
      'table charmap pagebreak nonbreaking anchor insertdatetime advlist lists ' +
      'wordcount help charmap quickbars emoticons' +
      'autocorrect typography inlinecss powerpaste',
    toolbar:
      'undo redo | blocks fontfamily fontsize | bold italic underline ' +
      'strikethrough backcolor forecolor | link image media table mergetags | ' +
      'addcomment showcomments | spellcheckdialog a11ycheck typography | align ' +
      'lineheight | checklist numlist bullist indent outdent | ' +
      'emoticons charmap | removeformat code',
    quickbars_insert_toolbar: false,
    content_style:
      'p {\n' +
      '      margin: 0 0 10px!important;\n' +
      '    }\n' +
      'img {\n' +
      '    margin-bottom: 12px;\n' +
      '    max-width: 100%;' +
      '    height: auto;' +
      '}\n' +
      'li {\n' +
      '    margin-bottom: 14px;\n' +
      '}' +
      '* {\n' +
      '      color: #262732;\n' +
      '    }' +
      'ul {\n' +
      '    list-style-type: none;\n' +
      '    padding-left: 16px;\n' +
      '    margin-top: 14px;\n' +
      '}\n' +
      'ol {margin-top: 14px; padding-left: 18px}' +
      '\n' +
      'ul:not(ul[style^=list-style-type]) li::before {\n' +
      '    content: "";\n' +
      '    display: inline-block;\n' +
      '    height: 8px;\n' +
      '    width: 8px;\n' +
      '    vertical-align: text-bottom;\n' +
      '    border-radius: 50%;\n' +
      '    background-color: #4acc8e;\n' +
      '    margin: auto 0;\n' +
      '    position: absolute;' +
      '    transform: translate(-16px, 5px);' +
      '}\n' +
      'ul[style*=square] li::before {\n' +
      '    content: ""!important;\n' +
      '    display: inline-block!important;\n' +
      '    height: 8px!important;\n' +
      '    width: 8px!important;\n' +
      '    vertical-align: text-bottom!important;\n' +
      '    border-radius: 0!important;\n' +
      '    background-color: #4acc8e!important;\n' +
      '    margin: auto 0;\n' +
      '    position: absolute;' +
      '    transform: translate(-16px, 5px);' +
      '}\n' +
      'ul[style*=circle] li::before {\n' +
      '    content: ""!important;\n' +
      '    display: inline-block!important;\n' +
      '    height: 8px!important;\n' +
      '    width: 8px!important;\n' +
      '    vertical-align: text-bottom!important;\n' +
      '    border-radius: 50%!important;\n' +
      '    border: 1px solid #4acc8e!important;\n' +
      '    background-color: white!important;\n' +
      '    margin: auto 0;\n' +
      '    position: absolute;' +
      '    transform: translate(-16px, 4px);' +
      '}\n' +
      '\n' +
      'ul li h1, ul li h2, ul li h3, ul li h4, ul li h5, ul li h6, ul li h7, ul li pre, ul li p, ul li * {\n' +
      '    display: inline-block;\n' +
      '}\n' +
      '\n' +
      'li ul, ul li {\n' +
      '    display: block;\n' +
      '}\n' +
      '\n' +
      'img {\n' +
      '    padding: 0 10px 0 0;\n' +
      '    // float: left;' +
      '}\n' +
      'p[style*=center] img {' +
      '    float: unset;' +
      '}' +
      'p[style*=center] img {' +
      '    float: unset;' +
      '}' +
      '\n' +
      'img[style^=margin] {\n' +
      '    float: unset;\n' +
      '}\n' +
      'img[style*=right] {' +
      '    padding: 0 0 0 10px;' +
      '}' +
      'img[style^=display] {' +
      '    float: unset;' +
      '}' +
      '\n' +
      'ul:not(ul[style^=list-style-type]) li li::before {\n' +
      '    content: "";\n' +
      '    display: inline-block;\n' +
      '    height: 8px;\n' +
      '    width: 8px;\n' +
      '    vertical-align: text-bottom;\n' +
      '    border-radius: 0;\n' +
      '    background-color: #4acc8e;\n' +
      '    margin: auto 0;\n' +
      '    position: absolute;' +
      '    transform: translate(-16px, 5px);' +
      '}\n' +
      '\n' +
      'ul:not(ul[style^=list-style-type]) li li li::before {\n' +
      '    content: "";\n' +
      '    display: inline-block;\n' +
      '    height: 8px;\n' +
      '    width: 8px;\n' +
      '    vertical-align: text-bottom;\n' +
      '    border-radius: 50%;\n' +
      '    border: 1px solid #4acc8e;\n' +
      '    background-color: white;\n' +
      '    margin: auto 0;\n' +
      '    position: absolute;' +
      '    transform: translate(-16px, 4px);' +
      '}\n' +
      '\n' +
      'ul li[style^=list-style-type]::before {\n' +
      '    content: unset !important;\n' +
      '}' +
      '.tiny-editor-files{\n' +
      '    position: absolute;\n' +
      '    margin-top: 30px;\n' +
      '    height: 20px;\n' +
      '    bottom: 0;' +
      '    width: 100%;\n' +
      '    background: gray;\n' +
      '  }' +
      'body{' +
      '    min-height: 100%;' +
      '    position: relative;' +
      '    margin: 16px 16px' +
      '    padding-bottom: ' + (filesLength >= 2 ? '75px' : n === 1 ? '29px' : '0px') +
      '}' +
      '::-webkit-scrollbar {\n' +
      '  -webkit-appearance: none;\n' +
      '  width: 7px;\n' +
      '}\n' +
      '\n' +
      '::-webkit-scrollbar-thumb {\n' +
      '  border-radius: 4px;\n' +
      '  background-color: rgba(0, 0, 0, 0.5);\n' +
      '  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);\n' +
      '}' +
      'body { font-family: Open Sans, sans-serif; }' +
      'p {\n' +
      '  display: block;\n' +
      '  margin-block-start: unset;\n' +
      '  margin-block-end: unset;\n' +
      '  margin-inline-start: unset;\n' +
      '  margin-inline-end: unset;\n' +
      '  margin: 1em 0;\n' +
      '  line-height: unset;\n' +
      '}' +
      'a {\n' +
      '  color: #745de2;\n' +
      '  text-decoration: none;\n' +
      '}' +
      'a * {' +
      '  color: #745de2;\n' +
      '}',
    file_picker_callback: (cb) => {
      const input = document.createElement('input');

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          const id = `blobid${new Date().getTime()}`;
          const blobCache = window.tinymceEditor.editorUpload.blobCache;
          const base64 = reader.result.split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);

          blobCache.add(blobInfo);

          cb(blobInfo.blobUri(), { title: file.name });
        });
        reader.readAsDataURL(file);
      });

      input.click();
    },
  };
};

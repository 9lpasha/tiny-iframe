import './App.css';
import {Editor} from "@tinymce/tinymce-react";

/*import tinymce from 'tinymce/tinymce.min';
import 'tinymce/models/dom/model.min';
import 'tinymce/themes/silver/theme.min';
import 'tinymce/icons/default/icons.min';
import 'tinymce/skins/ui/oxide/skin.min.css';*/

/*import 'tinymce/plugins/advlist/plugin.min';
import 'tinymce/plugins/anchor/plugin.min';
import 'tinymce/plugins/autolink/plugin.min';
import 'tinymce/plugins/autoresize/plugin.min';
import 'tinymce/plugins/autosave/plugin.min';
import 'tinymce/plugins/charmap/plugin.min';
import 'tinymce/plugins/code/plugin.min';
import 'tinymce/plugins/codesample/plugin.min';
import 'tinymce/plugins/directionality/plugin.min';
import 'tinymce/plugins/emoticons/plugin.min';
import 'tinymce/plugins/fullscreen/plugin.min';
import 'tinymce/plugins/help/plugin.min';
import 'tinymce/plugins/image/plugin.min';
import 'tinymce/plugins/importcss/plugin.min';
import 'tinymce/plugins/insertdatetime/plugin.min';
import 'tinymce/plugins/link/plugin.min';
import 'tinymce/plugins/lists/plugin.min';
import 'tinymce/plugins/media/plugin.min';
import 'tinymce/plugins/nonbreaking/plugin.min';
import 'tinymce/plugins/pagebreak/plugin.min';
import 'tinymce/plugins/preview/plugin.min';
import 'tinymce/plugins/quickbars/plugin.min';
import 'tinymce/plugins/save/plugin.min';
import 'tinymce/plugins/searchreplace/plugin.min';
import 'tinymce/plugins/table/plugin.min';
import 'tinymce/plugins/template/plugin.min';
import 'tinymce/plugins/visualblocks/plugin.min';
import 'tinymce/plugins/visualchars/plugin.min';
import 'tinymce/plugins/wordcount/plugin.min';
import 'tinymce/plugins/emoticons/js/emojis.min';*/

import {useEffect, useState} from "react";
import {tinyEditorConfig} from "./tinyEditorConfig";

const language = 'ru';

function App() {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (editor) {
      window.parent.postMessage({type: 'editor_init', main: 'editor'});
      window.addEventListener('message', (e) => {
          console.log(e.data);
          const data = e.data;
          if (data.type === 'second') {
            editor.setContent(data.main);
            window.parent.postMessage({type: 'second', main: 'done'}, '*');
        }
      })
    }
  }, [editor]);

  return (
      <Editor
          apiKey="f0c7hykjh36wn58hqxn4nrnw74vwkfs016ihzfadwvdqbn6l"
          init={tinyEditorConfig(language)}
          onInit={(evt, editor) => {
            setEditor(editor);
          }}
          onNodeChange={e => {
            const img = e.element.querySelector('img');

            if (img && (!img.nextElementSibling/*  || img.nextElementSibling && img.nextElementSibling.tagName !== 'BR'*/)) {
              const br = document.createElement('br');

              if (img.nextElementSibling) {
                img.parentNode.insertBefore(br, img.nextElementSibling);
              } else {
                img.parentNode.appendChild(br);
              }
            }
            if (img && img.style.float !== 'left') {
              const p = document.createElement('p');
              const br = document.createElement('br');

              p.appendChild(br);
              if (!e.element.nextSibling) {
                e.element.parentNode.appendChild(p);
              }
            }
          }}
      />
  );
}

export default App;

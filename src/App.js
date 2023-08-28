import './App.css';
import {Editor} from "@tinymce/tinymce-react";

import tinymce from 'tinymce/tinymce.min';

import 'tinymce/models/dom/model.min';
import 'tinymce/themes/silver/theme.min';
// Toolbar icons
import 'tinymce/icons/default/icons.min';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist/plugin.min';
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

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis.min';

function App() {
  return (
      <Editor
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

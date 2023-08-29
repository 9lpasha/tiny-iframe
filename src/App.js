import './App.css';
import {Editor} from "@tinymce/tinymce-react";

import {useEffect, useState} from "react";
import {tinyEditorConfig} from "./tinyEditorConfig";

let timeout;

function App() {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState('en');
  const [editorValue, setEditorValue] = useState('');

  const postMessage = (data) => {
    window.parent.postMessage(data, "*");
  };

  useEffect(() => {
    if (editor) {
      window.addEventListener('message', (e) => {
          const data = e.data;
          console.log(data);
          if (data.type === 'connect' && data.value !== 'done') {
            setLanguage(data.value.language);
            setEditorValue(data.value.text);
            postMessage({type: 'connect', value: 'done'});
          } else if (data.type === 'second' && data.value !== 'done' ) {
            editor.setContent(data.value);
            postMessage({type: 'second', value: 'done'});
          }
      })
    }
  }, [editor]);

  const onSubmit = () => {
    postMessage({type: 'submit', value: editor.getContent()});
  };

  const toggleFlagForClickOnIframes = () => {
    postMessage({type: 'toggleFlagForClickOnIframes'});
  };

  return (
      <Editor
          apiKey="f0c7hykjh36wn58hqxn4nrnw74vwkfs016ihzfadwvdqbn6l"
          init={tinyEditorConfig(language)}
          onInit={(evt, editor) => {
            setEditor(editor);
            window.tinymceEditor = editor;
          }}
          onSubmit={onSubmit}
          // initialValue={editorValue}
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
          onEditorChange={(value) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
              postMessage({type: 'save', value});
            }, 500);
          }}
          onClick={toggleFlagForClickOnIframes}
      />
  );
}

export default App;

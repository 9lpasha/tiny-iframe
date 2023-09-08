import './App.css';
import {Editor} from "@tinymce/tinymce-react";

import {useEffect, useState} from "react";
import {tinyEditorConfig} from "./tinyEditorConfig";

let timeout;

function App() {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState('en');

  const postMessage = (data) => {
    window.parent.postMessage(data, "*");
  };

  useEffect(() => {
    if (editor) {
      window.addEventListener('message', (e) => {
          const data = e.data;
          if (data.type === 'connect' && data.value !== 'done') {
            console.log(data)
            setLanguage(data.value.language);
            editor.setContent(data.value.text);

            // изменение высота, на которую влияют файлы
            const node = document.querySelector('.tox-tinymce');
            // eslint-disable-next-line no-magic-numbers
            const n = data.value.files ? data.value.files.length : 0;

            if (node) {
              const classText = 'tox-tinymce-files';

              if (n !== 0) {
                // eslint-disable-next-line no-magic-numbers
                node.classList.add(`${n >= 2 ? `${classText}-2` : n === 1 ? `${classText}-1` : ''}`);
                node.classList.remove(`${n >= 2 ? `${classText}-1` : n === 1 ? `${classText}-2` : [`${classText}-2`, `${classText}-1`]}`)
              }
            }
            postMessage({type: 'connect', value: 'done'});
          } else if (data.type === 'remove') {
            console.log(data)
            editor.remove();
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

  const onNodeChange = e => {
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
  };

  const onEditorChange = value => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      postMessage({type: 'save', value});
    }, 500);
  };

  const onInit = (evt, editor) => {
    setEditor(editor);
    window.tinymceEditor = editor;
  };

  return (
      <Editor
          apiKey="f0c7hykjh36wn58hqxn4nrnw74vwkfs016ihzfadwvdqbn6l"
          init={tinyEditorConfig(language)}
          onInit={onInit}
          onSubmit={onSubmit}
          onNodeChange={onNodeChange}
          onEditorChange={onEditorChange}
          onClick={toggleFlagForClickOnIframes}
      />
  );
}

export default App;

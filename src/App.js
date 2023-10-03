import './App.css';
import {Editor} from "@tinymce/tinymce-react";

import {useEffect, useState} from "react";
import {tinyEditorConfig} from "./tinyEditorConfig";

let timeout;

function App() {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isConnected, setIsConnected] = useState(false);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(0);

  const postMessage = (data) => {
    window.parent.postMessage(data, "*");
  };

  useEffect(() => {
    if (editor) {
      editor.setContent(content);

      // изменение высота, на которую влияют файлы
      const node = document.querySelector('.tox-tinymce');
      const n = files ? files.length : 0;

      if (node) {
        const classText = 'tox-tinymce-files';

        if (n !== 0) {
          node.classList.add(`${n >= 2 ? `${classText}-2` : n === 1 ? `${classText}-1` : ''}`);
          node.classList.remove(`${n >= 2 ? `${classText}-1` : n === 1 ? `${classText}-2` : ''}`)
        } else {
          node.classList.remove(`${classText}-2`, `${classText}-1`)
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    const messageHandler = (e) => {
      const data = e.data;
      if (data.type === 'connect' && data.value !== 'done') {
        setFiles(data.value.files);
        setLanguage(data.value.language);
        setIsConnected(true);
        editor ? editor.setContent(data.value.text) : setContent(data.value.text);
        postMessage({type: 'connect', value: 'done'});
      } else if (data.type === 'remove') {
        editor.remove();
      }
    };
    window.addEventListener('message', messageHandler);
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

  console.log(files)

  return isConnected ? (
      <Editor
          apiKey="fuap8hv77ephh20hmfv8azp7l6itmzzdr7dddh0y9dv2rwq3"
          init={tinyEditorConfig(language, files ? files.length : 0)}
          onInit={onInit}
          onSubmit={onSubmit}
          onNodeChange={onNodeChange}
          onEditorChange={onEditorChange}
          onClick={toggleFlagForClickOnIframes}
      />
  ) : <div/>;
}

export default App;

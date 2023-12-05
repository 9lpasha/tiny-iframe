import "./App.css";
import { Editor } from "@tinymce/tinymce-react";

import { useEffect, useState } from "react";
import { tinyEditorConfig } from "./tinyEditorConfig";

let timeout;

// eslint-disable-next-line
const urlParams = new URLSearchParams(location.search);
const token = urlParams.get("token");
export const fileUploadSettings = {
  uploadMode: 0,
  callback: null
};

const onResize = () => {
  const maxHeightToxMenu = document.body.clientHeight - 175;
  const css = document.getElementsByTagName("style");

  if (css.length) {
    css[css.length - 1].innerHTML =
      css[css.length - 1].innerHTML +
      "\n.tox-menu {max-height: " +
      maxHeightToxMenu +
      "px!important;}";
  } else {
    const newcss = document.createElement("style");

    newcss.innerHTML =
      newcss.innerHTML +
      "\n.tox-menu {max-height: " +
      maxHeightToxMenu +
      "px!important;}";
    document.head.appendChild(newcss);
  }
};

window.addEventListener("resize", onResize);
onResize();

function App() {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState("en");
  const [isConnected, setIsConnected] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(0);

  const postMessage = (data) => {
    window.parent.postMessage(data, "*");
  };

  useEffect(() => {
    if (editor) {
      editor.setContent(content);

      // изменение высота, на которую влияют файлы
      const node = document.querySelector(".tox-tinymce");
      const n = files ? files.length : 0;

      if (node) {
        const classText = "tox-tinymce-files";

        if (n !== 0) {
          node.classList.add(
            `${n >= 2 ? `${classText}-2` : n === 1 ? `${classText}-1` : ""}`
          );
          node.classList.remove(
            `${n >= 2 ? `${classText}-1` : n === 1 ? `${classText}-2` : ""}`
          );
        } else {
          node.classList.remove(`${classText}-2`, `${classText}-1`);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    const messageHandler = (e) => {
      const data = e.data;
      if (data.type === "connect" && data.value !== "done") {
        setFiles(data.value.files);
        setLanguage(data.value.language);
        setIsConnected(true);
        localStorage.setItem("HDAuthorizationToken", data.authToken);
        localStorage.setItem("baseURL", data.baseURL);
        if (editor) {
          if (data.value.text !== editor.getContent())
            editor.setContent(data.value.text);
        } else {
          if (data.value.text !== content) setContent(data.value.text);
        }
        postMessage({ type: "connect", value: "done" });
      } else if (data.type === "changeFiles") {
        setFiles(data.value);
      } else if (data.type === "remove") {
        editor.remove();
      } else if (data.type === "image_insert") {
        const tmpFiles = data.value;

        if (fileUploadSettings.uploadMode) {
          const tmpFile = tmpFiles[0];

          fileUploadSettings.callback(localStorage.getItem("baseURL") + tmpFile.link, { title: tmpFile.original_name });
        } else {
          tmpFiles.forEach(file => {
            editor.execCommand("mceInsertContent", false, "<img src=\"" + localStorage.getItem("baseURL") + file.link + "\">");
          });
        }
      }
    };
    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && editor.dom.doc) {
      editor.dom.doc.body.classList.remove("files-2");
      editor.dom.doc.body.classList.remove("files-1");
      if (files?.length >= 1) {
        editor.dom.doc.body.classList.add(
          files?.length >= 2 ? "files-2" : "files-1"
        );
      }
    }
  }, [files, editor, editor?.dom?.doc]);

  const onSubmit = () => {
    postMessage({ type: "submit", value: editor.getContent() });
  };

  const toggleFlagForClickOnIframes = () => {
    postMessage({ type: "toggleFlagForClickOnIframes" });
  };

  const onNodeChange = (e) => {
    const img = e.element.querySelector("img");

    if (
      img &&
      !img.nextElementSibling /*  || img.nextElementSibling && img.nextElementSibling.tagName !== 'BR'*/
    ) {
      const br = document.createElement("br");

      if (img.nextElementSibling) {
        img.parentNode.insertBefore(br, img.nextElementSibling);
      } else {
        img.parentNode.appendChild(br);
      }
    }
    if (img && img.style.float !== "left") {
      const p = document.createElement("p");
      const br = document.createElement("br");

      p.appendChild(br);
      if (!e.element.nextSibling) {
        e.element.parentNode.appendChild(p);
      }
    }
  };

  const onEditorChange = (value) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      postMessage({ type: "save", value });
    }, 500);
  };

  const onInit = (evt, editor) => {
    setEditor(editor);
    window.tinymceEditor = editor;
  };

  const pasteDropProcessing = (e, dataTransfer) => {
    // Отменяем стандартное поведение вставки
    e.preventDefault();

    const files = [...dataTransfer.files];

    if (files.find(file => file.type.indexOf("image") !== -1)) {
      console.log("вставка картинок: ", [...files.filter(file => file.type.indexOf("image") !== -1)]);
      fileUploadSettings.uploadMode = 0;

      postMessage({ type: "image_insert", value: files.filter(file => file.type.indexOf("image") !== -1) });
    }

    if (files.length && files.find(file => file.type.indexOf("image") === -1)) {
      console.log("добавить к файлам: ", files.filter(file => file.type.indexOf("image") === -1));

      postMessage({ type: "file_insert", value: files.filter(file => file.type.indexOf("image") === -1) });
    }

    // Получаем HTML-разметку из буфера обмена
    const pastedHTML = dataTransfer.getData("text/html");

    editor.execCommand("mceInsertContent", false, pastedHTML);
  };

  return isConnected ? (
    <Editor
      // продовый - nbwuxkn96vt295l4ltn1cgpvi3ytgnkgofk4dr3owmu7pg1u
      // тестовый - nokzoluxwt2joxkk39p4n94lkc903scm7ffu4yeggac4hhym
      apiKey={token || "nokzoluxwt2joxkk39p4n94lkc903scm7ffu4yeggac4hhym"}
      init={tinyEditorConfig(language, files ? files.length : 0)}
      onInit={onInit}
      onSubmit={onSubmit}
      onNodeChange={onNodeChange}
      onEditorChange={onEditorChange}
      onClick={toggleFlagForClickOnIframes}
      onPaste={(e, editor) => pasteDropProcessing(e, e.clipboardData)}
      onDrop={(e) => pasteDropProcessing(e, e.dataTransfer)}
    />
  ) : (
    <div />
  );
}

export default App;

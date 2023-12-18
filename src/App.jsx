import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";

import { tinyEditorConfig } from "./tinyEditorConfig";
import "./App.css";
import { compareEditorVersions } from "./helpers";

let timeout;
let prevButton;

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
      css[css.length - 1].innerHTML + "\n.tox-menu {max-height: " + maxHeightToxMenu + "px!important;}";
  } else {
    const newcss = document.createElement("style");

    newcss.innerHTML = newcss.innerHTML + "\n.tox-menu {max-height: " + maxHeightToxMenu + "px!important;}";
    document.head.appendChild(newcss);
  }
};

window.addEventListener("resize", onResize);
onResize();

export const countDogs = (str, pos) => {
  let n = 0;
  let flag = false;
  for (let i = pos - 1; i >= 0 && !flag; i--) {
    if (str[i] === "@") {
      n += 1;
    } else {
      if (str[i].charCodeAt() === 160) {
        n += 1;
      } else {
        flag = true;
      }
    }
  }

  return n;
};

let users = [];
let filteredUsers = [];
let disabledTyping = false;
let currentLastMention = null;

function App() {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState("en");
  const [isConnected, setIsConnected] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(0);
  const [withTemplates, setWithTemplates] = useState(false);
  const [withMentions, setWithMentions] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);

  const currentTargetRef = useRef(currentTarget);
  currentTargetRef.current = currentTarget;
  const editorRef = useRef(null);
  editorRef.current = editor;

  const postMessage = (data) => {
    if (data.type === "save") {
      const anchors = editorRef.current.dom.doc.querySelectorAll("a");
      const filteredAnchors = [...anchors].filter((el) => el.getAttribute("data-userid"));

      window.parent.postMessage(
        {
          ...data,
          mentionedUsersIds: filteredAnchors.map((el) => ({
            id: el.getAttribute("data-userid"),
            type: el.getAttribute("data-type"),
          })),
        },
        "*",
      );
    } else {
      window.parent.postMessage(data, "*");
    }
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
          node.classList.add(`${n >= 2 ? `${classText}-2` : n === 1 ? `${classText}-1` : ""}`);
          node.classList.remove(`${n >= 2 ? `${classText}-1` : n === 1 ? `${classText}-2` : ""}`);
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
        setWithTemplates(data.value.withTemplates);
        setWithMentions(data.value.withMentions);
        setIsConnected(true);
        setDisabled(data.value.disabled);
        localStorage.setItem("HDAuthorizationToken", data.authToken);
        localStorage.setItem("baseURL", data.baseURL);
        if (editor) {
          if (!compareEditorVersions(data.value.text, editor.getContent())) editor.setContent(data.value.text);

          if (!data.value.text) {
            const spanModal = document.body.querySelector(".mentions-modal");
            if (spanModal) document.body.removeChild(spanModal);
          }
        } else {
          if (data.value.text !== content) setContent(data.value.text);
        }
        users = data.value.suggestions;

        postMessage({ type: "connect", value: "done" });
      } else if (data.type === "changeFiles") {
        setFiles(data.value);
      } else if (data.type === "changeDisabled") {
        setDisabled(data.value);
      } else if (data.type === "changeSuggestions") {
        users = data.value;
      } else if (data.type === "addVariable") {
        const sel = editorRef.current.dom.doc.getSelection();

        if (sel.getRangeAt && sel.rangeCount) {
          const range = sel.getRangeAt(0);

          range.deleteContents();
          range.insertNode(document.createTextNode(data.value));
        }
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

  const setOpenedTemplate = (opened) => {
    postMessage({ type: "setOpenedTemplate", value: opened });
  };

  const setOpenedVariables = (opened) => {
    postMessage({ type: "setOpenedVariables", value: opened });
  };

  const mentionAction = (currentTargetRef) => {
    const node = currentTargetRef.current?.parentNode?.querySelector(".last-mention");
    if (
      !node &&
      (!prevButton || prevButton === " " || currentTargetRef.current.textContent === "@" || !currentTargetRef.current)
    ) {
      const caretPosition = editorRef.current.dom.doc.getSelection().anchorOffset || 0;

      if (currentTargetRef.current) {
        currentTargetRef.current.innerHTML =
          currentTargetRef.current.textContent.slice(
            0,
            caretPosition - countDogs(currentTargetRef.current.textContent, caretPosition),
          ) +
          '<span class="last-mention">@</span>' +
          currentTargetRef.current.textContent.slice(caretPosition);
      } else {
        editorRef.current.dom.doc.querySelector("p").innerHTML = '<span class="last-mention">@</span>';
      }

      const span = currentTargetRef.current.querySelector(".last-mention");
      const oldSpanModals = document.body.querySelectorAll(".mentions-modal");
      const spanModal = document.createElement("div");

      if ([...oldSpanModals].length) {
        oldSpanModals.forEach((oldSpanModal) => {
          document.body.removeChild(oldSpanModal);
        });
      }

      for (let i = 0; i < users.length; i++) {
        const div = document.createElement("div");

        div.textContent = users[i].text;
        div.className = "mentions-modal-option";
        spanModal.appendChild(div);
      }

      spanModal.className = "mentions-modal";
      span.appendChild(spanModal);
      spanModal.style.display = "absolute";

      const { x, y } = spanModal.getBoundingClientRect();

      spanModal.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      };
      spanModal.childNodes.forEach((node, i) => {
        node.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          span.textContent = "@" + users[i].value;
          const newSpan = document.createElement("span");
          const newSpan2 = document.createElement("span");
          newSpan.appendChild(newSpan2);
          newSpan2.innerHTML = "&nbsp;";
          if (span.nextSibling) {
            span.parentNode.insertBefore(newSpan, span.nextSibling);
          } else {
            span.parentNode?.appendChild(newSpan);
          }

          const neww = document.createElement("a");
          neww.href = users[i].url;
          neww.setAttribute("data-userid", users[i].id);
          neww.setAttribute("data-type", users[i].type);
          neww.className = "mention";
          neww.innerHTML = span.innerHTML;
          span.parentNode?.replaceChild(neww, span);

          document.body.removeChild(spanModal);

          const range = editorRef.current.dom.doc.createRange();
          const sel = editorRef.current.dom.doc.getSelection();

          range.setStart(newSpan.firstChild, 1);
          range.collapse(true);

          sel.removeAllRanges();
          sel.addRange(range);

          editorRef.current.dom.doc.body.focus();

          prevButton = " ";

          postMessage({ type: "save", value: editorRef.current.getContent() });
        };
      });

      spanModal.style.left = x + "px";
      spanModal.style.top = y + document.querySelector(".tox-editor-header").offsetHeight + "px";
      spanModal.style.display = "fixed";
      document.body.appendChild(spanModal);

      const range = editorRef.current.dom.doc.createRange();
      const sel = editorRef.current.dom.doc.getSelection();

      range.setStart(span.childNodes[0], 1);
      range.collapse(true);

      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const toggleFlagForClickOnIframes = () => {
    postMessage({ type: "toggleFlagForClickOnIframes" });
  };

  const onNodeChange = (e) => {
    const img = e.element.querySelector("img");

    if (img && !img.nextElementSibling) {
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

    if (withMentions) {
      if (e.element.className === "last-mention") {
        setCurrentTarget(e.element.parentNode);
        currentLastMention = e.element;
      } else {
        setCurrentTarget(e.element);
        currentLastMention = e.element;
      }

      if (e.element.parentNode.id === "_mce_caret" && e.element.className === "last-mention") {
        e.element.parentNode.parentNode.removeChild(e.element.parentNode);
      } else {
        if (e.element.tagName === "P" && e.element.innerHTML === "") {
          e.element.innerHTML = "<br />";
        }
      }
    }
  };

  const onEditorChange = () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      postMessage({ type: "save", value: editor.getContent() });
    }, 800);
  };

  const onKeyPress = (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      postMessage({ type: "save", value: editor.getContent() });
    }, 800);

    const prepareNode = currentTargetRef.current.parentNode || currentTargetRef.current;
    const lastMension = prepareNode.querySelector(".last-mention");

    if (e.key === "@" || (lastMension && e.key === " ")) disabledTyping = true;

    if (withMentions)
      setTimeout(() => {
        if (e.key === "@") {
          mentionAction(currentTargetRef);
          disabledTyping = false;
        } else {
          prevButton = e.key;

          if (e.key === " ") {
            const spanModal = document.body.querySelector(".mentions-modal");
            const lastMension = currentTargetRef.current.parentNode.querySelector(".last-mention");

            if (spanModal) document.body.removeChild(spanModal);

            if (lastMension) {
              const caretPosition = editorRef.current.dom.doc.getSelection().anchorOffset || 0;
              const random = "random" + String(Number(Math.random().toFixed(5)) * 100000).slice(0, 5);

              currentLastMention.innerHTML =
                currentLastMention.textContent.slice(0, caretPosition - 1) +
                "<span class=" +
                random +
                ">&nbsp;</span>" +
                currentLastMention.textContent.slice(caretPosition);

              lastMension.className = "";

              const range = editor.dom.doc.createRange();
              const sel = editor.dom.doc.getSelection();

              const lastSpan = editorRef.current.dom.doc.querySelector(`.${random}`);

              range.setStart(lastSpan, 1);
              range.collapse(true);

              sel.removeAllRanges();
              sel.addRange(range);

              editor.dom.doc.body.focus();
            }

            disabledTyping = false;
          } else {
            const lastMension = currentTargetRef.current.parentNode.querySelector(".last-mention");

            if (lastMension) {
              const search = lastMension.textContent.slice(1);
              const spanModal = document.body.querySelector(".mentions-modal");

              filteredUsers = users.filter((user) => user.text.toLowerCase().includes(search.toLowerCase()));

              for (let i = spanModal.childNodes.length - 1; i >= 0; i--) {
                spanModal.removeChild(spanModal.childNodes[i]);
              }

              for (let i = 0; i < filteredUsers.length; i++) {
                const div = document.createElement("div");

                div.textContent = filteredUsers[i].text;
                div.className = "mentions-modal-option";
                spanModal.appendChild(div);

                div.onclick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();

                  lastMension.textContent = "@" + filteredUsers[i].value;
                  const newSpan = document.createElement("span");
                  const newSpan2 = document.createElement("span");
                  newSpan.appendChild(newSpan2);
                  newSpan2.innerHTML = "&nbsp;";

                  if (lastMension.nextSibling) {
                    lastMension.parentNode.insertBefore(newSpan, lastMension.nextSibling);
                  } else {
                    lastMension.parentNode?.appendChild(newSpan);
                  }

                  const neww = document.createElement("a");
                  neww.href = filteredUsers[i].url;
                  neww.setAttribute("data-userid", filteredUsers[i].id);
                  neww.setAttribute("data-type", filteredUsers[i].type);
                  neww.className = "mention";
                  neww.innerHTML = lastMension.innerHTML;
                  lastMension.parentNode?.replaceChild(neww, lastMension);

                  document.body.removeChild(spanModal);

                  const range = editor.dom.doc.createRange();
                  const sel = editor.dom.doc.getSelection();

                  range.setStart(newSpan.firstChild, 1);
                  range.collapse(true);

                  sel.removeAllRanges();
                  sel.addRange(range);

                  editor.dom.doc.body.focus();

                  prevButton = " ";

                  postMessage({ type: "save", value: editor.getContent() });
                };
              }
            }
          }
        }
      }, 400);
  };

  const onKeyUp = (e) => {
    if (withMentions)
      setTimeout(() => {
        const lastMension = currentTargetRef.current.parentNode.querySelector(".last-mention");

        if (e.key === "Backspace") {
          if (!lastMension) {
            const spanModal = document.body.querySelector(".mentions-modal");
            document.body.removeChild(spanModal);
          } else {
            const search = lastMension.textContent.slice(1);
            const spanModal = document.body.querySelector(".mentions-modal");

            filteredUsers = users.filter((user) => user.text.toLowerCase().includes(search.toLowerCase()));

            for (let i = spanModal.childNodes.length - 1; i >= 0; i--) {
              spanModal.removeChild(spanModal.childNodes[i]);
            }

            for (let i = 0; i < filteredUsers.length; i++) {
              const div = document.createElement("div");

              div.textContent = filteredUsers[i].text;
              div.className = "mentions-modal-option";
              spanModal.appendChild(div);

              div.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                lastMension.textContent = "@" + filteredUsers[i].value;
                const newSpan = document.createElement("span");
                const newSpan2 = document.createElement("span");
                newSpan.appendChild(newSpan2);
                newSpan2.innerHTML = "&nbsp;";
                if (lastMension.nextSibling) {
                  lastMension.parentNode.insertBefore(newSpan, lastMension.nextSibling);
                } else {
                  lastMension.parentNode?.appendChild(newSpan);
                }

                const neww = document.createElement("a");
                neww.href = filteredUsers[i].url;
                neww.setAttribute("data-userid", filteredUsers[i].id);
                neww.setAttribute("data-type", filteredUsers[i].type);
                neww.className = "mention";
                neww.innerHTML = lastMension.innerHTML;
                lastMension.parentNode?.replaceChild(neww, lastMension);

                document.body.removeChild(spanModal);

                const range = editor.dom.doc.createRange();
                const sel = editor.dom.doc.getSelection();

                range.setStart(newSpan.firstChild, 1);
                range.collapse(true);

                sel.removeAllRanges();
                sel.addRange(range);

                editor.dom.doc.body.focus();

                prevButton = " ";

                postMessage({ type: "save", value: editor.getContent() });
              };
            }
          }
        }
      }, 400);

    if (e.key === "Enter") {
      const html = editorRef.current.dom.doc.querySelector("html");
      html.scrollTo({
        top: html.scrollTop + 30,
        duration: 0,
        behavior: "auto",
      });

      const spanModal = document.body.querySelector(".mentions-modal");

      if (spanModal) document.body.removeChild(spanModal);

      setTimeout(() => {
        const lastMensions = currentTargetRef.current.parentNode.querySelectorAll(".last-mention");
        [...lastMensions].forEach((el) => (el.className = ""));
      }, 400);
    }
  };

  const onKeyDown = (e) => {
    if (withMentions) {
      const prepareNode = currentTargetRef.current.parentNode || currentTargetRef.current;
      const node = prepareNode.querySelector(".last-mention");

      if (e.key === "@" && node?.textContent === "@") {
        e.preventDefault();
      }

      if (disabledTyping) {
        e.preventDefault();
      }
    }
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
    <>
      <Editor
        // продовый - nbwuxkn96vt295l4ltn1cgpvi3ytgnkgofk4dr3owmu7pg1u
        // тестовый - nokzoluxwt2joxkk39p4n94lkc903scm7ffu4yeggac4hhym
        apiKey={token || "nokzoluxwt2joxkk39p4n94lkc903scm7ffu4yeggac4hhym"}
        init={tinyEditorConfig(
          language,
          files ? files.length : 0,
          setOpenedTemplate,
          withTemplates,
          withMentions && !withTemplates,
          setOpenedVariables,
          withMentions,
          () => mentionAction(currentTargetRef),
          setCurrentTarget,
          () => currentTargetRef,
        )}
        onInit={onInit}
        onSubmit={onSubmit}
        onNodeChange={onNodeChange}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onEditorChange={onEditorChange}
        onClick={toggleFlagForClickOnIframes}
        onPaste={(e, editor) => pasteDropProcessing(e, e.clipboardData)}
        onDrop={(e) => pasteDropProcessing(e, e.dataTransfer)}
      />
      {disabled && (
        <div
          style={{
            height: "100%",
            width: "100%",
            background: "rgba(0, 0, 0, 0.05)",
            position: "absolute",
            top: "0",
            zIndex: "100",
          }}
        />
      )}
    </>
  ) : (
    <div />
  );
}

export default App;

import React, { useRef, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
export default function Editor(props) {
  const { language, displayName, value, onChange } = props;
  const editorRef = useRef(null);
  function handleChange(value) {
    onChange(value);
  }

  useEffect(() => {
    editorRef.current && editorRef.current.editor.renderer.setShowGutter(true);
  }, [props]);
  return (
    <div className="editor-container">
      <div className="editor-title">{displayName}</div>
      <div className="ace-editor">
        <AceEditor
          height={"inherit"}
          width={"inherit"}
          mode={language}
          value={value}
          theme="terminal"
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          onChange={handleChange}
          ref={editorRef}
        />
      </div>
    </div>
  );
}

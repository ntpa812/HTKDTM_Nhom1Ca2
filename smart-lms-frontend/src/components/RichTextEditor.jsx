import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({ initialValue = "", onSave }) => {
  const editorRef = useRef(null);

  // 🕒 Auto-save mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current) {
        const draft = editorRef.current.getContent();
        localStorage.setItem("autosave_draft", draft);
        console.log("💾 Auto-saved draft!");
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveContent = () => {
    const html = editorRef.current?.getContent();
    if (!html) {
      alert("⚠️ Không có nội dung để lưu!");
      return;
    }
    if (!onSave) {
      alert("⚠️ Chưa truyền hàm onSave từ component cha!");
      console.error("Lỗi: onSave prop không được định nghĩa.");
      return;
    }
    onSave(html);
    localStorage.removeItem("autosave_draft");
    alert("✅ Nội dung đã lưu thành công!");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        borderRadius: 20,
        padding: 24,
        margin: "30px auto",
        color: "white",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        maxWidth: 1000,
      }}
    >
      <style>
        {`
          .editor-save-btn {
            background: #4338ca;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 10px 22px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 16px;
            transition: 0.2s ease;
          }
          .editor-save-btn:hover {
            background: #3730a3;
          }
        `}
      </style>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        📝 Trình soạn thảo nội dung
      </h2>
      <p style={{ opacity: 0.9, marginBottom: 16 }}>
        Tạo hoặc chỉnh sửa văn bản phong phú với định dạng, ảnh, video, bảng,
        công thức...
      </p>

      <Editor
        apiKey="jkh442ezvkrate4l1wqu9g9h2ovabpofcqc66za0uis1vylv"
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        init={{
          height: 500,
          menubar: true,
          language: "vi",
          resize: false,
          min_height: 500,
          max_height: 500,
          branding: false,
          promotion: false,
          elementpath: false,
          plugins: [
            "advlist", "lists", "link", "image", "charmap", "preview", "anchor",
            "searchreplace", "code", "fullscreen", "insertdatetime", "media",
            "table", "help", "wordcount", "codesample", "emoticons", "pagebreak"
          ],
          toolbar:
            "undo redo | blocks | bold italic underline forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media codesample table | " +
            "emoticons charmap | code preview fullscreen",
          content_style:
            "body { font-family:Inter,Arial,sans-serif; font-size:16px; line-height:1.5; }",
          toolbar_mode: "sliding",
          setup: (editor) => {
            // ⚙️ Fix nhảy con trỏ khi gõ tiếng Việt
            editor.on("compositionstart", () => { editor.isComposing = true; });
            editor.on("compositionend", () => { editor.isComposing = false; });
            editor.on("input", (e) => {
              if (editor.isComposing) e.stopImmediatePropagation();
            });
          },
        }}
      />

      <button className="editor-save-btn" onClick={handleSaveContent}>
        💾 Lưu nội dung
      </button>
    </div>
  );
};

export default RichTextEditor;

import { useState, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import PreviewWindow from './components/PreviewWindow';

import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

function App() {
  // מצב התחלתי טיוטה של עורך הקוד
  const [editorCode, setEditorCode] = useState('<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>');

  // המשתנה שיעודכן רק כשהמשתמש לוחץ על Run
  const [executedCode, setExecutedCode] = useState(editorCode);

  useEffect(() => {
    socket.on('receive-code', (newCode) => {
      setEditorCode(newCode);
    });
    return () => {
      socket.off('receive-code');
    }
  }, []);

  const handleRun = () => {
    setExecutedCode(editorCode);
  };

  const handleEditorChange = (newValue) => {
    setEditorCode(newValue);
    socket.emit('code-change', newValue);
  }



  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">

      {/* 1. הרכיב העליון */}
      <Header onRun={handleRun} />

      {/* 2. אזור העבודה (מסודר בשורה: שמאל וימין) */}
      <div className="flex-1 flex flex-row">

        {/* צד שמאל: עורך קוד */}
        <div className="w-1/2 border-r border-gray-700">
          <CodeEditor code={editorCode} onChange={handleEditorChange} />
        </div>

        {/* צד ימין: חלון התוצאה */}
        <div className="w-1/2">
          <PreviewWindow executedCode={executedCode} />
        </div>

      </div>

      {/* 3. בעתיד: נוסיף פה את רכיב ה-Chat המרחף */}

    </div>
  );
}

export default App;
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange }) {
    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="html"
                value={code}
                onChange={onChange}
                theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize: 16 }}
            />
        </div>
    );
}
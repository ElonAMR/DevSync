export default function PreviewWindow({ executedCode }) {
  const generateOutput = (code) => {
    return `
      <html>
        <body>
          <!-- 1. קודם כל: סקריפט החטיפה שמכין את הקרקע -->
          <script>
            const oldLog = console.log;
            console.log = function(...args) {
              oldLog(...args);
              const output = document.createElement('div');
              output.style.color = '#10B981';
              output.style.fontFamily = 'monospace';
              output.style.marginTop = '10px';
              output.style.paddingTop = '10px';
              output.style.borderTop = '1px dashed #ccc';
              output.innerText = '> ' + args.join(' ');
              document.body.appendChild(output);
            }
          </script>
          
          ${code}
        </body>
      </html>
    `;
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="bg-gray-200 text-xs font-bold text-gray-600 p-2 border-b uppercase tracking-wider">
        Preview & Console
      </div>
      <div className="flex-1">
        <iframe
          title="preview"
          srcDoc={generateOutput(executedCode)}
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
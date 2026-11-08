export default function PreviewWindow({ executedCode }) {
  const generateOutput = (code) => {
    return `
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              padding: 16px;
              color: #18181b;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <script>
            const oldLog = console.log;
            console.log = function(...args) {
              oldLog(...args);
              const output = document.createElement('div');
              output.style.color = '#059669';
              output.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';
              output.style.fontSize = '13px';
              output.style.marginTop = '8px';
              output.style.paddingTop = '8px';
              output.style.borderTop = '1px dashed #e4e4e7';
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
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">

      <div className="h-9 bg-zinc-100 border-b border-zinc-200 px-3 flex items-center justify-between select-none">

        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        <span className="text-[11px] font-medium tracking-tight text-zinc-500 uppercase">
          Live Preview & Console
        </span>

        <div className="w-10" />
      </div>

      <div className="flex-1 w-full h-full bg-white">
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
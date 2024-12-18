import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React from 'react';

const text = 'const arr = [\n' +
  '  {\n' +
  '    id: 1,\n' +
  '    title: \'노트\',\n' +
  '    selected: true,\n' +
  '  },\n' +
  '  {\n' +
  '    id: 2,\n' +
  '    title: \'코드\',\n' +
  '    selected: true,\n' +
  '  },\n' +
  '  {\n' +
  '    id: 3,\n' +
  '    title: \'이미지\',\n' +
  '    selected: false,\n' +
  '];\n'
const Code = () => {
  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>
        <div>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {text}
          </SyntaxHighlighter>
        </div>

      </div>
    </>
  )
}

export default Code;
/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-16 15:02:45
 * @Description: Coding something
 */
import { transformVue } from './vue-lim/index.min';
import { transformReact } from './react-lim/index.min';

import Babel from './babel/babel.min';
const StyleText = `
<style>
body, html{color: #fff;background-color:#171717; margin: 0;}
body {padding: 5px}
body, body * {box-sizing: border-box;}
button, input, select{
    margin: 5px;
    padding: 6px 10px;
    background-color: #222;
    border: none;
    border-radius: 1px;
    outline: none;
    color: #ccc;
    border: 1px solid #666;
    border-radius: 5px;
}
button, select{
    cursor: pointer;
}
button: hover, select: hover{
    background-color: #333;
}
button:active{
    background-color: #555;
}
::-webkit-scrollbar {
    width:5px;
    cursor: pointer;
    height: 5px;
}
::-webkit-scrollbar-button    {
    display: none;
}
::-webkit-scrollbar-track     {
    display: none;
}
::-webkit-scrollbar-track-piece {
    background-color:#88888811;
}
::-webkit-scrollbar-thumb{
    background-color:#88888833;
    cursor: pointer;
}
::-webkit-scrollbar-thumb:hover{
    background-color:#88888855;
    cursor: pointer;
}
</style>`;
export const IS_DEV = () => location.hostname === 'localhost';

export function compileLim (code: string, isVue: boolean) {
    return isVue ? transformVue(code) : transformReact(code);
}

function parseReact (code: string): string {
    const options = {
        sourceMaps: false,
        presets: [ 'react', 'typescript' ],
        filename: 'demo.tsx',
    };
    const output = Babel.transform(code, options);

    let result = output.code || '';

    if (result) {
        result = result.replace('export function ', 'function ');

        result = result.replace(/import *({.*?}) *from ['"]react['"]/g, (v, a1, a2) => {
            return `const ${a1} = React`;
        });
    }

    //     return `
    //     const { useState } = React;
    // var __clone = v => v && typeof v === 'object' ? Array.isArray(v) ? [...v] : {
    // ...v
    // } : v;
    // function App() {
    // let current = '';
    // const [todo, __$todo] = useState([]),
    //     _$todo = v => (__$todo(__clone(todo)), v);
    // const addTodo = () => {
    //     _$todo(todo.push({
    //     content: current,
    //     done: false
    //     }));
    // };
    // const deleteItem = index => {
    //     _$todo(todo.splice(index, 1));
    // };
    //   return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    //     onInput: e => current = e.target.value
    //   }), " ", /*#__PURE__*/React.createElement("button", {
    //     onClick: addTodo
    //   }, "Add Todo"), todo.map((item, index) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    //     style: {
    //       'textDecoration': item.done ? 'line-through' : 'none'
    //     }
    //   }, index, ": ", item.content), /*#__PURE__*/React.createElement("button", {
    //     onClick: () => {
    //         item.done = !item.done;
    //     }
    //   }, item.done ? 'Undo' : 'Done'), /*#__PURE__*/React.createElement("button", {
    //     onClick: () => deleteItem(index)
    //   }, "Delete"))));
    // }
    // `;

    return result;
}

function parseVue (code: string) {
    if (!code)
        return {
            template: '',
            importCode: '',
            setup: '',
        };

    const result = code.match(/<template>([\s\S]*)<\/template>/);

    if (!result) {
        throw new Error('Template is Required');
    }

    const template = result[1];

    const jsResult = code.match(/<script.*?>([\s\S]*)<\/script>/);

    const importList: string[] = [ 'const {createApp} = Vue;' ];
    let js = '';
    if (jsResult) {
        js = jsResult[1];

        const importRes = js.matchAll(/import *({.*?}) *from ['"]vue['"];?/g);
        for (const item of importRes) {
            js = js.replace(item[0], '');
            importList.push(`const ${item[1]} = Vue;`);
        }

        const options = {
            sourceMaps: false,
            presets: [ 'typescript' ],
            filename: 'demo.vue.ts',
            ast: true,
        };
        const output = Babel.transform(js, options);

        const returnValues: string[] = [];
        // @ts-ignore
        const nodes: any[] = output.ast.program.body;
        for (const node of nodes) {
            if (node.type === 'VariableDeclaration') {
                for (const dec of node.declarations) {
                    returnValues.push(dec.id.name);
                }
            } else if (node.type === 'FunctionDeclaration') {
                returnValues.push(node.id.name);
            }
        }
        js += `\nreturn {${returnValues.join(', ')}}`;
    }


    return {
        template,
        importCode: importList.join('\n'),
        setup: js,
    };
}

function createReactIframeHTML (code: string) {
    return `
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<div id="app"></div>
<script>
    ${parseReact(code)}
    ReactDOM.render(
        React.createElement(App, null),
        document.getElementById('app')
    );
</script>
    `;
}

function createVueIframeHTML (code: string) {

    const { template, importCode, setup } = parseVue(code);

    return `
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<div id="app">
${template}
</div>
<script>
    ${importCode}
    createApp({
        setup() {
            ${setup}
        }
    }).mount('#app')
</script>
    `;
}

export function createIFrameSrc (code: string, id: string, isVue = false) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iframe runner</title>
    ${StyleText}
</head>
<body>
    <script>
        function postMsg(type, data=[]) {
            window.parent.postMessage({type, data, id: '${id}'});
        }
        console.log = (...args) => {
            postMsg('iframe_log', args);
        };
        console.clear = () => {
            postMsg('iframe_clear_log');
        };
        window.addEventListener('DOMContentLoaded', () => {
            postMsg('iframe_loaded');
        });
        window.addEventListener('click', ()=>{
            setTimeout(()=>{
                postMsg('refresh_height');
            }, 100)
        })
    </script>
    ${isVue ? createVueIframeHTML(code) : createReactIframeHTML(code)}
</body>
</html>`;
    const blob = new Blob([ html ], { type: 'text/html' });
    return URL.createObjectURL(blob);
}
export function copy (str: string) {
    let input = document.getElementById('_copy_input_') as any;
    if (!input) {
        input = document.createElement('textarea');
        input.setAttribute('type', 'text');
        input.setAttribute(
            'style',
            'height:10px;position:fixed;top:-100px;opacity:0;'
        );
        input.setAttribute('id', '_copy_input_');
        document.body.appendChild(input);
    }
    input.value = str;
    input.select();

    try {
        if (document.execCommand('Copy')) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};
export function countCodeSize(code: string){
    const textEncoder = new TextEncoder();
    const size = textEncoder.encode(code).length;
    if(size > 1024) return (size / 1024).toFixed(2)+' kb'
    return size+' byte';
}
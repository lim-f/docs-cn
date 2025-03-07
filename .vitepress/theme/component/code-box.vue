<script setup lang="ts">
import {createApp, onMounted, ref} from 'vue';
import {
    compileLim, copy, countCodeSize, 
    createIFrameSrc
} from '../utils/compiler';
import eveit from 'eveit'
import Playground from './playground.vue'

import hljs from 'highlight.js/lib/core';

const blockRef = ref();
const codeRef = ref();
const compileRef = ref();

let code = ref('');
let info = ref('');
let codeSize = ref('');
let compileCodeSize = ref('');
let iframeSrc = ref('');
let iframeRef = ref();
let id = ref('');


let compileCodeResult = '', resultCode = '';

const props = defineProps<{
    isVue?: boolean,
    name?: string,
}>();


let logs = ref([] as {msg: string, type: 'log'|'warn'}[]);

const pushLog = (args: any[], type: 'log'|'warn' = 'log')=>{
    logs.value.push({
        msg: args.map((item)=>{
            return typeof item === 'object' ? JSON.stringify(item): item
        }).join(' '),
        type,
    });
}

const mockConsole = {
    log(...args: any[]){pushLog(args);},
    clear(){logs.value = []},
    warn(...args: any[]){pushLog(args, 'warn')},
    info(...args: any[]){console.info(...args)},
}

let showCompileResult = ref(false);

let timer: any = null;

function setInfo(text: string) {
    info.value = text;

    clearTimeout(timer);
    timer = setTimeout(()=>{
        info.value = '';
    }, 2000)
}

let runCode = ()=>{};

function copyCode(){
    copy(code.value);
    setInfo('Copied successfully!');
}

function openInPlayground(){
    eveit.emit('playground-code', {
        name: props.name,
        code: code.value, 
        isVue: props.isVue
    })
}

function initIFrame(){
    if(document.getElementById('PlayGround')) return;
    const iframe = document.createElement('div');
    iframe.id = 'PlayGround';
    document.body.appendChild(iframe);
    createApp(Playground).mount('#PlayGround');
}

onMounted(async ()=>{

    id.value = `id_${Math.random().toString().substring(2)}`;

    initIFrame();

    const codeEle = blockRef.value.nextSibling;
    const codeDom = codeEle.querySelector('code');

    if(!codeDom) return;
    
    code.value = codeDom.textContent;

    codeRef.value.appendChild(codeEle);
    codeSize.value = countCodeSize(code.value);
    compileCodeResult = compileLim(code.value, props.isVue || false);
    resultCode = compileCodeResult.replace(/import *\{(.*?)\} *from *['"]alins((\-reactive)|(\-standalone))?['"]/g, 'const {$1} = window.Alins');

    runCode = () => {
        mockConsole.clear();
        iframeRef.value.contentWindow?.location.reload();
        setInfo('Refresh successfully!');
    }

    iframeSrc.value = createIFrameSrc(resultCode, id.value, props.isVue);

    const refreshHeight = ()=>{
        iframeRef.value.height = iframeRef.value.contentWindow.document.body.scrollHeight;
    }

    window.addEventListener('message', (e)=>{
        const data = e.data;
        if(data.id !== id.value) return;
        if(data.type === 'iframe_log'){
            mockConsole.log(...data.data);
        }else if(data.type === 'iframe_clear_log'){
            mockConsole.clear();
        }else if(data.type === 'iframe_loaded'){
            refreshHeight();
        }else if(data.type === 'refresh_height'){
            refreshHeight();
        }
    });

    const highlightedCode = hljs.highlight(
        compileCodeResult,
        { language: 'javascript' }
    );
    compileCodeSize.value = countCodeSize(compileCodeResult);
    compileRef.value.innerHTML = highlightedCode.value;
})
</script>

<template>
    <div class="code-block" ref="blockRef">
        <div style="position: relative;">
            <div ref="codeRef"></div>
            <span class="code-size">{{codeSize}}</span>
        </div>
        <div class="code-title">
            <span style="font-weight: bold;">{{ props.name || 'Sample' }} 
                <span @click="showCompileResult=!showCompileResult"
                     class="compiler-toggle">{{showCompileResult ? 'Hide':'Show'}} compile output</span>
            </span>
            <span style="color:#4c4">{{ info }}</span>
            <span class='editor-btns'>
                <i @click="openInPlayground" title="Open in Playground" class="ei-code"></i>
                <i @click="copyCode" title="Copy Code" class="ei-copy"></i>
                <i @click="runCode" title='Refresh Result' class="ei-refresh"></i>
            </span>
        </div>
        <div class="result-box">
            <iframe ref="iframeRef" :src="iframeSrc" frameborder="0"></iframe>
        </div>
        <div v-show="logs.length > 0" class="result-box console-result">
            <i title='Clear Console' class="ei-times" @click="logs=[]"></i>
            <div class="console-box">
                <div :class="'console-item '+item.type" v-for="item in logs">{{ item.msg }}</div>
            </div>
        </div>
        <div style="position: relative;" v-show="showCompileResult">
            <pre ref="compileRef" class="result-box compile-result"></pre>
            <span class="code-size">{{compileCodeSize}}</span>
        </div>
    </div>
</template>

<style lang="less">
.code-block {
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
    .code-size{
        right: 5px;
    }
    .code-title{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .editor-btns{
            display: flex;
            gap: 10px;
            padding-right: 5px;
            font-size: 18px;
            i{
                cursor: pointer;
                transition: color .1s linear;
                &:hover{
                    color: var(--vp-c-brand-light);
                }
            }
        }
        .compiler-toggle{
            color: var(--vp-c-brand-lighter);
            font-weight: normal;
            margin-left: 5px;
            text-decoration: underline;
            font-size: 13px;
            cursor: pointer;
            &:hover{
                color: var(--vp-c-brand);
            }
        }
    }
}
.result-box{
    position: relative;
    padding: 15px;
    background-color: #171717;
    overflow: auto;
    color: #eee;
    iframe{
        width: 100%;
        background-color: #171717;
    }
    button, input, select, textarea{
        margin: 5px;
        padding: 4px 8px;
        background-color: #222;
        border: none;
        border-radius: 1px;
        outline: none;
        color: #fff;
        border: 1px solid #666;
        border-radius: 5px;
    }
    button, select{
        cursor: pointer;
        &:hover {
            background-color: #333;
        }
    }
    button:active{
        background-color: #444;
    }
    &.compile-result, &.console-result{
        font-size: 14px;
        margin-top: 0;
        margin-bottom: 0;
        border-top: 1px solid #333;
    }
    &.console-result{
        position: relative;
        padding: 5px 0px;
        white-space: pre;
        .ei-times{
            font-size: 18px;
            position: absolute;
            cursor: pointer;
            top: 5px;
            right: 5px;
            &:hover{
                color: #f44;
            }
        }
        .console-box{
            width: 100%;
            overflow: auto;
            .console-item{
                font-size: 13px;
                line-height: 15px;
                color: #ccc;
                padding: 3px 15px;
                border-bottom: 1px solid #333;
                word-break: break-all;
                &:last-child{
                    border-color: transparent;
                }
                &.warn{
                    background-color: #322b08;
                }
            }
        }
    }
}
</style>

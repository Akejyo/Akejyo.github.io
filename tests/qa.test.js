import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { developmentEnabled } from '../src/development.js';

test('development requires an explicit flag; production environment wins',()=>{
  assert.equal(developmentEnabled(['node','server.js'],{}),false);
  assert.equal(developmentEnabled(['node','server.js','--development'],{}),true);
  assert.equal(developmentEnabled(['node','server.js','--development'],{NODE_ENV:'production'}),false);
});

async function launch(flag,mode){
  const code="import {once} from 'node:events'; const {server}=await import('./server.js'); if(!server.listening)await once(server,'listening'); console.log('TEST_PORT='+server.address().port);";
  const child=spawn(process.execPath,['--input-type=module','-e',code,...(flag?['--','--development']:[])],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:'0',NODE_ENV:mode},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let output='';const port=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{child.kill();reject(Error('Server timeout: '+output));},30000);child.once('error',error=>{clearTimeout(timer);reject(error);});child.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/TEST_PORT=(\d+)/);if(match){clearTimeout(timer);resolve(match[1]);}});child.stderr.on('data',chunk=>output+=chunk);});
  return {base:'http://127.0.0.1:'+port,stop:()=>child.kill()};
}
test('real HTTP server injects and serves QA only in development, including 404 and void',async()=>{
  for(const [flag,mode,enabled] of [[false,'development',false],[true,'development',true],[true,'production',false]]){
    const server=await launch(flag,mode);
    try{
      for(const route of ['/about?qa=true','/404','/void','/design-system']){
        const response=await fetch(server.base+route);assert.equal(response.status,route==='/404'?404:200);
        const html=await response.text();assert.equal(html.includes('name="northline-development"'),enabled);
        assert.equal(html.includes('/src/qa.js'),enabled);assert.equal(html.includes('/src/qa.css'),enabled);
      }
      for(const file of ['qa.js','qa.css','qa-arrival.js'])assert.equal((await fetch(server.base+'/src/'+file)).status,enabled?200:404,file);
      assert.equal((await fetch(server.base+'/src/development.js')).status,404);
      assert.equal((await fetch(server.base+'/src/environment.js')).status,200);
    }finally{server.stop();}
  }
});

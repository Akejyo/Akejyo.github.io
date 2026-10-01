import test from 'node:test';
import assert from 'node:assert/strict';
import { recordCover } from '../src/record-cover.js';
import { recordRow } from '../src/pages.js';

test('covers require explicit metadata and support imported CDN, fit, position and opt-out',()=>{
  assert.equal(recordCover({html:'<img src="/assets/forest.svg">'}),null);
  assert.equal(recordCover({cover:false,image:{path:'/assets/forest.svg'}}),null);
  assert.deepEqual(recordCover({cover:'/assets/forest.svg',coverFit:'contain',coverPosition:'right 30%'}),{src:'/assets/forest.svg',fit:'contain',position:'right 30%'});
  assert.equal(recordCover({importedFrom:'old.md',image:{path:'/img/diagram.png'}}).src,'https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/diagram.png');
  assert.equal(recordCover({cover:'javascript:alert(1)'}),null);
  assert.equal(recordCover({cover:'/assets/forest.svg',coverPosition:'center; color:red',coverFit:'bad'}).position,'center');
});
test('only Records opts into decorative covers; accessible links and coverless rows persist',()=>{
  const post={title:'Research record',category:'Research',description:'A description',number:'035',slug:'research',date:'2026-09-04',readingTime:4,cover:'/assets/forest.svg'};
  assert.doesNotMatch(recordRow(post),/record-ghost/);
  const row=recordRow(post,{ghost:true});
  assert.match(row,/class="record-ghost" aria-hidden="true"/);assert.match(row,/alt="" loading="lazy"/);
  assert.match(row,/<a href="\/records\/research">Research record<\/a>/);
  assert.doesNotMatch(row,/data-collapse|tabindex/);
  assert.doesNotMatch(recordRow({...post,cover:false},{ghost:true}),/has-ghost-cover|record-ghost/);
});

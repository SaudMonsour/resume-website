const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
function files(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? files(path.join(directory,entry.name)) : [path.join(directory,entry.name)]);
}
test('all delivered browser scripts parse and About navigation is removed', () => {
  for (const file of files(root).filter(file => /\.(?:html|js)$/.test(file))) {
    const text = fs.readFileSync(file,'utf8');
    if (file.endsWith('.js')) new vm.Script(text,{filename:file});
    else for (const match of text.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) if (!match[1].includes('application/ld+json')) new vm.Script(match[2],{filename:file});
  }
  for (const file of ['index.html','mobile.html']) assert.doesNotMatch(read(file), /href="#(?:m-)?about"|<section[^>]*id="(?:m-)?about"/);
});
test('shipped pages have resolvable local links and neutral template data', () => {
  for (const file of files(root).filter(file => file.endsWith('.html'))) {
    const text = fs.readFileSync(file,'utf8');
    assert.doesNotMatch(text,/saudalotaibi\.com|SaudMonsour|Saudi Aramco|King Saud University/);
    const markup = text.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
    for (const match of markup.matchAll(/(?:href|src)="([^"${}]+)"/g)) {
      const href = match[1];
      if (!href || /^(?:[a-z]+:|#|\/\/)/i.test(href)) continue;
      const resolved = path.resolve(path.dirname(file),href.split(/[?#]/)[0]);
      assert.ok(fs.existsSync(resolved), file + ' links to missing ' + href);
    }
  }
  const data = JSON.parse(read('my-data/portfolio_data.json'));
  for (const type of ['experience','projects','certs']) {
    assert.equal(new Set(data[type].map(item => String(item.id))).size,data[type].length);
  }
  assert.ok(data.resume.education.length);
});
test('journal builds for a changed identity/subpath, removes stale pages, and excludes drafts', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-template-'));
  try {
    fs.cpSync(root,temp,{recursive:true});
    const cfg = path.join(temp,'my-data','config.js');
    fs.writeFileSync(cfg,fs.readFileSync(cfg,'utf8').replaceAll('Jane Doe','Alex Example').replace('https://example.com','https://example.org/my-portfolio'));
    const dataPath = path.join(temp,'blog','articles.json');
    const posts = JSON.parse(fs.readFileSync(dataPath,'utf8'));
    posts[0].status = 'draft';
    fs.writeFileSync(dataPath,JSON.stringify(posts));
    const builder = path.join(temp,'scripts','build-blog.js');
    execFileSync(process.execPath,[builder]);
    const html = fs.readFileSync(path.join(temp,'blog','index.html'),'utf8');
    assert.match(html,/Alex Example/);
    assert.match(html,/https:\/\/example.org\/my-portfolio\/blog\/index.html/);
    assert.doesNotMatch(html,/Welcome to my journal/);
    assert.ok(!fs.existsSync(path.join(temp,'blog','articles','welcome-to-my-journal.html')));
    assert.match(fs.readFileSync(path.join(temp,'blog','articles','planning-a-small-project.html'),'utf8'),/\.\.\/figures\/project-flow.svg/);
    assert.match(fs.readFileSync(path.join(temp,'blog','feed.xml'),'utf8'),/https:\/\/example.org\/my-portfolio\/blog\/articles\/planning-a-small-project.html/);
    posts.push({...posts[1]});
    fs.writeFileSync(dataPath,JSON.stringify(posts));
    assert.throws(() => execFileSync(process.execPath,[builder],{stdio:'pipe'}),/duplicate article slug/);
  } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});

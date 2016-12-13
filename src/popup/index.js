require('./index.less');
import sites from './sites.handlebars';

window.onload = () => chrome.runtime.sendMessage({type: 'list'}, list => document.body.innerHTML = sites({list}));

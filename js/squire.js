/* Copyright © 2011 by Neil Jenkins. Licensed under the MIT license. */(function(a){"use strict";var b=!a.createTreeWalker;window.ie===9&&(b=!0),b||function(){var c=a.createElement("div"),d=a.createTextNode("");c.appendChild(d);var e=c.cloneNode(!0),f=c.cloneNode(!0),g=c.cloneNode(!0),h=a.createTreeWalker(c,1,function(a){return 1},!1);c.appendChild(e),c.appendChild(f),c.appendChild(g),h.currentNode=g,h.previousNode()!==f&&(b=!0)}();if(!b)return;var c={1:1,2:2,3:4,8:128,9:256,11:1024},d=1,e=function(a,b,c){this.root=this.currentNode=a,this.nodeType=b,this.filter=c};e.prototype.nextNode=function(){var a=this.currentNode,b=this.root,e=this.nodeType,f=this.filter,g;for(;;){g=a.firstChild;while(!g&&a){if(a===b)break;g=a.nextSibling,g||(a=a.parentNode)}if(!g)return null;if(c[g.nodeType]&e&&f(g)===d)return this.currentNode=g,g;a=g}},e.prototype.previousNode=function(){var a=this.currentNode,b=this.root,e=this.nodeType,f=this.filter,g;for(;;){if(a===b)return null;g=a.previousSibling;if(g)while(a=g.lastChild)g=a;else g=a.parentNode;if(!g)return null;if(c[g.nodeType]&e&&f(g)===d)return this.currentNode=g,g;a=g}},a.createTreeWalker=function(a,b,c){return new e(a,b,c)}})(document),function(){"use strict";var a=function(a,b){var c=a.prototype,d;for(d in b)c[d]=b[d]},b=function(a,b){var c=a.length;while(c--)if(!b(a[c]))return!1;return!0},c=function(){return!1},d=function(){return!0},e=/^(?:A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:FN|EL)|EM|HR|I(?:NPUT|MG|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:U[BP]|PAN|TRONG|AMP)|U)$/,f={BR:1,IMG:1,INPUT:1},g=function(a,b){var c=b.parentNode;return c&&c.replaceChild(a,b),a},h=1,i=3,j=1,k=1,l=3,m=function(a){return a.isBlock()?k:l},n=!!window.opera||!!window.ie;a(Node,{isInline:c,isBlock:c,isContainer:c,getPath:function(){var a=this.parentNode;return a?a.getPath():""},detach:function(){var a=this.parentNode;return a&&a.removeChild(this),this},replaceWith:function(a){return g(a,this),this},replaces:function(a){return g(this,a),this},nearest:function(a,b){var c=this.parentNode;return c?c.nearest(a,b):null},getPreviousBlock:function(){var a=this.ownerDocument,b=a.createTreeWalker(a.body,j,m,!1);return b.currentNode=this,b.previousNode()},getNextBlock:function(){var a=this.ownerDocument,b=a.createTreeWalker(a.body,j,m,!1);return b.currentNode=this,b.nextNode()},split:function(a,b){return a},mergeContainers:function(){}}),a(Text,{isInline:d,isLeaf:d,getLength:function(){return this.length},isLike:function(a){return a.nodeType===i},split:function(a,b){var c=this;return b(c)?a:c.parentNode.split(c.splitText(a),b)}}),a(Element,{isLeaf:function(){return!!f[this.nodeName]},isInline:function(){return e.test(this.nodeName)},isBlock:function(){return!this.isInline()&&b(this.childNodes,function(a){return a.isInline()})},isContainer:function(){return!this.isInline()&&!this.isBlock()},getLength:function(){return this.childNodes.length},getPath:function(){var a=this.nodeName;if(a==="BODY")return a;var b=this.parentNode.getPath(),c=this.id,d=this.className.trim();return b+=">"+a,c&&(b+="#"+c),d&&(d=d.split(/\s\s*/),d.sort(),b+=".",b+=d.join(".")),b},wraps:function(a){return g(this,a).appendChild(a),this},empty:function(){var a=this.ownerDocument.createDocumentFragment(),b=this.childNodes.length;while(b--)a.appendChild(this.firstChild);return a},is:function(a,b){if(this.nodeName!==a)return!1;var c;for(c in b)if(this.getAttribute(c)!==b[c])return!1;return!0},nearest:function(a,b){var c=this;do if(c.is(a,b))return c;while((c=c.parentNode)&&c.nodeType===h);return null},isLike:function(a){return a.nodeType===h&&a.nodeName===this.nodeName&&a.className===this.className&&a.style.cssText===this.style.cssText},mergeInlines:function(a){var b=this.childNodes,c=b.length,d=[],e,g,j;while(c--){e=b[c],g=c&&b[c-1];if(c&&e.isInline()&&e.isLike(g)&&!f[e.nodeName])a.startContainer===e&&(a.startContainer=g,a.startOffset+=g.getLength()),a.endContainer===e&&(a.endContainer=g,a.endOffset+=g.getLength()),a.startContainer===this&&(a.startOffset>c?a.startOffset-=1:a.startOffset===c&&(a.startContainer=g,a.startOffset=g.getLength())),a.endContainer===this&&(a.endOffset>c?a.endOffset-=1:a.endOffset===c&&(a.endContainer=g,a.endOffset=g.getLength())),e.detach(),e.nodeType===i?g.appendData(e.data):d.push(e.empty());else if(e.nodeType===h){j=d.length;while(j--)e.appendChild(d.pop());e.mergeInlines(a)}}},mergeWithBlock:function(a,b){var c=this,d=a,e,f,g;while(d.parentNode.childNodes.length===1)d=d.parentNode;d.detach(),f=c.childNodes.length,e=c.lastChild,e&&e.nodeName==="BR"&&(c.removeChild(e),f-=1),g={startContainer:c,startOffset:f,endContainer:c,endOffset:f},c.appendChild(a.empty()),c.mergeInlines(g),b.setStart(g.startContainer,g.startOffset),b.collapse(!0),window.opera&&(e=c.lastChild)&&e.nodeName==="BR"&&c.removeChild(e)},mergeContainers:function(){var a=this.previousSibling,b=this.firstChild;a&&a.isLike(this)&&a.isContainer()&&(a.appendChild(this.detach().empty()),b&&b.mergeContainers())},split:function(a,b){var c=this;typeof a=="number"&&(a=c.childNodes[a]);if(b(c))return a;var d=c.parentNode,e=c.cloneNode(!1),f;while(a)f=a.nextSibling,e.appendChild(a),a=f;return c.fixCursor(),e.fixCursor(),(f=c.nextSibling)?d.insertBefore(e,f):d.appendChild(e),d.split(e,b)},fixCursor:function(){var a=this,b=a.ownerDocument,c,d;a.nodeName==="BODY"&&(!(d=a.firstChild)||d.nodeName==="BR")&&(c=b.createElement("DIV"),d?a.replaceChild(c,d):a.appendChild(c),a=c,c=null);if(a.isInline())a.firstChild||(c=b.createTextNode(""));else if(n){while(!a.isLeaf()){d=a.firstChild;if(!d){c=b.createTextNode("");break}a=d}a.isLeaf()&&a.nodeType!==i&&a.parentNode.insertBefore(b.createTextNode(""),a)}else if(!a.textContent&&!a.querySelector("BR")){c=b.createElement("BR");while((d=a.lastElementChild)&&!d.isInline())a=d}return c&&a.appendChild(c),this}});if(function(){var a=document.createElement("div"),b=document.createTextNode("12");return a.appendChild(b),b.splitText(2),a.childNodes.length!==2}())Text.prototype.splitText=function(a){var b=this.ownerDocument.createTextNode(this.data.slice(a)),c=this.nextSibling,d=this.parentNode,e=this.length-a;return c?d.insertBefore(b,c):d.appendChild(b),e&&this.deleteData(a,e),b}}(),function(){"use strict";var a=function(a,b){var c=a.prototype,d;for(d in b)c[d]=b[d]},b=Array.prototype.indexOf,c=1,d=3,e=0,f=1,g=2,h=3,i=function(a,b){var d=a.childNodes;while(b&&a.nodeType===c)a=d[b-1],d=a.childNodes,b=d.length;return a},j=function(a,b){if(a.nodeType===c){var d=a.childNodes;if(b<d.length)a=d[b];else{while(a&&!a.nextSibling)a=a.parentNode;a&&(a=a.nextSibling)}}return a};a(Range,{_insertNode:function(a){var c=this.startContainer,e=this.startOffset,f=this.endContainer,g=this.endOffset,h,i,j,k;return c.nodeType===d?(h=c.parentNode,i=h.childNodes,e&&(k=c.splitText(e),f===c?(g-=e,f=k):f===h&&(g+=1),c=k),e=b.call(i,c),c=h):i=c.childNodes,j=i.length,e===j?c.appendChild(a):c.insertBefore(a,i[e]),c===f&&(g+=i.length-j),this.setStart(c,e),this.setEnd(f,g),this},_extractContents:function(a){var c=this.startContainer,e=this.startOffset,f=this.endContainer,g=this.endOffset;a||(a=this.commonAncestorContainer),a.nodeType===d&&(a=a.parentNode);var h=function(b){return b===a},i=f.split(g,h)||null,j=c.split(e,h),k=a.ownerDocument.createDocumentFragment(),l;while(j!==i)l=j.nextSibling,k.appendChild(j),j=l;return this.setStart(a,i?b.call(a.childNodes,i):a.childNodes.length),this.collapse(!0),a.fixCursor(),k},_deleteContents:function(){this.moveBoundariesUpTree(),this._extractContents();var a=this.getStartBlock(),b=this.getEndBlock();a&&b&&a!==b&&a.mergeWithBlock(b,this);var c=this.endContainer.ownerDocument.body,e=c.firstChild;if(!e||e.nodeName==="BR")c.fixCursor(),this.selectNodeContents(c.firstChild);var f=this.collapsed;return this.moveBoundariesDownTree(),f&&this.collapse(this.startContainer.nodeType===d),this},insertTreeFragment:function(a){var b=!0,d=a.childNodes,e=d.length;while(e--)if(!d[e].isInline()){b=!1;break}this.collapsed||this._deleteContents(),this.moveBoundariesDownTree();if(b)this._insertNode(a),this.collapse(!1);else{var f=this.startContainer.split(this.startOffset,function(a){return a.nodeName==="BODY"}),g=f.previousSibling,h=g,i=h.childNodes.length,j=f,k=0,l=f.parentNode,m,n;while((m=h.lastChild)&&m.nodeType===c&&m.nodeName!=="BR")h=m,i=h.childNodes.length;while((m=j.firstChild)&&m.nodeType===c&&m.nodeName!=="BR")j=m;while((m=a.firstChild)&&m.isInline())h.appendChild(m);while((m=a.lastChild)&&m.isInline())j.insertBefore(m,j.firstChild),k+=1;n=a;while(n=n.getNextBlock())n.fixCursor();l.insertBefore(a,f),f.mergeContainers(),g.nextSibling.mergeContainers(),this.setStart(h,i),this.setEnd(j,k)}},containsNode:function(a,b){var c=this,d=a.ownerDocument.createRange();d.selectNode(a);if(b){var i=c.compareBoundaryPoints(h,d)>-1,j=c.compareBoundaryPoints(f,d)<1;return!i&&!j}var k=c.compareBoundaryPoints(e,d)<1,l=c.compareBoundaryPoints(g,d)>-1;return k&&l},moveBoundariesDownTree:function(){var a=this.startContainer,b=this.startOffset,c=this.endContainer,e=this.endOffset,f;while(a.nodeType!==d){f=a.childNodes[b];if(!f||f.nodeName==="BR")break;a=f,b=0}if(e)while(c.nodeType!==d){f=c.childNodes[e-1];if(!f||f.nodeName==="BR")break;c=f,e=c.getLength()}else while(c.nodeType!==d){f=c.firstChild;if(!f||f.nodeName==="BR")break;c=f}return this.collapsed?(this.setStart(c,e),this.setEnd(a,b)):(this.setStart(a,b),this.setEnd(c,e)),this},moveBoundariesUpTree:function(a){var c=this.startContainer,d=this.startOffset,e=this.endContainer,f=this.endOffset,g;a||(a=this.commonAncestorContainer);while(c!==a&&!d)g=c.parentNode,d=b.call(g.childNodes,c),c=g;while(e!==a&&f===e.getLength())g=e.parentNode,f=b.call(g.childNodes,e)+1,e=g;return this.setStart(c,d),this.setEnd(e,f),this},getStartBlock:function(){var a=this.startContainer,b;return a.isInline()?b=a.getPreviousBlock():a.isBlock()?b=a:(b=i(a,this.startOffset),b=b.getNextBlock()),b&&this.containsNode(b,!0)?b:null},getEndBlock:function(){var a=this.endContainer,b,c;if(a.isInline())b=a.getPreviousBlock();else if(a.isBlock())b=a;else{b=j(a,this.endOffset);if(!b){b=a.ownerDocument.body;while(c=b.lastChild)b=c}b=b.getPreviousBlock()}return b&&this.containsNode(b,!0)?b:null},startsAtBlockBoundary:function(){var a=this.startContainer,c=this.startOffset,d,e;while(a.isInline()){if(c)return!1;d=a.parentNode,c=b.call(d.childNodes,a),a=d}while(c&&(e=a.childNodes[c-1])&&(e.data===""||e.nodeName==="BR"))c-=1;return!c},endsAtBlockBoundary:function(){var a=this.endContainer,c=this.endOffset,d=a.getLength(),e,f;while(a.isInline()){if(c!==d)return!1;e=a.parentNode,c=b.call(e.childNodes,a)+1,a=e,d=a.childNodes.length}while(c<d&&(f=a.childNodes[c])&&(f.data===""||f.nodeName==="BR"))c+=1;return c===d},expandToBlockBoundaries:function(){var a=this.getStartBlock(),c=this.getEndBlock(),d;return a&&c&&(d=a.parentNode,this.setStart(d,b.call(d.childNodes,a)),d=c.parentNode,this.setEnd(d,b.call(d.childNodes,c)+1)),this}})}(),document.addEventListener("DOMContentLoaded",function(){"use strict";var a=2,b=1,c=3,d=4,e=1,f=1,g=3,h=document,i=h.defaultView,j=h.body,k=!!i.opera,l=k||!!i.ie,m=function(a,b,c){var d=h.createElement(a),e,f,g;b instanceof Array&&(c=b,b=null);if(b)for(e in b)d.setAttribute(e,b[e]);if(c)for(f=0,g=c.length;f<g;f+=1)d.appendChild(c[f]);return d},n={},o=function(a,b){var c=n[a]||(n[a]=[]);c.push(b)},p=function(a,b){var c=n[a],d;if(c){d=c.length;while(d--)c[d]===b&&c.splice(d,1)}},q=function(a,b){var c=n[a],d,e;if(c){typeof b!="object"&&(b={data:b}),b.type!==a&&(b.type=a),d=c.length;while(d--)e=c[d],e.handleEvent?e.handleEvent(b):e(b)}},r=function(a){q(a.type,a)},s=function(a,b,c,d){if(a instanceof Range)return a.cloneRange();var e=h.createRange();return e.setStart(a,b),c?e.setEnd(c,d):e.setEnd(a,b),e},t=i.getSelection(),u=null,v=function(){return t.rangeCount&&(u=t.getRangeAt(0).cloneRange()),u};i.ie&&i.addEventListener("beforedeactivate",v,!0);var w,x,y="",z=function(){var a=t.anchorNode,b=t.focusNode,c;if(a!==w||b!==x)w=a,x=b,c=a&&b?a===b?b.getPath():"(selection)":"",y!==c&&(y=c,q("pathChange",c)),a!==b&&q("select")};j.addEventListener("keyup",z,!1),j.addEventListener("mouseup",z,!1);var A=function(a){a&&(t.removeAllRanges(),t.addRange(a)),z()},B=function(){i.focus()},C=function(){i.blur()};i.addEventListener("focus",r,!1),i.addEventListener("blur",r,!1);var D=function(){return j.innerHTML},E=function(a){j.innerHTML=a,j.fixCursor()},F=function(a,b){b||(b=v()),b.collapse(!0),b._insertNode(a),b.setStartAfter(a),A(b)},G="ss-"+Date.now()+"-"+Math.random(),H="es-"+Date.now()+"-"+Math.random(),I=function(b){var c=m("INPUT",{id:G,type:"hidden"}),d=m("INPUT",{id:H,type:"hidden"}),e;b._insertNode(c),b.collapse(!1),b._insertNode(d),c.compareDocumentPosition(d)&a&&(c.id=H,d.id=G,e=c,c=d,d=e),b.setStartAfter(c),b.setEndBefore(d)},J=Array.prototype.indexOf,K=function(a){var b=h.getElementById(G),c=h.getElementById(H);if(b&&c){var d=b.parentNode,e=c.parentNode,f={startContainer:d,endContainer:e,startOffset:J.call(d.childNodes,b),endOffset:J.call(e.childNodes,c)};d===e&&(f.endOffset-=1),b.detach(),c.detach(),d.mergeInlines(f),d!==e&&e.mergeInlines(f),a||(a=h.createRange()),a.setStart(f.startContainer,f.startOffset),a.setEnd(f.endContainer,f.endOffset),a.collapsed||a.moveBoundariesDownTree()}return a},L,M,N,O,P=function(){O&&(O=!1,q("undoStateChange",{canUndo:!0,canRedo:!1})),q("input")};j.addEventListener("DOMCharacterDataModified",P,!1);var Q=function(a){O||(L+=1,L<N&&(M.length=N=L),a&&I(a),M[L]=D(),N+=1,O=!0)},R=function(){if(L!==0||!O){Q(v()),L-=1,E(M[L]);var a=K();a&&A(a),O=!0,q("undoStateChange",{canUndo:L!==0,canRedo:!0}),q("input")}},S=function(){if(L+1<N&&O){L+=1,E(M[L]);var a=K();a&&A(a),q("undoStateChange",{canUndo:!0,canRedo:L+1<N}),q("input")}},T=function(a,b,e){a=a.toUpperCase(),b||(b={});if(!e&&!(e=v()))return!1;var i=e.commonAncestorContainer,j,k;if(i.nearest(a,b))return!0;if(i.nodeType===c)return!1;j=h.createTreeWalker(i,d,function(a){return e.containsNode(a,!0)?f:g},!1);while(k=j.nextNode())if(!k.nearest(a,b))return!1;return!0},U=function(a,b,e){if(e.collapsed){var i=m(a,b).fixCursor();e._insertNode(i),e.selectNodeContents(i)}else{var j=h.createTreeWalker(e.commonAncestorContainer,d,function(a){return e.containsNode(a,!0)?f:g},!1),k,l,n=0,o=0,p=j.currentNode=e.startContainer,q;p.nodeType!==c&&(p=j.nextNode());do q=!p.nearest(a,b),p===e.endContainer&&(q&&p.length>e.endOffset?p.splitText(e.endOffset):o=e.endOffset),p===e.startContainer&&(q&&e.startOffset?p=p.splitText(e.startOffset):n=e.startOffset),q&&(m(a,b).wraps(p),o=p.length),l=p,k||(k=l);while(p=j.nextNode());e=s(k,n,l,o)}return e},V=function(a,b,d){I(d);var e=d.commonAncestorContainer;while(e.isInline())e=e.parentNode;var f=d.startContainer,g=d.startOffset,h=d.endContainer,i=d.endOffset,j=[],k=function n(a,b){if(d.containsNode(a,!1))return;var e=a.nodeType===c,k,l;if(!d.containsNode(a,!0)){e&&!a.length?a.detach():a.nodeName!=="INPUT"&&j.push([b,a]);return}if(e)a===h&&i!==a.length&&j.push([b,a.splitText(i)]),a===f&&g&&(a.splitText(g),j.push([b,a]));else for(k=a.firstChild;k;k=l)l=k.nextSibling,n(k,b)},l=Array.prototype.filter.call(e.getElementsByTagName(a),function(c){return d.containsNode(c,!0)&&c.is(a,b)});l.forEach(function(a){k(a,a)}),j.forEach(function(a){a[0].cloneNode(!1).wraps(a[1])}),l.forEach(function(a){a.replaceWith(a.empty())}),d=K();var m={startContainer:d.startContainer,startOffset:d.startOffset,endContainer:d.endContainer,endOffset:d.endOffset};return e.mergeInlines(m),d.setStart(m.startContainer,m.startOffset),d.setEnd(m.endContainer,m.endOffset),d},W=function(a,b,c){if(!c&&!(c=v()))return;Q(c),K(c),b&&(c=V(b.tag.toUpperCase(),b.attributes||{},c)),a&&(c=U(a.tag.toUpperCase(),a.attributes||{},c)),A(c),P()},X=function(a,b){if(!b&&!(b=v()))return;Q(b),K(b);var c=b.commonAncestorContainer,d=h.createTreeWalker(c,e,function(a){return b.containsNode(a,!0)&&a.isBlock()?f:g},!1),i;while(i=d.nextNode())a(i);P()},Y=function(a,b){if(!b&&!(b=v()))return;k||j.setAttribute("contenteditable","false"),O?I(b):Q(b),b.expandToBlockBoundaries(),b.moveBoundariesUpTree(j);var c=b._extractContents(j);b._insertNode(a(c)),b.endOffset<b.endContainer.childNodes.length&&b.endContainer.childNodes[b.endOffset].mergeContainers(),b.startContainer.childNodes[b.startOffset].mergeContainers(),k||j.setAttribute("contenteditable","true"),A(K()),P()},Z=function(a){return m("BLOCKQUOTE",[a])},$=function(a){var b=a.querySelectorAll("blockquote");return Array.prototype.filter.call(b,function(a){return!a.parentNode.nearest("BLOCKQUOTE")}).forEach(function(a){a.replaceWith(a.empty())}),a},_=function bs(a,b){var c,d,e,f,g,h;for(c=0,d=a.length;c<d;c+=1)e=a[c],f=e.nodeName,e.isBlock()?f!=="LI"&&(h=m("LI",[e.empty()]),e.parentNode.nodeName===b?e.replaceWith(h):(g=e.previousSibling)&&g.nodeName===b?(g.appendChild(h),e.detach(),c-=1,d-=1):e.replaceWith(m(b,[h]))):e.isContainer()&&(f!==b&&/^[DOU]L$/.test(f)?e.replaceWith(m(b,[e.empty()])):bs(e.childNodes,b))},ba=function(a){return _(a.childNodes,"UL"),a},bb=function(a){return _(a.childNodes,"OL"),a},bc=function(a){var b=a.querySelectorAll("UL, OL");return Array.prototype.filter.call(b,function(a){return!a.parentNode.nearest("UL")&&!a.parentNode.nearest("OL")}).forEach(function(a){var b=a.empty(),c=b.childNodes,d=c.length,e;while(d--)e=c[d],e.nodeName==="LI"&&b.replaceChild(m("DIV",[e.empty()]),e);a.replaceWith(b)}),a},bd=/^A(?:DDRESS|RTICLE|SIDE)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|OOTER)|H[1-6]|HEADER|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|UL$/,be={SPAN:function(a,b){var c=a.style,d;return c.fontWeight&&/bold/i.test(c.fontWeight)&&(d=m("B"),b.appendChild(d),b=d),c.fontStyle&&c.fontStyle.toLowerCase()==="italic"&&(d=m("I"),b.appendChild(d),b=d),c.fontFamily&&(d=m("SPAN",{"class":"font",style:"font-family:"+c.fontFamily}),b.appendChild(d),b=d),c.fontSize&&(d=m("SPAN",{"class":"size",style:"font-size:"+c.fontSize}),b.appendChild(d),b=d),b},A:function(a,b){var c=m("a",{href:a.href});return b.appendChild(c),c},STRONG:function(a,b){var c=m("B");return b.appendChild(c),c},EM:function(a,b){var c=m("I");return b.appendChild(c),c},"#text":function(a,b){var c=a.data;return/\S/.test(c)&&b.appendChild(h.createTextNode(c)),b}},bf=function(a,b,c){b||(b=h.createDocumentFragment());var d=a.childNodes,e,f,g,i,j,k,l;for(e=0,f=d.length;e<f;e+=1){g=d[e],i=g.nodeName,j=be[i],l=b;if(j)l=j(g,b),i==="BR"&&(b=l);else if(bd.test(i)||g.isInline())l=g.cloneNode(!1),!c&&l.style.cssText&&l.removeAttribute("style"),b.appendChild(l);g.childNodes.length&&bf(g,l,c)}return b},bg=function(a){var b=a.querySelectorAll("BR"),c=b.length,d,e,f,g,h,i=function(a){return e?!0:(a.isInline()||(e=!0),!1)};while(c--){d=b[c];if(d.nextSibling&&d.previousSibling){e=!1,f=d.parentNode.split(d,i);if(f.isInline()){g=m("DIV"),f.parentNode.insertBefore(g,f);do h=f.nextSibling,g.appendChild(f),f=h;while(f&&f.isInline())}}d.detach()}},bh=function(a,b){var c=a.querySelectorAll(b),d,e,f,g;for(d=1,e=c.length;d<e;d+=1)f=c[d],g=f.previousSibling,g&&g.nodeName===b&&g.appendChild(f.detach().empty());return a},bi=function(a,b){var c=a.childNodes,d=null,e,f,g;for(e=0,f=c.length;e<f;e+=1)g=c[e],g.isInline()?(d||(d=m(b)),d.appendChild(g),e-=1,f-=1):d&&(a.insertBefore(d,g),d=null,e+=1,f+=1);return d&&a.appendChild(d),a};h.addEventListener("cut",function(){setTimeout(function(){j.fixCursor()},0)}),h.addEventListener("paste",function(){var a=v(),b=a.startContainer,c=a.startOffset,d=a.endContainer,e=a.endOffset,f=m("DIV",{style:"position: absolute; overflow: hidden;top: -100px; left: -100px; width: 1px; height: 1px;"});j.appendChild(f),a.selectNodeContents(f),A(a),setTimeout(function(){var g=bf(f.detach(),null,!1);bg(g),a.setStart(b,c),a.setEnd(d,e),a.insertTreeFragment(g),P(),a.collapse(!1),A(a)},0)},!1);var bj={8:"backspace",9:"tab",13:"enter",32:"space",46:"delete"},bk=function(a){return function(b){b.preventDefault(),a()}},bl=function(a){return function(b){b.preventDefault();var c=v();T(a,null,c)?W(null,{tag:a},c):W({tag:a},null,c)}},bm={H1:"DIV",H2:"DIV",H3:"DIV",H4:"DIV",H5:"DIV",H6:"DIV",P:"DIV"},bn={tab:function(a){a.preventDefault()},enter:function(a){a.preventDefault();var d=v();if(!d)return;Q(d),K(d),d.collapsed||d._deleteContents();var e=d.startContainer,f=d.startOffset,g=d.getStartBlock(),h=g?g.nodeName:"DIV",i=bm[h],l;if(!g){d._insertNode(m("BR")),d.collapse(!1),A(d),P();return}if(!g.textContent){if(g.nearest("UL"))return Y(bc,d);if(g.nearest("BLOCKQUOTE"))return Y($,d)}l=e.split(f,function(a){return a===g.parentNode||a===j}),i&&(g=m(i),g.replaces(l).appendChild(l.empty()),l=g);while(l.nodeType===b){var n=l.firstChild,o;while(n&&n.nodeType===c&&!n.data){o=n.nextSibling;if(!o||o.nodeName==="BR")break;n.detach(),n=o}if(!n||n.nodeName==="BR"||n.nodeType===c&&!k)break;l=n}A(s(l,0)),P()},backspace:function(a){var b=v();if(!b.collapsed)a.preventDefault(),b._deleteContents(),A(b);else if(b.startsAtBlockBoundary()){a.preventDefault();var c=b.getStartBlock(),d=c.getPreviousBlock();if(d)d.mergeWithBlock(c,b),A(b);else{if(c.nearest("UL"))return Y(bc,b);if(c.nearest("BLOCKQUOTE"))return Y($,b);A(b)}}},"delete":function(a){var b=v();if(!b.collapsed)a.preventDefault(),b._deleteContents(),A(b);else if(b.endsAtBlockBoundary()){a.preventDefault();var c=b.getStartBlock(),d=c.getNextBlock();d&&(c.mergeWithBlock(d,b),A(b))}},space:function(){var a=v();Q(a),K(a),A(a)},"ctrl-b":bl("B"),"ctrl-i":bl("I"),"ctrl-u":bl("U"),"ctrl-y":bk(S),"ctrl-z":bk(R),"ctrl-shift-z":bk(S)};j.addEventListener("keydown",function(a){var b=a.keyCode||a.which,c=bj[b]||String.fromCharCode(b).toLowerCase(),d="";111<b&&b<124&&(c="f"+(b-111)),a.altKey&&(d+="alt-");if(a.ctrlKey||a.metaKey)d+="ctrl-";a.shiftKey&&(d+="shift-"),c=d+c,bn[c]?bn[c](a):q("keydown",a)},!1),j.addEventListener("keypress",r,!1),j.addEventListener("keyup",r,!1);var bo=/<style[^>]*>([\s\S]*?)<\/style>/gi,bp=function(a){return function(){return a.apply(null,arguments),this}},bq=function(a,b,c){return function(){return a(b,c),B(),this}};i.editor={addEventListener:bp(o),removeEventListener:bp(p),focus:bp(B),blur:bp(C),getDocument:function(){return h},getHTML:function(){var a=[],b,c,d,e;if(l){b=j;while(b=b.getNextBlock())!b.textContent&&!b.querySelector("BR")&&(c=m("BR"),b.appendChild(c),a.push(c))}d=D();if(l){e=a.length;while(e--)a[e].detach()}return d},setHTML:function(a){var b=[];bo.lastIndex=0,a=a.replace(bo,function(a,c){return b.push(c.replace(/<!--|-->/g,"")),""});var c=h.createDocumentFragment(),d=m("DIV"),e,f,g,i;d.innerHTML=a,bf(d,c,!0),bg(c),bh(c,"BLOCKQUOTE"),bi(c,"DIV");var k=c;while(k=k.getNextBlock())k.fixCursor();while(f=j.lastChild)j.removeChild(f);var l=h.documentElement.firstChild;for(i=0,g=b.length;i<g;i+=1){var n=m("STYLE",{type:"text/css"});n.styleSheet?(l.appendChild(n),n.styleSheet.cssText=b[i]):(n.appendChild(h.createTextNode(b[i])),l.appendChild(n))}j.appendChild(c),j.fixCursor(),L=-1,M=[],N=0,O=!1;var o=s(j.firstChild,0);return Q(o),A(K(o)),this},insertImage:function(a){var b=m("IMG",{src:a});return F(b),b},getPath:function(){return y},getSelection:v,setSelection:bp(A),undo:bp(R),redo:bp(S),hasFormat:bp(T),changeFormat:bp(W),bold:bq(W,{tag:"B"}),italic:bq(W,{tag:"I"}),underline:bq(W,{tag:"U"}),removeBold:bq(W,null,{tag:"B"}),removeItalic:bq(W,null,{tag:"I"}),removeUnderline:bq(W,null,{tag:"U"}),makeLink:function(a){return W({tag:"A",attributes:{href:a}},{tag:"A"}),B(),this},setFontFace:function(a){return W({tag:"SPAN",attributes:{"class":"font",style:"font-family: "+a+", sans-serif;"}},{tag:"SPAN","class":"font"}),B(),this},setFontSize:function(a){return W({tag:"SPAN",attributes:{"class":"size",style:"font-size: "+(typeof a=="number"?a+"px":a)}},{tag:"SPAN","class":"size"}),B(),this},setTextAlignment:function(a){return X(function(b){b.style.textAlign=a}),B(),this},modifyBlocks:bp(Y),incQuoteLevel:bq(Y,Z),decQuoteLevel:bq(Y,$),makeUnorderedList:bq(Y,ba),makeOrderedList:bq(Y,bb),removeList:bq(Y,bc)},j.setAttribute("contenteditable","true"),i.editor.setHTML("")},!1);
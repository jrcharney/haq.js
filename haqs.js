/* File: haqs.js
 * @author: Jason Charney (jrcharney@gmail.com)
 * @version: 0.0.1
 * @see TODO.md for a list of TODO items and other things that probably should be done.
 */
var lib = {
  "query" : {
    "qs"     : parent => (query,all) => lib.info.isS(parent) ? lib.query.qs(lib.query.qs()(parent))(query,all) : (parent||document)[`querySelector${(all||false)?"All":""}`](query),
    "qa"     : parent => (query,all) => ao      => lib.edit.aa(lib.query.qs(parent)(query,all))(ao),
    "qattrs" : parent => (query,all) => ao      => lib.edit.attrs(lib.query.qs(parent)(query,all))(ao),
    "qcss"   : parent => (query,all) => co      => lib.edit.css(lib.query.qs(parent)(query,all))(co),
    "qon"    : parent => (query,all) => eo      => lib.edit.on(lib.query.qs(parent)(query,all))(eo),
    "qh"     : parent => (query,all) => content => lib.edit.html(lib.query.qs(parent)(query,all))(content),
    "qhtml"  : parent => (query,all) => text    => lib.content.html(lib.query.qs(parent)(query,all))(text),
    "qtext"  : parent => (query,all) => text    => lib.content.text(lib.query.qs(parent)(query,all))(text),
    "qac"    : parent => (query,all) => child   => lib.content.ac(lib.query.qs(parent)(query,all))(child)
    // qoff
  },
  "info" : {
    "cn"  : el => el.constructor.name,
    "is"  : el => type => typeof(el) === type,
    "isU" : el => el === undefined,
    "isA" : el => Array.isArray(el),
    "isO" : el => lib.info.is(el)("object"),
    "isS" : el => lib.info.is(el)("string"),
    "isN" : el => lib.info.is(el)("number"),
    "isF" : el => lib.info.is(el)("function"),
    "isB" : el => lib.info.is(el)("boolean"),
    // Who else am I forgetting?
  },
  "array" : {
    "oem" : o => cb => Object.entries(o).map(cb),
    "afm" : o => cb => Array.from(o).map(cb)
  },
  "math" : {
    "clamp" : (low,high) => t => Math.max(low,Math.min(high,t)),
    "rando" : (low,high,inclusiveMin) => {
	    let min = Math.ceil(low);
	    let max = Math.floor(high);
      let im  = (inclusiveMin||false) ? 1 : 0;
	    return Math.floor(Math.random() * (max - min + im)) + min;
    }
  },
  "create" : {
    "qce" : tag => document.createElement(tag),
    "ce" : tag => ao => {
      /* TODO: Extract id, class, or other attributes from tag string. */
      let el = lib.create.qce(tag);
      /* TODO: You may want to Object.assign() here to merge any previous entries */
      if(!lib.info.isU(ao))
        lib.edit.aa(el)(ao);
      return el;
    }
  },
  "edit" : {    
    "aa" : el => ao => {  // formerly "attrs"
      if(lib.info.isO(ao)){
        lib.array.oem(ao)(([k,v]) => {
          if(k === "html")
            lib.edit.html(el)(v);
          else if(["attrs","css","on"].includes(k) && lib.info.isO(v))
            lib.edit[k](el)(v);
          else  // if(lib.info.is(v)("string"))
            lib.attr.attr(el)(k,v);
        });
      }
      return el;
    },
    "html"  : el => txt => {
      if(txt instanceof NodeList)
        lib.array.afm(txt)(child => lib.content.ac(el)(child));
      else if(lib.info.isA(txt))
        txt.map(child => lib.content.ac(el)(child));
      else if(lib.info.isS(txt))
        lib.content.html(el)(txt);
      return el;
    },
    "attrs"  : el => ao => {
      if(lib.info.isO(ao))
        lib.array.oem(ao)(([name,val]) => lib.attr.attr(el)(name,val));
      return el;
    },
    "css"   : el => co => {
      if(lib.info.isO(co))
        lib.array.oem(co)(([prop,val]) => lib.css.css(el)(prop,val));
      return el;
    },
    "on"    : el => eo => {
      if(lib.info.isO(eo))
        lib.array.oem(eo)(([evt,cb]) => lib.event.on(evt)(el)(cb));
      return el;
    }
  },
  // Set and get attributes
  "attr" : {
    "attr"   : el => (name,val) => lib.info.isU(val) ? lib.attr.get(el)(name) : lib.attr.set(el)(name,val),
    "get"    : el => name => el.getAttribute(name),
    "set"    : el => (name,val) => el.setAttribute(name,val),
    "has"    : el => name => el.hasAttribute(name),
    "add"    : el => name => el.setAttribute(name,""),
    "del"    : el => name => el.removeAttribute(name),
    "toggle" : el => name => !lib.attr.has(el)(name) ? lib.attr.add(el)(name) : lib.attr.del(el)(name)  
  },
  // property states
  "prop" : {
    "checked"  : el => lib.attr.has(el)("checked"),
    "disabled" : el => lib.attr.has(el)("disabled")
  },
  // add and remove events
  "event" : {
    "on"  : evt => el => (cb,cap) => el.addEventListener(evt,cb,(cap||false)),
    "off" : evt => el => (cb,cap) => el.removeEventListener(evt,cb,(cap||false))
  },
  // set and get css attributes
  "css" : {
    "css" : el => (prop,val,imp) => lib.info.isU(val) ? lib.css.get(el)(prop) : lib.css.set(el)(prop,val,imp),
    "get" : el => prop => el.style.getPropertyValue(prop),
    "set" : el => (prop,val,imp) => el.style.setProperty(prop,val,(imp||false)?"important":"")
  },
  // add conent
  "content" : {
    "text" : el => val => lib.info.isU(val) ? el.innerText : (el.innerText = val),
    "html" : el => val => lib.info.isU(val) ? el.innerHTML : (el.innerHTML = val),
    "ac"   : parent => child => (parent||document.body).appendChild(child)
  }
}

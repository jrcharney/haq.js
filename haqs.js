/* File: haqs.js
 * @author: Jason Charney (jrcharney@gmail.com)
 * @version: 0.0.1
 * @see TODO.md for a list of TODO items and other things that probably should be done.
 */
var lib = {
  // Query directive: Find and do stuff
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
  // Information directive: Get more info about stuff
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
  // Array directive: Common array tasks simplified
  "array" : {
    "oem" : o => cb => Object.entries(o).map(cb),
    "afm" : o => cb => Array.from(o).map(cb)
  },
  // Math directive: The stuff ES6+ forgot
  "math" : {
    "clamp" : (low,high) => t => Math.max(low,Math.min(high,t)),
    "rando" : (low,high,inclusiveMin) => {
	    let min = Math.ceil(low);
	    let max = Math.floor(high);
      let im  = (inclusiveMin||false) ? 1 : 0;
	    return Math.floor(Math.random() * (max - min + im)) + min;
    }
  },
  // Regular Expression directive: common patterns
  // NOTE: ALWAYS quote your values
  // TODO: Do not allow spaces in the attrs RE!
  "re" : {
    "pattern" : {
      "tag"     : /^\w+/g,
      "attrs"   : /\[\w+=["']?\w+["']?\]/g,
      "id"      : /#\w+/g,
      "classes" : /\.[\w]+/g
    },
    "match" : {
      "tag"     : s => s.match(lib.re.pattern.tag),
      "attrs"   : s => s.match(lib.re.pattern.attrs),
      "id"      : s => s.match(lib.re.pattern.id),
      "classes" : s => s.match(lib.re.pattern.classes)
    },
    "assign" : {
      "tag"     : a => lib.create.qce(a[0]),
      "attrs"   : a => Object.fromEntries(a.map(ta => ta.replace(/\[(\w+)=["']?(\w+)["']?\]/,"$1;$2").split(";"))),
      "id"      : a => a[0].slice(1),                           // slice removes the "#" at the beginning of the string.
      "classes" : a => a.map(cl => cl = cl.slice(1)).join(" "), // slice removes the "." at the beginning of the string.
    }
  },
  // Create directive: create new things
  "create" : {
    // Quick Create Element: No attributes, just do it.
    // TODO: I may consider retiring this function
    "qce" : tag => document.createElement(tag),
    // ce : Create Element
    // ce uses re to extract any other attributes from the tag
    "ce" : tag => ao => {
      // TODO: remove spaces from tag (there shouldn't be any)
      // TODO: Throw exception if the tag is not first or defined
      let el = lib.re.assign.tag(tag);
      ao = ao || {};        // Define ao as an empty object if it is not defined.
      var tagattrs = {};    // Check to see if our tag declaration had any attributes
      // First we check for square bracket attributes (i.e. "type", "name" "value")
      var tas = lib.re.match.attrs(tag);  // String.match() returns an Array
      if(tas !== null)
        tagattrs = Object.assign(tagattrs,lib.re.assign.attrs(tas));
      // Check for ID
      var id = lib.re.match.id(tag);
      if(id !== null)
        tagattrs["id"] = lib.re.assign.id(id);
      // Check for classes
      var classes = lib.re.match.classes(tag);
      if(classes !== null)
        tagattrs["class"] = lib.re.assign.classes(classes);
      /* TODO: You may want to Object.assign() here to merge any previous entries */
      // Prepend our tag attributes BEFORE the attributes in ao (attribute object)
      // Type should be before name or id or value.
      // TODO: Before assigning to ao["attrs"], promote "type", "name", and "id" (in that order if they exist) and demote "value" to the end (if that exists).
      // TODO: Probably should check to see of ao has an "attrs" attribute
      if(Object.entries(tagattrs).length > 0)
        ao["attrs"] = Object.assign(tagattrs,ao["attrs"]);
      //if(!lib.info.isU(ao))
      if(Object.entries(ao).length > 0)
        lib.edit.aa(el)(ao);
      return el;
    }
  },
  // Delete directive: remove old stuff
  "delete" : {
    // de : Delete Element(s), opposite of ce.
    "de" : el => lib.info.isA(el) ? el.map(el => el.remove()) : el.remove()
  },
  // Edit directive: Edit an array of things
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
  // Attributes Directive: Set and get attributes and properites
  "attr" : {
    "attr"   : el => (name,val) => lib.info.isU(val) ? lib.attr.get(el)(name) : lib.attr.set(el)(name,val),
    "get"    : el => name => el.getAttribute(name),
    "set"    : el => (name,val) => el.setAttribute(name,val),
    "has"    : el => name => el.hasAttribute(name),
    "add"    : el => name => el.setAttribute(name,""),
    "del"    : el => name => el.removeAttribute(name),
    "toggle" : el => name => !lib.attr.has(el)(name) ? lib.attr.add(el)(name) : lib.attr.del(el)(name)  
  },
  // Properties Directive: property states
  // TODO: Should this be merged into the Info directive?
  "prop" : {
    "checked"  : el => lib.attr.has(el)("checked"),
    "disabled" : el => lib.attr.has(el)("disabled")
  },
  // Events Directive: add and remove events
  "event" : {
    "on"  : evt => el => (cb,cap) => el.addEventListener(evt,cb,(cap||false)),
    "off" : evt => el => (cb,cap) => el.removeEventListener(evt,cb,(cap||false))
  },
  // CSS Directive: set and get css attributes
  "css" : {
    "css" : el => (prop,val,imp) => lib.info.isU(val) ? lib.css.get(el)(prop) : lib.css.set(el)(prop,val,imp),
    "get" : el => prop => el.style.getPropertyValue(prop),
    "set" : el => (prop,val,imp) => el.style.setProperty(prop,val,(imp||false)?"important":"")
  },
  // Content Directive: add content
  "content" : {
    "text" : el => val => lib.info.isU(val) ? el.innerText : (el.innerText = val),
    "html" : el => val => lib.info.isU(val) ? el.innerHTML : (el.innerHTML = val),
    "ac"   : parent => child => (parent||document.body).appendChild(child)
  }
}

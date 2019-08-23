/* @file: haqs.js
 * @author: Jason Charney (jrcharney@gmail.com)
 * @version: 0.0.1
 * @see TODO.md for a list of TODO items and other things that probably should be done.
 */
const lib = {
  /* @namespace query
   * @desc Select items and do stuff to them.
   */
  "query" : {
    /* @func : qs
     * @desc : querySelect[All] an object
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @returns: Node or NodeList
     */
    "qs"     : parent => (query,all) => lib.info.isS(parent) ? lib.query.qs(lib.query.qs()(parent))(query,all) : (parent||document)[`querySelector${(all||false)?"All":""}`](query),
    /* @func: qa
     * @desc: Do a qs then apply attributes (aa).
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : ao:Object : key-value list
     * @returns: Node or NodeList
     */
    "qa"     : parent => (query,all) => ao      => lib.edit.aa(lib.query.qs(parent)(query,all))(ao),
    /* @func: qattrs
     * @desc: Similar to qa but applies only regular attributes
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : ao:Object : key-value list of attributes
     * @returns: Node or NodeList
     * @todo if ao is not defined, return an object containing attributes (Note it may only be a shallow object)
     */
    "qattrs" : parent => (query,all) => ao      => lib.edit.attrs(lib.query.qs(parent)(query,all))(ao),
    /* @func: qcss
     * @desc: Similar to qa but applies only styles in a CSS style object format
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : co:Object : key-value list of CSS styles
     * @returns: Node or NodeList
     * @todo If co is not defined, return an object list if items exist
     */
    "qcss"   : parent => (query,all) => co      => lib.edit.css(lib.query.qs(parent)(query,all))(co),
    /* @func: qon
     * @desc: Similar to qa but applies only events
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : ao:Object : key-value list, 
     *    where the key is the name of an event (without the old "on" prefix!) 
     *    and the value is a function to run when that event occurs.
     * @returns: Node or NodeList
     * @todo If eo is not defined, return an object list if items exists
     * @todo qoff for removed event listeners?
     */
    "qon"    : parent => (query,all) => eo      => lib.edit.on(lib.query.qs(parent)(query,all))(eo),
    //"qoff" : parent => (query,all) => eo => {}
    /* @func: qh
     * @desc: Similar to qa but applies HTML content
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : content:String|Object : The content to fill an element.
     * @returns: Node or NodeList or String
     * @todo: if content is undefined, return the content that is already there if it exists
     */
    "qh"     : parent => (query,all) => content => lib.edit.html(lib.query.qs(parent)(query,all))(content),
    /* @func: qhtml
     * @desc: Similar to qa and less detailed than qh, qhtml simply sets or gets the HTML content of a qs'd object. 
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : text:String : HTML text that can be processed. (You should really use DOM via ce or q-something)
     * @returns: Node or NodeList or String
     */
    "qhtml"  : parent => (query,all) => text    => lib.content.html(lib.query.qs(parent)(query,all))(text),
    /* @func: qtext
     * @desc: Similar to qa and less detailed than qs, qtext simply sets or gets the TEXT content of a qs'd object
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : text:String : raw text
     * @returns: Node or NodeList
     */
    "qtext"  : parent => (query,all) => text    => lib.content.text(lib.query.qs(parent)(query,all))(text),
    /* @func: qac
     * @desc: query an object then append children to it. A simplified version of qh.
     * @param : parent:String|Node|Document : the parent element, if it is a string, it is qs'd, if empty is is set to the @default document.
     * @param : query:String : CSS-style query string to find an object or objects
     * @param : all:Boolean : @default false
     * @param : ao:Object|Array|Node|NodeList : Elements to be appended
     * @returns: Node or NodeList
     */
    "qac"    : parent => (query,all) => child   => lib.content.ac(lib.query.qs(parent)(query,all))(child)
  },
  /* @namespace info 
   * @desc Information directive: Get more info about stuff
   */
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
  /* @namespace: array
   * @desc Array directive: Common array tasks simplified
   * @todo I might just eliminate this. I only created it to reduce the amount of typing. 
   *      Kind of redundant now, isn't it?
   */
  "array" : {
    "oem" : o => cb => Object.entries(o).map(cb),
    "afm" : o => cb => Array.from(o).map(cb)
  },
  /* @namespace: math
   * @desc Math directive: The stuff ES6+ forgot
   * @todo range directive (Ruby and Python have them)
   */
  "math" : {
    /* @func: clamp
     * @desc: define the lower and upper limits of an accepted value.
     * @param: low:Number : The lowest acceptable value
     * @param: high:Number : the highest acceptable value
     * @param: t:Number: a value greater than or equal to low or less than or equal to high
     * @returns: t if it is in range or low or high if beyond the acceptable limits
     * Note: I could have written this the other way around where max was the inner and min was the outer
     */
    "clamp" : (low,high) => t => Math.max(low,Math.min(high,t)),
    /* @func rando
     * @desc Pick a random number
     * @param low:Number : The lowest acceptable inclusive value
     * @param high:Number : the highest acceptable exclusive value, unless inclusiveMin is true then inclusive
     * @param inclusiveMin:Boolean : Determine if the highest value is inclusive or exclusive. @default false
     * @todo Is there a way I could integrate clamp into rando?
     */
    "rando" : (low,high,inclusiveMin) => {
	    let min = Math.ceil(low);
	    let max = Math.floor(high);
      let im  = (inclusiveMin||false) ? 1 : 0;
	    return Math.floor(Math.random() * (max - min + im)) + min;
    }
  },
  /* @namespace re
   * @desc Regular Expression directive: common patterns
   * NOTE: ALWAYS quote your values
   * @todo Do not allow spaces in the attrs RE!
   */
  "re" : {
    /* @namespace pattern
     * @desc the patterns used for each match and assign function
     */
    "pattern" : {
      "tag"     : /^\w+/g,
      "attrs"   : /\[\w+=["']?\w+["']?\]/g,
      "id"      : /#\w+/g,
      "classes" : /\.[\w]+/g
    },
    /* @namespace match
     * @desc determine if the input string argument (s) matches the pattern
     * Note: String.prototype.match returns an Array
     */
    "match" : {
      "tag"     : s => s.match(lib.re.pattern.tag),
      "attrs"   : s => s.match(lib.re.pattern.attrs),
      "id"      : s => s.match(lib.re.pattern.id),
      "classes" : s => s.match(lib.re.pattern.classes)
    },
    /* @namespace assign
     * @desc using an input array, apply the data accordingly if the array is not null
     */
    "assign" : {
      "tag"     : a => lib.create.qce(a[0]),
      "attrs"   : a => Object.fromEntries(a.map(ta => ta.replace(/\[(\w+)=["']?(\w+)["']?\]/,"$1;$2").split(";"))),
      "id"      : a => a[0].slice(1),                           // slice removes the "#" at the beginning of the string.
      "classes" : a => a.map(cl => cl = cl.slice(1)).join(" "), // slice removes the "." at the beginning of the string.
    }
  },
  /* @namespace: create
   * @desc Create directive: create new things
   */
  "create" : {
    /* @func qce
     * @desc Quick Create Element: No attributes, just do it.
     * @param tag:String : the HTML or SVG element to create.
     * @returns Element
     * @todo I may consider retiring this function
     */
    "qce" : tag => document.createElement(tag),
    /* @func ce
     * @desc ce (Create Element) uses Regular Expression to extract any other attributes from the tag
     * @param tag:String : the HTML or SVG element to create with optional embedded CSS-style attributes
     * @param ao:Object : key-value object of attributes
     * @returns Element
     */
    "ce" : tag => ao => {
      // TODO: remove spaces from tag (there shouldn't be any)
      // TODO: Throw exception if the tag is not first or defined
      let el = lib.re.assign.tag(tag);
      ao = ao || {};        // Define ao as an empty object if it is not defined.
      let tagattrs = {};    // Check to see if our tag declaration had any attributes
      // First we check for square bracket attributes (i.e. "type", "name" "value")
      let tas = lib.re.match.attrs(tag);  // String.match() returns an Array
      if(tas !== null)
        tagattrs = Object.assign(tagattrs,lib.re.assign.attrs(tas));
      // Check for ID
      let id = lib.re.match.id(tag);
      if(id !== null)
        tagattrs["id"] = lib.re.assign.id(id);
      // Check for classes
      let classes = lib.re.match.classes(tag);
      if(classes !== null)
        tagattrs["class"] = lib.re.assign.classes(classes);
      // Prepend our tag attributes BEFORE the attributes in ao (attribute object)
      // Type should be before name or id or value.
      // TODO: Before assigning to ao["attrs"], promote "type", "name", and "id" 
      // (in that order if they exist) and demote "value" to the end (if that exists).
      // TODO: Probably should check to see of ao has an "attrs" attribute
      if(Object.entries(tagattrs).length > 0)
        ao["attrs"] = Object.assign(tagattrs,ao["attrs"]);
      if(Object.entries(ao).length > 0)   // if(!lib.info.isU(ao))
        lib.edit.aa(el)(ao);
      return el;
    }
  },
  /* @namespace delete
   * @desc Delete directive: remove old stuff
   * @todo I may consider replacing this by merging it with the create directive.
   *  Maybe consider a "CRUD" layout (Create, Read (query), Update (edit), Destroy)
   */
  "delete" : {
    /* @func de
     * @desc de : Delete Element(s), opposite of ce.
     */
    "de" : el => lib.info.isA(el) ? el.map(el => el.remove()) : el.remove()
  },
  /* @namespace edit
   * @desc Edit directive: Edit an array of things
   */
  "edit" : {    
    /* @func aa
     * @desc "Apply Attributes" (formerly "attrs" but there's like a ton of stuff named that)
     * @param   el:Element
     * @param   ao:Object : An object that may contain a list of other objects that applies attributes to an element.
     * @returns Element (the element that has the attributes applied to it)
     * @todo what if ao is undefined and el doesn't parse anything? Can we return the ao?
     */
    "aa" : el => ao => {
      if(lib.info.isO(ao)){
        lib.array.oem(ao)(([k,v]) => {
          if(k === "html")
            lib.edit.html(el)(v);
          else if(["attrs","css","on"].includes(k) && lib.info.isO(v))  // I like this part!
            lib.edit[k](el)(v);
          else  // if(lib.info.is(v)("string"))
            lib.attr.attr(el)(k,v);
        });
      }
      return el;
    },
    /* @func html
     * @desc Complex for a reason, this will allow you to add text, an node, or an NodeList to an element.
     * @param el:Element
     * @param text:String|Node|NodeList
     * @returns Element
     * @todo What if txt is undefined? Return the content inside the element?
     */
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
  // Attributes Directive: Set and get attributes and properties
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
  // @todo: What if evt is a string with spaces in it or an array of string values?
  //        This can be useful for apply a call back to multiple events!
  "event" : {
    "on"  : evt => el => (cb,cap) => el.addEventListener(evt,cb,(cap||false)),
    "off" : evt => el => (cb,cap) => el.removeEventListener(evt,cb,(cap||false))
  },
  // CSS Directive: set and get css attributes
  // CSS is entered a lot like jQuery as an object, 
  // such that if you aren't familiar with the JavaScript names for CSS properties, 
  // you can just us the CSS property names as keys of an object
  // TODO: test to see if a style has a property set.
  "css" : {
    "css" : el => (prop,val,imp) => lib.info.isU(val) ? lib.css.get(el)(prop) : lib.css.set(el)(prop,val,imp),
    // "has" : el => prop => {},
    "get" : el => prop => el.style.getPropertyValue(prop),
    "set" : el => (prop,val,imp) => el.style.setProperty(prop,val,(imp||false)?"important":"")
  },
  // Classes Directive: set and get classes
  // TODO: Should I consider using spread and rest parameters here?
  "classes" : {
    "classes" : el => cl => lib.info.isU(cl) ? lib.classes.get() : lib.classes.set(cl), // TODO: test cl to see if it is an array or string?
    "get" : el => el.className,     // returns a (space-separated) String
    "set" : el => cl => el.className = cl,
    "list" : el => el.classList,    // returns a DOMToken array, not an Array.
    "has" : el => cl => el.classList.contains(cl),
    "add" : el => cl => el.classList.add(cl), // TODO: could use a spread and rest parameter
    "del" : el => cl => el.classList.remove(cl),  // TODO: could use a spread and rest parameter
    "toggle"  : el => (cl,force) => el.classList.toggle(cl,(force||false)),
    "replace" : el => (old_cl, new_cl) => el.classList.replace(old_cl,new_cl) // TODO: could we do this globally?
  },
  // Content Directive: add content
  "content" : {
    "text" : el => val => lib.info.isU(val) ? el.innerText : (el.innerText = val),
    "html" : el => val => lib.info.isU(val) ? el.innerHTML : (el.innerHTML = val),
    "ac"   : parent => child => (parent||document.body).appendChild(child)
  }
};

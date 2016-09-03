# smart-circular

Simplify JS objects, replacing **circular** references by the *path* leading to the parent reference. Useful before a JSON.stringify() or a recursive navigation over the object.

# Problem

See this structure?

```javascript
var danilo = {name: "Danilo"};

var school = {
       parents: [
              {name: "Jairo", children: [danilo]}
       ],
       children: [danilo]
};
```

What if you wanted to remove circular references to the school object, to export it in JSON for example? Current libraries that remove circular references remove them recursively, so you have a strong chance to obtain the json:

```javascript
{
       parents: [
              {name: "Jairo", children: [{name: "Danilo"}]}
       ],
       children: ["circular"]
}
```

The library smart-circular not only keeps the nearest reference to the root, but the other are transformed to a string pointing to it:

```javascript
{
       parents: [
              {name: "Jairo", children: ["$.children[0]"]}
       ],
       children: [{name: "Danilo"}]
}
```

This is obtained using *breadth-first search* to do replacements with the shortest paths.


# Installation

```
npm i smart-circular
```

# Usage 

- Require the module

```javascript
var sc = require('smart-circular');
```

- Pass the JSON to be simplified as the first argument of the sc function.
- Optionally, pass a second argument with your personalised function to transform parts of the JSON (cf. examples).

```javascript
var result = sc(value, [customizer]);
```


# Examples

- Avoiding circular references

```javascript
var json = {
       a: {
            b: 'please, not circular'
       }
};

json.a.b = json.a;

var result = sc(json);

console.log(JSON.stringify(result, null, 2));
```

This script gives:

```javascript
{
      "a": {
          "b": "$.a"
       }
}  
```


- Avoiding repetitions.

```javascript
var json = {
       a: {
              b: {
                     c: 55
              }
       },
       d: {
              e: 4
       }
};

json.d = json.a.b;

var result = sc(json);

console.log(JSON.stringify(result, null, 2));
```

This script gives:

```javascript
{
       "a": {
              "b": "$.d"
       },
       "d": {
              "c": 55
       }
}
```

Realize the reference is put at *b*, even though *d* has changed. If we had conserved *b* to put the path at *d*, this path would be longer. This is annoying when dealing with really big JSON's.

- The following script will not only replace circular and repeated references, but also replace by *false* all boolean values that are *true*.

```javascript
var result = sc(json, function (value) {
       if (value === true) {
              //return replacement
              return false; 
       }
});
```

- If you want to replace an entire JSON object, use the method ['isEqual' from lodash](https://lodash.com/docs#isEqual):

```javascript
var result = sc(json, function (value) {
       //other is the deep JSON object you want to replace
       if (_.isEqual(value, other)) {
              //returning replacement
              return [
                     {
                        "id": 0,
                        "name": "Danilo Augusto"
                     },
                     {
                        "id": 1,
                        "name": "Sherlock Holmes"
                     }
              ];
       }
});
        
```

Remember that, before putting your replacement in the new object, we'll look for repetitions and circularities envolving it: in that case the replacement is a string pointing to the path of the first occurrence. All the descendants of your replacement will also be checked.

- If you want to replace functions:

```javascript
var Alerts = {
       houston: function() {
              alert("Houston, we have a problem.");
       },
       email: function(name) {
              alert("You didn't enter any email address, " + name + ". We're not psychic...");
       }
};

var result = circularBFS(Alerts, function(value) {
       //If it's a function, we only write "f(arg1, arg2, ...) { number of lines }"
       if(typeof value === "function") {
              var functionRegex = /\([^{]*/;
              var fs = value.toString();
              var lineNum = fs.split(/\r\n|\r|\n/).length;
              return ("f " + functionRegex.exec(value.toString())[0] + "{ " + lineNum + " }");
       }
});

console.log(JSON.stringify(result, null, 2));
```

This script gives:

```javascript
{
       "houston": "f () { 3 }",
       "email": "f (name) { 3 }"
}
```

# Understanding the paths

The replacements made by the algorithm (not personalised) are strings in the form '$[path]'.

The paths written in the result are easy to read: the '$' represents your object root. 

So the path below points to 'your variable' (which is an array) → 'second position of the array' (arrays begin at 0) → 'key friends' → 'third friend' → 'his name'. To get this name, you can simply replace the '$' by your object name.

```javascript
  $[1].friends[2].name
```



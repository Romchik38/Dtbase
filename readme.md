Dtbase gets an array of objects, do something with them and return result.

## Call:
  * dtbase({ methodName, fn, source, options })

## Arguments
  1. methodName - name of the method (string).   
  2. fn - a function that will compare an object with a condition
  3. source - array of objects(array)  
  4. options - some options for methods(object)  

## Methods:
  1. select - compare with a condition and return selection of items

### Result
  * All methods return an array of objects. [object, object2 ...]

## Fn
  * async function
  * arguments:
    1. item - object
  * return:  
    1. object -if it meets a conditions
    2. null - if not.  

## Source
  * an array of objects

## Options    
  * some options for methods  


Expamle

```javascript
const dtbase = require('@romchik38/dtbase');
//@romchik38/dtbase@2.0.0


const age = async item => {
  try {
    const age = parseInt(item['age'], 10);
    if (typeof age === 'number' && age > 21) return item;
    else return null;
  } catch (err) {
    throw new Error(err);
  }
};

const arr = [
    {"name": "ser", "lastname": "rom", "age": "20"},
    {"name": "dim", "lastname": "fan", "age": "25"},
    {"name": "zin", "lastname": "opr", "age": "18"}
];

const result = dtbase({
      methodName: 'select',
      fn: age,
      source: arr,
      options: {},
  });

result.then(data => {
  console.log({ data });
  }).catch(err => {
    console.log('error from catch', err);
  });
```

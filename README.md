# Really Bad Configs

A module to turn configuration storage into living hell.

![each key value pair should be a separate file where the key is the filename and the value is the contents of the file](assets/screenshot.png)

## Usage

```sh
npm i really-bad-configs
```

Create a directory to hold your configuration's key-value pairs. Remember, each file holds a key-value pair, so that the name of the file will be the key and the contents will be the value.

Once you have that directory, pass it through the `load` function:

```js
const { load } = require('really-bad-configs');
// or: const loadConfig = require('really-bad-configs').load;
// or simply: const rbc = require('really-bad-configs');

const config = load({ location: 'path/to/the/config/dir' });
console.log(config);
```

## API

### `load ({ location })`

Loads a configuration. Expects an object with a `location` property that specifies the directory that contains the key-value pairs. It returns an object.

```js
const config = load({ location: '.config' });
```

### `lookup (location, key)`

Looks up a value based on config location and key. Returns the contents of the file if it exists. Otherwise, it returns undefined.

```js
const databaseUser = lookup('.config', 'DATABASE_USER');
```

### `createKey (location, key, value)`

Creates a key-value pair in the specified location (if it doesn't already exist). It returns `true` if it succeded, `false` if the location doesn't exist or the value is an object, throws for any other issue.

```js
createKey('.config', 'DATABASE_USER', 'testuser');
```

### `createMultiple (location, configObject)`

Creates a key-value pair for an entire config object. Useful for converting your old, lame, JSON-based configs into RBCs. It returns true if it has succeded, throws if something bad happened. It uses the `createKey` method.

```js
createMultiple('.config', {
  DATABASE_HOST: 'localhost',
  DATABASE_USER: 'testuser'
});
```

## Disclaimer

This project is a joke. Please don't use it in your production apps... or not even in your development apps.

## License

MIT.

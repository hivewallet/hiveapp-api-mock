## Mock functions for the Hive JavaScript API ###

### How to use

When [hiveapp-api-mock.js](https://raw2.github.com/javgh/hiveapp-api-mock/master/hiveapp-api-mock.js) is included, it defines the 'bitcoin' object - unless there is already one available - and offer a mock API which emulates Hive's JavaScript API.

### See also

- Hive JavaScript API documentation: https://github.com/hivewallet/hive-osx/wiki/API
- How to build a Hive app: https://github.com/hivewallet/hive-osx/wiki/How-to-build-a-Hive-app

### Development

```bash
# Running tests:
cd test
open index.html
```
If you find any inconsistency among this mock, the [documentation](https://github.com/hivewallet/hive-osx/wiki/API) and the [actual implementation](https://github.com/hivewallet/hive-osx/blob/master/Hive/Controllers/HIAppRuntimeBridge.m), issues and pull requests are welcome.

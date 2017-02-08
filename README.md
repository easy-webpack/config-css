# @easy-webpack/config-css

[![Greenkeeper badge](https://badges.greenkeeper.io/easy-webpack/config-css.svg)](https://greenkeeper.io/)
Include and inject css using [css-loader] and [style-loader]

Or emit a CSS file of all required css using [extract-text-plugin] (default behaviour)

# Installation
```
npm install --save-dev @easy-webpack/config-css
```
[easy-webpack](https://github.com/easy-webpack/core) is also required.

# Usage
```js
// webpack.config.js
const generateConfig = require('@easy-webpack/core').generateConfig;

const baseConfig = { ... }; // project-specific config like the entry file

module.exports = generateConfig(
  baseConfig,

  require('@easy-webpack/config-css')
    ({/* Options object */ filename: 'styles.css', allChunks: true, sourceMap: false })
);

// This config will generate a CSS file named 'style.css' on output path of all required sources
```

On any JavaScript module, simply import your css file and they will be included in output css.
```js
// app.js
require('./style.css')  // CommonJS style import
import './style.css'    // ES Module import
```

Remember to include the css file in your HTML.

# Options
### extractText
Type: `boolean | ExtractTextPlugin instance | ExtractTextPlugin config object` Default: `true`

Toggle mode of this plugin. If this is `false`, inline mode will be used.
No additional CSS file will be generated and all imported css modules will be injected by [style-loader](https://github.com/webpack/style-loader).

Unless you have special needs, it is not recommended to turn on inline mode because of [performance issue](https://github.com/webpack/extract-text-webpack-plugin#usage-example-with-css).

You can configure the behaviour of [extract-text-plugin] by passing [options of it](https://github.com/webpack/extract-text-webpack-plugin#api) using any of the following methods.

```js
const generateConfig = require('@easy-webpack/core').generateConfig;

// Pass in ExtractTextPlugin instance
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractText = new ExtractTextPlugin({
  disable: false,
    allChunks: false,
    id: 'my-unique-id'
}); 

// Pass in plain config object
var extractText = {
  disable: false,
  allChunks: false,
  id: 'my-unique-id'
};

generateConfig(
  require('@easy-webpack/config-css')
    ({ extractText: extractText })
)
```

Note: other options will have a higher priority on overriding extract text plugin options. 
For example, if `extractText.allChunks` is `false` while `allChunks` on `config-css options` is `true`, the result would be `true`. 

### filename
Type: `string` Default: `[name].css`

Filename of the extracted css file.
Similar to webpack's output filename, a dynamic name can be used. The following string will be substituted.
 - `[name]` the name of the chunk
 - `[id]` the number of the chunk
 - `[contenthash]` a hash of the content of the extracted file

### allChunks
Type: `boolean`  Default: `false`

By default, [extract-text-plugin] only extract initial chunk(s). If this is `true`, additional chunks will also be extracted.

### sourceMap
Type: `boolean` Default: `false`

If `true`, emit a [sourcemap](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) of the CSS bundle.

### resolveRelativeUrl
Type: `boolean | resolve-url-loader config object` Default: `false`

If not false, use [resolve-url-loader] to resolve relative url before [css-loader] issue require request.

This option can be an plain object containing [options for resolve-url-loader](https://github.com/bholloway/resolve-url-loader#options).

If [resolve-url-loader] is turned on, `sourceMap` will be set to `true` as the plugin requires source map to function.

### additionalLoaders
Type: `string[]` Default: `[]`

Additional loaders.

This array of loaders will be pushed to the end of loader list. For instance,
```
(Take inline mode loader chain as example,)
style-loader!css-loader!additional-loaders1!additional-loaders2
```

### test
Type: `Webpack Condition` Default: `/\.css$/i`

Condition for this config to apply. See [webpack module condition guide](https://webpack.js.org/configuration/module/#condition).

# Related tutorials
 - [Webpack 1 stylesheet guide](https://webpack.github.io/docs/stylesheets.html)
 - [Webpack 2 extracting CSS from bundle](https://webpack.js.org/guides/code-splitting-css/)

# Tips
## Minify CSS
[css-loader] have [built in minification](https://github.com/webpack/css-loader#minification) facility using [cssnano](http://cssnano.co/).

Minification is highly recommended in production as it can greatly reduce chunk size and give better performance on loading.
 
To enable minification, you must enable minification flag on webpack.

For webpack 1, include uglifyJS plugin.

For webpack 2, include uglifyJS plugin or include a [loader-options-plugin](https://webpack.js.org/plugins/loader-options-plugin/).

Or just include [config-uglify](https://github.com/easy-webpack/config-uglify).

__Note on using loader-options-plugin__: You may only use this plugin once with a given test, as it will override all the options once used and can cause problems

```js
const webpack = require('webpack');
const generateConfig = require('@easy-webpack/core').generateConfig;
// webpack 1 / webpack 2
generateConfig(
  require('@easy-webpack/config-css')(),
  {
    plugins: [new webpack.optimize.UglifyJsPlugin()]
  }
);

// webpack 2 only
generateConfig(
  require('@easy-webpack/config-css')(),
  {
    plugins: [new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      minimize: true
    })]
  }
);

// config-uglify
generateConfig(
  require('@easy-webpack/config-css')(),
  require('@easy-webpack/config-uglify')()
);
```

Currently, there is no way to pass in option to cssnano.

[extract-text-plugin]: https://github.com/webpack/extract-text-webpack-plugin
[css-loader]: https://github.com/webpack/css-loader
[style-loader]: https://github.com/webpack/style-loader
[resolve-url-loader]: https://github.com/bholloway/resolve-url-loader
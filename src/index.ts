import {WebpackConfig, get} from '@easy-webpack/core'
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * CSS loader support for *.css
 * @param sourceMap enable generating source maps (slower build)
 * @param extractCss leave empty to skip extracting CSS or define an object with filename and optionally allChunks (boolean)
 */
export function css(sourceMap = false, extractCss = { filename: 'styles.css', allChunks: false }) {
  return function css(this: WebpackConfig): WebpackConfig {
    let extractCSSinstance = extractCss ? new ExtractTextPlugin('[name].css', extractCss) : null
    let cssLoader = `css${sourceMap ? '?sourceMap' : ''}`
    const config = {
      module: {
        loaders: get(this, 'module.loaders', []).concat([{
          test: /\.css$/i,
          loaders: extractCss ? extractCSSinstance.extract(['style', cssLoader]) : ['style', cssLoader]
        }])
      }
    } as WebpackConfig
    if (extractCSSinstance) {
      config.plugins = [
        /**
         * Plugin: ExtractTextPlugin
         * It moves every import "style.css" in entry chunks into a single concatenated css output file. 
         * So your styles are no longer inlined into the javascript, but separate in a css bundle file (styles.css). 
         * If your total stylesheet volume is big, it will be faster because the stylesheet bundle is loaded in parallel to the javascript bundle.
         */
        extractCSSinstance
      ].concat(get(this, 'plugins', []))
    }
    return config
  }
}
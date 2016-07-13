import {WebpackConfig, get} from '@easy-webpack/core'
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * SASS loader support for *.scss
 * filename: name of the extracted file
 * allChunks: should we extract all chunks to the file?
 * sourceMap: do you want a sourceMap generated? (takes longer)
 * extractText: do you want to extract all css to a separate file? boolean, configuration object or instance of ExtractTextPlugin, defaults to true
 * resolveRelativeUrl: boolean or object with parameters
 */
export = function css({ filename = '[name].css', allChunks = false, sourceMap = false, extractText = undefined, resolveRelativeUrl = undefined, additionalLoaders = [], test = /\.css$/i } = {}) {
  return function css(this: WebpackConfig): WebpackConfig {
    const loaders = ['style', `css${sourceMap ? '?sourceMap' : ''}`]

    if (resolveRelativeUrl) {
      loaders.push(`resolve-url${sourceMap ? '?sourceMap' : ''}`)
      sourceMap = true // source maps need to be on for this
    }

    if (additionalLoaders) {
      loaders.push(...additionalLoaders)
    }

    const extractCss = extractText !== false
    const providedInstance = extractText instanceof ExtractTextPlugin
    const extractTextInstances: Map<string, any> = this.metadata.extractTextInstances = this.metadata.extractTextInstances || new Map()

    if (!providedInstance) {
      if (extractCss) {
        extractText = extractTextInstances.get(filename)
        if (!extractText) {
          extractText = new ExtractTextPlugin(filename, extractText instanceof Object ? extractText : { allChunks, sourceMap })
          extractTextInstances.set(filename, extractText)
        }
      } else {
        extractText = null
      }
    }

    const config = {
      module: {
        loaders: get(this, 'module.loaders', []).concat([{
          test,
          loaders: extractCss ? extractText.extract(...loaders.slice(1)) : loaders
        }])
      }
    } as WebpackConfig
    if (extractText && !providedInstance) {
      config.plugins = [
        /**
         * Plugin: ExtractTextPlugin
         * It moves every import "style.css" in entry chunks into a single concatenated css output file. 
         * So your styles are no longer inlined into the javascript, but separate in a css bundle file (styles.css). 
         * If your total stylesheet volume is big, it will be faster because the stylesheet bundle is loaded in parallel to the javascript bundle.
         */
        extractText
      ].concat(get(this, 'plugins', []))
      config.metadata.extractTextInstances = extractTextInstances
    }
    if (resolveRelativeUrl instanceof Object) {
      config['resolveUrlLoader'] = resolveRelativeUrl
    }
    return config
  }
}

// A JavaScript class.
class SplitChunksPlugin {
    // Define `apply` as its prototype method which is supplied with compiler as its argument
    apply(compiler) {
      // Specify the event hook to attach to
      compiler.hooks.emit.tapAsync(
        'SplitChunksPlugin',
        (compilation, callback) => {
          console.log('This is an SplitChunksPlugin12!');
          // console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);
  
          // Manipulate the build using the plugin API provided by webpack
          // compilation.addModule(/* ... */);
  
          callback();
        }
      );
    }
  }
module.exports = SplitChunksPlugin;
  
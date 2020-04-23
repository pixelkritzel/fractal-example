'use strict';

const path = require('path');
const fs = require('fs').promises;
const chokidarConstructor = require('chokidar');
const sass = require('node-sass');

const chokidar = chokidarConstructor.watch(path.join(__dirname, 'styles/**/*.scss'));

chokidar.on('all', () =>
  sass.render(
    {
      file: path.join(__dirname, 'styles/styles.scss'),
      watch: true,
    },
    async function (error, result) {
      // node-style callback from v3.0.0 onwards
      if (error) {
        console.error(error.status); // used to be "code" in v2x and below
        console.error(error.column);
        console.error(error.message);
        console.error(error.line);
      } else {
        const css = result.css.toString();
        fs.writeFile(path.join(__dirname, 'public/styles.css'), css);
      }
    }
  )
);

/*
 * Require the Fractal module
 */
const fractal = (module.exports = require('@frctl/fractal').create());

/*
 * Give your project a title.
 */
fractal.set('project.title', 'Naturblick');

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', path.join(__dirname, 'components'));

/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'public'));

const server = fractal.web.server({
  sync: true,
});
server.on('error', (err) => console.error(err.message));
return server.start().then(() => {
  console.log(`Fractal server is now running at ${server.urls.sync.local}`);
});

"use strict";

import gulp from "gulp";
import batch from "gulp-batch";
import watch from "gulp-watch";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import gutil from "gulp-util";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import minifyCSS from "gulp-csso";
import sourcemaps from "gulp-sourcemaps";
import babel from "gulp-babel";
import browserify from "browserify";
import babelify from "babelify";
import browserSync from "browser-sync";
import env from "babel-preset-env";
import uglify from "gulp-uglify";
import filter from "gulp-filter";
import changed from "gulp-changed";
import spritesmith from "gulp.spritesmith"
import clean from "gulp-rimraf";
import purify from "gulp-purifycss";
import merge from "merge-stream";
import glob from "glob";
import path from "path";
import injectPartials from 'gulp-inject-partials';
import streamqueue from 'streamqueue';
import concat from 'gulp-concat';




browserSync.create();

// PATHS
const dirs = {
  src: "src",
  dest: "dist"
};
const paths = {
  css: {
    source: `${dirs.src}/scss/**/*.scss`,
    watch: `${dirs.src}/scss/**/*.scss`,
    dest: `${dirs.dest}/css/`
  },
  js: {
    source: `${dirs.src}/js/main.js`,
    dest: `${dirs.dest}/js/`,
    watch: `${dirs.src}/js/main.js`
  },
  htmls: {
    source: `${dirs.src}/templates/*.html`,
    dest: `${dirs.dest}/`,
    watch: `${dirs.src}/templates/**/*.html`,
  },
  images: {
    source: `${dirs.src}/img/**/*.{png,jpg,jpeg,gif,svg}`,
    dest: `${dirs.dest}/img/`,
    watch: `${dirs.src}/img/**/*.{png,jpg,jpeg,gif,svg}`,
  },
  fonts: {
    source: `${dirs.src}/fonts/**/*.*`,
    dest: `${dirs.dest}/fonts/`,
    watch: `${dirs.src}/fonts/**/*.*`,
  },
  spriteImages: {
    source: `${dirs.src}/img/sprite/**/*.png`,
    dest: `${dirs.src}/img/`,
    watch: `${dirs.src}/img/sprite/**/*.png`,
  }
};

// Clean Dist Directory
gulp.task("clean", [], () => {
  
  return gulp.src("dist/*", { read: false }).pipe(clean());
});

const plugins = [autoprefixer({ browsers: ["last 10 version"] })];


// SASS
gulp.task("sass", () =>
  gulp
    .src(paths.css.source)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          message: "<%= error.message %>",
          title: "CSS preprocessing"
        })
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream({ match: "**/*.css" }))
);

// Js

gulp.task('vendors-js', function() {
   return streamqueue({ objectMode: true },
    gulp.src(`${dirs.src}/js/vendors/modernizr.js`),
    gulp.src(`${dirs.src}/js/vendors/jquery-3.3.1.js`),
    gulp.src(`${dirs.src}/js/vendors/greensock/TweenMax.js`),
    gulp.src(`${dirs.src}/js/vendors/scrollmagic/ScrollMagic.js`),
    gulp.src(`${dirs.src}/js/vendors/scrollmagic/plugins/animation.gsap.js`),
    gulp.src(`${dirs.src}/js/vendors/slick.js`)

       //gulp.src('dev/lib/modernizr.custom.min.js'), 
       //gulp.src('dev/lib/jquery-2.1.1.min.js'),
       //gulp.src('dev/lib/greensock/utils/Draggable.js'), 
       //gulp.src('dev/lib/greensock/utils/SplitText.js'), 
       //gulp.src('dev/lib/greensock/TweenMax.js'),
       //gulp.src('dev/lib/greensock/plugins/DrawSVGPlugin.js'),   
       //gulp.src('dev/lib/greensock/plugins/MorphSVGPlugin.js'),
       //gulp.src('dev/lib/greensock/plugins/ScrollToPlugin.js'),
       //gulp.src('dev/lib/scrollmagic/ScrollMagic.js'),
       //gulp.src('dev/lib/scrollmagic/plugins/animation.gsap.js'),
       //gulp.src('dev/lib/slick.js'),
       //gulp.src('dev/lib/select2.js'),  
       //gulp.src('dev/lib/moment.js'),
       //gulp.src('dev/lib/bootstrap.js'),  
       //gulp.src('dev/lib/bootstrap-datepicker.js'),
       //gulp.src('dev/lib/select2.min.js'),
       //gulp.src('dev/lib/app/components/components.js'),
       //gulp.src('dev/lib/app/app.js'),
       //gulp.src('dev/lib/calendar.js'),
       
   )
   .pipe(concat('vendors.js'))
   //.pipe(uglify())
   .pipe(gulp.dest(`${dirs.dest}/js/`));
});

// ES6 Bundles generator
gulp.task("main-js", () => {
  const files = glob.sync("./src/js/main.js");
  return merge(
    files.map(file =>
      browserify({
        entries: file,
        debug: true
      })
        .transform(babelify.configure({ presets: [env] }))
        .bundle()
        .on(
          "error",
          notify.onError({
            message: "<%= error.message %>",
            title: "JS compilation"
          })
        )
        .pipe(source(`${path.basename(file, ".js")}.js`))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream())
    )
  );
});
// Html Partial renderer 
gulp.task('ptl_render', function () {
  return gulp.src(paths.htmls.source)
           .pipe(plumber(function (error) {
                gutil.log(error.message);
                this.emit('end');
            }))
           .pipe(injectPartials({
              removeTags: true
           }))
           .pipe(gulp.dest(paths.htmls.dest))
           .pipe(browserSync.stream());
});
// Images
gulp.task("images", () =>
  gulp
    .src(paths.images.source)
    .pipe(gulp.dest(paths.images.dest))
);

// Statics
gulp.task("static-files", () =>
  gulp
    .src(`${dirs.src}/static/**/*.{png,jpg,jpeg,gif,svg,js,json}`)
    .pipe(gulp.dest(`${dirs.dest}/static/`))
);

gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.spriteImages.source).pipe(spritesmith({
    imgName: '../img/sprite.png',
    cssName: '../scss/_sprite.scss'
  }));
  return spriteData.pipe(gulp.dest(paths.spriteImages.dest));
});

// fonts
gulp.task("fonts", () =>
  gulp.src(paths.fonts.source).pipe(gulp.dest(paths.fonts.dest))
);


// Gulp main serve task
gulp.task("serve", function(){
	browserSync.init({
    server: {
      baseDir: "./dist"
    },
    open: true
    // port: 8000
  });

  gulp.watch(paths.css.watch, ["sass"]);
  gulp.watch(`${dirs.src}/js/vendors/**/*.js`, ["vendors-js"]);
  gulp.watch(paths.js.watch, ["main-js"]);
  gulp.watch(paths.spriteImages.watch, ["sprite"])
  gulp.watch(paths.images.watch, ["images"]);
  gulp.watch(paths.fonts.watch, ["fonts"]);
  gulp.watch(`${dirs.src}/static/**/*.{png,jpg,jpeg,gif,svg,js,json}`, ["static-files"]);
  gulp.watch(paths.htmls.watch, ["ptl_render"]);

})

// gulp main build task
gulp.task('build', [
  "ptl_render",
  "sass",
  "vendors-js",
  "main-js",
  "sprite",
  "images",
  "fonts",
  "static-files"
])

// Gulp default task
gulp.task("default", ["build", "serve"]);


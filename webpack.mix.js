const mix = require('laravel-mix');

mix
    .setPublicPath("public/static")
    .setResourceRoot("resources");

mix
    .js('resources/js/app.js', 'js')
    .react()
    .sass('resources/sass/users-manager.scss', 'css');

/**
 * index.js
 * Point d'entrée — attend deviceready ET jQuery Mobile
 */

let app;

$(document).one('mobileinit', function () {
    $.mobile.autoInitializePage = true;
});

$(document).on('pagecreate', function () {
    document.addEventListener("deviceready", () => {
        app = new AppManager();
        app.onDeviceReady();
    }, false);
});
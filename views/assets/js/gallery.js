/*
 * LightSpread
 * Copyright (C) 2018  Artur Weigandt  https://wlabs.de/kontakt

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import 'bootstrap/scss/bootstrap.scss';
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import 'lightgallery/dist/css/lightgallery.css';
import 'lightgallery/dist/css/lg-transitions.css';
import '../css/gallery.scss';

import $ from 'jquery';
import 'lightgallery/dist/js/lightgallery.js';
import 'lightgallery/modules/lg-autoplay.js';
import 'lightgallery/modules/lg-fullscreen.js';

var autoHideControlsTimeout = 2000;

var setupImages = function(data) {
    var galleryElement = document.getElementById('lightgallery');

    var template = '<div class="col-xl-1 col-lg-2 col-md-3 col-6"><a href="{image}" title="{title}" class="galleryitem d-block mb-4 h-100" data-src="{image}"><img class="img-fluid img-thumbnail" src="{thumb}" alt=""></a></div>';

    for (var index in data) {
        var value = data[index];

        var element = template
            .replace('{image}', value.path)
            .replace('{thumb}', value.thumbnail)
            .replace('{title}', value.name);

        galleryElement.innerHTML = galleryElement.innerHTML + element;
    }

    return true;
}

var setupGallery = function() {
    // autostart, if location has the #autostart hash
    var autostart = (window.location.hash == '#autostart');

    $("#lightgallery").lightGallery({
        selector: '.galleryitem', // TODO: make it configurable
        mode: 'lg-soft-zoom',
        height: '100%',
        preload: 2,
        speed: 1000, // TODO: make it configurable
        hideBarsDelay: autoHideControlsTimeout,
        autoplay: autostart,
        pause: 8000, // TODO: make it configurable
        progressBar: false, // TODO: make it configurable
    });

    // Remove loader
    document.getElementById('loader').style.opacity = 0;
    document.getElementById('loader').style.visibility = 'hidden';

    // Start with first slide
    if (autostart) {
        $(".galleryitem").first().trigger('click');
    }
};

// Autohide cursor after 5 seconds
// Thanks to https://stackoverflow.com/a/31798987
$(function() {
    var timer;
    var fadeInBuffer = false;
    $(document).mousemove(function() {
        if (!fadeInBuffer) {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }

            $('html').css({
                cursor: ''
            });
        } else {
            $('html').css({
                cursor: 'default'
            });
            fadeInBuffer = false;
        }

        timer = setTimeout(function() {
            $('html').css({
                cursor: 'none'
            });

            fadeInBuffer = true;
        }, autoHideControlsTimeout);
    });
    $('.html5gallery-box-0').css({
        cursor: 'default'
    });
});

// Load image list and setup gallery
$(document).ready(function() {
    $.ajax('/images', {
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Bilder konnten nicht geladen werden.');
            console.log(textStatus);
            console.error(errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
            if (setupImages(data.data)) {
                setupGallery();
            }
        }
    });
});

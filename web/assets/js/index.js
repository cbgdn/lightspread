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

import '../scss/style.scss';

import lightGallery from 'lightgallery';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';

// autohide controls after 10 sec
var autoHideControlsTimeout = 10000;

var setupImages = function(data) {
    return new Promise(resolve => {
        let galleryContent = '';
        let template = '<div class="col-xl-1 col-lg-2 col-md-3 col-6"><a href="{image}" title="{title}" class="galleryitem d-block mb-4 h-100" data-src="{image}"><img class="img-fluid img-thumbnail" src="{thumb}" alt=""></a></div>';

        data.forEach(item => {
            let element = template
                .replaceAll('{image}', item.path)
                .replaceAll('{thumb}', item.thumbnail)
                .replaceAll('{title}', item.name);

            galleryContent += element;
        });

        document.getElementById('lightgallery').innerHTML = galleryContent;

        resolve();
    });
}

var setupGallery = async function(data) {
    await setupImages(data);

    // autostart, if location has the #autostart hash
    var autostart = (window.location.hash == '#autostart');

    // autohide controls in autostart after 2 sec
    if (autostart) {
        autoHideControlsTimeout = 2000;
    }

    lightGallery(document.getElementById('lightgallery'), {
        licenseKey: 'GPL-3.0-or-later',
        plugins: [lgAutoplay, lgFullscreen],
        selector: '.galleryitem', // TODO: make it configurable
        mode: 'lg-soft-zoom',
        height: '100%',
        preload: 2,
        speed: 1000, // TODO: make it configurable
        hideBarsDelay: autoHideControlsTimeout,
        enableDrag: ! autostart,
        enableSwipe: ! autostart,
        autoplay: autostart,
        getCaptionFromTitleOrAlt: false,
        pause: 8000, // TODO: make it configurable
        progressBar: false, // TODO: make it configurable
    });

    // Remove loader
    document.getElementById('loader').style.opacity = 0;
    document.getElementById('loader').style.visibility = 'hidden';

    // Start with first slide
    if (autostart) {
        let galleryitem = document.querySelector(".galleryitem");

        if (galleryitem) {
            galleryitem.click();
        }
    }
};

// Autohide cursor after some seconds
// Thanks to https://stackoverflow.com/a/31798987
var autohideCursor = function() {
    var timer;
    var fadeInBuffer = false;

    var resetTimer = function() {
        let htmlElement = document.querySelector("html");

        if (!fadeInBuffer) {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }

            htmlElement.classList.remove('html__cursor--none');
            htmlElement.classList.remove('html__cursor--default');
        } else {
            htmlElement.classList.remove('html__cursor--none');
            htmlElement.classList.add('html__cursor--default');

            fadeInBuffer = false;
        }

        timer = setTimeout(function() {
            htmlElement.classList.remove('html__cursor--default');
            htmlElement.classList.add('html__cursor--none');

            fadeInBuffer = true;
        }, autoHideControlsTimeout);
    };

    // Start timer on start
    resetTimer();

    // Reset timer on mousemove
    document.addEventListener('mousemove', event => {
        resetTimer();
    });
};

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
        autohideCursor();
        // Load image list and setup gallery
        let requestImages = new Request('/images');

        fetch(requestImages)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setupGallery(data.data);
            })
            .catch(error => {
                alert('Bilder konnten nicht geladen werden.');
                console.debug('Fehler gefangen');
                console.error(error);
            })
        ;
    }
});

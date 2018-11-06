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
import 'lightgallery/dist/css/lightgallery.css';
import '../css/gallery.scss';

import $ from 'jquery';
import 'lightgallery/dist/js/lightgallery.js';

var setupImages = function(data) {
    var galleryElement = document.getElementById('lightgallery');

    for (var index in data) {
        var value = data[index];

        // <div class="col-lg-3 col-md-4 col-xs-6">
        // <a href="#" class="d-block mb-4 h-100">
        // <img class="img-fluid img-thumbnail" src="http://placehold.it/400x300" alt="">
        // </a>
        // </div>

        var imgElem = document.createElement('img');
        imgElem.src = value.thumbnail;
        imgElem.classList.add('img-fluid');
        imgElem.classList.add('img-thumbnail');

        var aElem = document.createElement('a');
        aElem.href = value.path;
        aElem.classList.add('galleryitem');
        aElem.classList.add('d-inline-block');
        aElem.classList.add('mb-4');
        aElem.classList.add('h-100');
        aElem.setAttribute('data-src', value.path);
        aElem.appendChild(imgElem);

        var divElem = document.createElement('div');
        divElem.classList.add('col-lg-3');
        divElem.classList.add('col-md-4');
        divElem.classList.add('col-xs-6');
        divElem.appendChild(aElem);

        galleryElement.appendChild(divElem);
    }

    return true;
}

$(document).ready(function() {
    $.ajax('/images', {
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Bilder konnten nicht geladen werden.');
            console.log(textStatus);
            console.error(errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
            if (setupImages(data.data)) {
                $("#lightgallery").lightGallery({
                    selector: '.galleryitem'
                });
            }
        }
    });
});

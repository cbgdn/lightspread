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
import '../css/gallery.scss';

import $ from 'jquery';

var setupImages = function(data) {
    var galleryElement = document.getElementById('lightgallery');
    var baseUrl = '/images/';

    for (var index in data) {
        var value = data[index];

        var imgElem = document.createElement('img');
        imgElem.src = baseUrl + value.name;

        var aElem = document.createElement('a');
        aElem.src = baseUrl + value.name;
        aElem.appendChild(imgElem);

        galleryElement.appendChild(aElem);
    }
}

$(document).ready(function() {
    $.ajax('/images', {
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Bilder konnten nicht geladen werden.');
            console.log(textStatus);
            console.error(errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
            setupImages(data.data);
        }
    });
});

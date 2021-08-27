# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased](https://github.com/Art4/lightspread/compare/1.2.0...HEAD)

## Changed

- Update Electron von 7.3.3 auf 13.2.2
- Update lightgallery von 1.10.0 auf 2.2.0
- Update webpack von 4.41.2 auf 5.51.1
- Alle Abhängigkeiten wurden aktualisiert

## [1.2.0 - 2019-11-29](https://github.com/Art4/lightspread/compare/1.1.0...1.2.0)

## Changed

- Update Electron von 3.1.13 auf 7.1.2
- Alle Abhängigkeiten wurden aktualisiert

### Fixed

- Vorschaubilder werden im richtigen Unterordner angelegt

## [1.1.0] - 2019-01-10

### Changed

- Bessere Trennung des Codes für App und Gallery-Webseite
- Alle Abhängigkeiten wurden aktualisiert

### Fixed

- In der Gallery wird bei der Bildanzeige keine Scrollbar mehr angezeigt

## [1.0.0] - 2018-12-06

### Changed

- Im Autostartmodus verschwinden die Steuererlemente der Gallery weiterhin nach 2 Sekunden, auf dem Smartphone erst nach 10 Sekunden
- In der Gallery wird der Dateiname nicht mehr unter dem Bild angezeigt

## [1.0.0-beta.6] - 2018-11-27

### Changed

- Alle Abhängigkeiten wurden aktualisiert
- Das Hauptfenster wird minimiert, bevor die Gallery im Vollbild startet

### Fixed

- Drag- und Swipe-Support deaktiviert, wenn wir uns in der Autostart-Gallery befinden, damit die Maus ausgeblendet wird

## [1.0.0-beta.5] - 2018-11-22

### Fixed

- Die Gallery im Vollbild kann mit Escape oder F11 beendet und mit F11 wieder gestartet werden

## [1.0.0-beta.4] - 2018-11-19

### Added

- LightSpread startet im Fullscreen-Fenster sofort mit dem ersten Bild als Autoplay
- Beim Import der Bilder wird ein Fortschrittsbalken angezeigt

## [1.0.0-beta.3] - 2018-11-19

### Added

- LightSpread kann die Galerie in einem eigenen Fullscreen-Fenster starten, alternativ kann weiterhin der native Browser verwendet werden

### Changed

- In der Galerie wird die Maus zusammen mit den Steuerungselementen nach 2 Sekunden ausgeblendet
- Alle Abhängigkeiten wurden aktualisiert

### Fixed

- Bilder im Cacheordner werden rekursiv gelöscht, bevor neue Bilder erstellt werden

## [1.0.0-beta.2] - 2018-11-16

### Changed

- Bilder werden bei Ordnerwahl kopiert auf max 4096 Pixel runterskaliert
- Autoplay zeigt keinen Progress mehr an
- Autoplay wechselt Bilder nach 8 Sekunden statt nach 5 Sekunden
- Port für Webserver wurde von 3000 auf 8080 geändert
- Alle Abhängigkeiten wurden aktualisiert

### Fixed

- Vorschaubilder werden jetzt in Projektordner statt Temp-Ordner erstellt

## [1.0.0-beta.1] - 2018-11-09

### Added

- Einfaches Fenster mit Buttons, um den Bilderordner zu wählen, den Server zu starten und den Browser zu öffnen
- Thumbnails werden erstellt, sobald ein Ordner gewählt wurde
- Zeige Bilder mit Autoplay und Fullscreen dank [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/)
- Diese CHANGELOG.md Datei

[1.1.0]: https://github.com/Art4/lightspread/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/Art4/lightspread/compare/1.0.0-beta.6...1.0.0
[1.0.0-beta.6]: https://github.com/Art4/lightspread/compare/1.0.0-beta.5...1.0.0-beta.6
[1.0.0-beta.5]: https://github.com/Art4/lightspread/compare/1.0.0-beta.4...1.0.0-beta.5
[1.0.0-beta.4]: https://github.com/Art4/lightspread/compare/1.0.0-beta.3...1.0.0-beta.4
[1.0.0-beta.3]: https://github.com/Art4/lightspread/compare/1.0.0-beta.2...1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/Art4/lightspread/compare/1.0.0-beta.1...1.0.0-beta.2
[1.0.0-beta.1]: https://github.com/Art4/lightspread/compare/898856bb0c079e4e823d68441762a4782621dfeb...1.0.0-beta.1

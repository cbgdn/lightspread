<template>
  <div id="wrapper">
    <header class="header">
        <img class="logo" src="~@/assets/logo-512.png" alt="electron-vue">
        <h1>LightSpread</h1>
    </header>
    <p class="text-muted"><a @click="open('https://github.com/Art4/lightspread')"><span class="ls-version">LightSpread</span></a> ist lizensiert unter der <a @click="open('https://www.gnu.org/licenses/gpl')">GNU GPL-3.0</a>.</p>
    <main>
        <div class="row">
            <div class="col-sm-8">
                <h2><span class="path-selected-indicator far fa-circle"></span> 1. Bilder importieren</h2>
                <div id="import-status"><i>Bitte wähle einen Ordner</i></div>
            </div>
            <div class="col-sm-4">
                <div>
                    <button id="folder-selector" class="btn btn-primary">Ordner wählen</button>
                </div>
            </div>
            <div class="col-sm-8">
                <h2 class="text-muted"><span class="server-run-indicator far fa-circle"></span> 2. Server starten</h2>
                <div id="server-status">Server noch nicht gestartet</div>
            </div>
            <div class="col-sm-4">
                <div>
                    <button id="server-switch" class="btn btn-secondary" disabled>Server starten</button>
                </div>
            </div>
            <div class="col-sm-8">
                <h2 class="text-muted"><span class="gallery-start-indicator fas fa-rocket"></span> 3. Galerie öffnen</h2>
            </div>
            <div class="col-sm-4">
                <div>
                    <button id="gallery-start" class="btn btn-secondary" disabled>Galerie starten</button>
                    <button id="browser-start" class="btn btn-link" disabled>Oder im Browser öffnen</button>
                </div>
            </div>
        </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation';

  export default {
      name: 'overview',
      // components: { SystemInformation },
      methods: {
          open (link) {
              this.$electron.shell.openExternal(link);
          }
      }
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 20px;
    width: 100vw;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .header img {
    height: 56px;
    width: 56px;
    margin-right: 10px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>

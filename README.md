<p align="center">
<img src="https://raw.githubusercontent.com/wsg-ariadne/ariadne/main/public/assets/logo.svg" width="200" alt="ariadne"><br><br>
<a href="https://chrome.google.com/webstore/detail/ariadne/dpnmlgmdfkpbbmjilppkbkhahmlckajg"><img src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/iNEddTyWiMfLSwFD6qGq.png" width="150" alt="Available in the Chrome Web Store"></a>
</p>

# ariadne

![build-extension workflow](https://github.com/wsg-ariadne/ariadne/actions/workflows/build-extension.yml/badge.svg)

Ariadne is a browser extension that helps you become aware of [deceptive design](https://deceptive.design) in cookie banners on the Web. It does this through a set of specifically-trained machine learning models that detect deceptive design patterns within the language and the design of cookie banners.

It is compliant with Manifest V3, the new extension API for Google Chrome and Chromium-based browsers. It is also compatible with Firefox, for which it uses the older Manifest V2 API, since the V3 API is not yet fully supported [as of the time of writing.](https://bugzilla.mozilla.org/show_bug.cgi?id=1578284)

Ariadne is part of an ongoing research project on the automated detection of deceptive design in cookie banners.

## Installation

The latest builds of Ariadne are published on the [Releases page.](https://github.com/wsg-ariadne/ariadne/releases/latest)

### Firefox

- Download the **`ariadne-mv2`** ZIP file.
- Go to `about:debugging#/runtime/this-firefox` in Firefox.
- Click on `Load Temporary Add-on...` and select the ZIP file.

### Google Chrome, Chromium

Ariadne can be installed from the Chrome Web Store. Just click the Chrome Web Store badge at the top of this README :-)

Alternatively, you can install it manually:

- Download the **`ariadne-mv3`** ZIP file.
- Go to `chrome://extensions` in Chrome.
- Enable `Developer mode` in the top right corner.
- Drag and drop the ZIP file into the browser window.

The process should be similar for other Chromium-based browsers (Edge, Opera, Brave, etc.), just make sure to enable the developer mode in the extensions page before installing the extension.

Ariadne should now be installed. You can now visit any website and click on the extension icon to see stats for the current page.

## Development

### Prerequisites

You will need [Node.js](https://nodejs.org/en/) (v16 or higher). We recommend installing the latest LTS version.

Install the dependencies:

```bash
npm install
```

### Building

To build the extension **in development mode**, run:

```bash
# Firefox
npm run dev
# Chrome
npm run dev:v3
```

Vite will automatically rebuild the extension when you make changes to the source code. You will need to reload the extension in your browser to see the changes.

In development mode, the extension will attempt to contact [Dionysus](https://github.com/wsg-ariadne/dionysus) at `http://localhost:5000` for the data. Make sure to run Dionysus locally before running the extension in this mode. You can change this by setting the `VITE_API_URL` environment variable in the `.env.development` file.

To build the extension **in production mode**, run:

```bash
# Firefox
npm run build
# Chrome
npm run build:v3
```

In production mode, the extension will attempt to contact Dionysus at `https://ariadne.dantis.me`. You can change this by setting the `VITE_API_URL` environment variable in the `.env.production` file.

### Installing

The built extension files will be stored in `dist/` for Firefox and `dist-v3/` for Chrome. You can load the extension in your browser by following the instructions in the [Installation](#installation) section, but instead of loading the ZIP file,

- load the `manifest.json` file in `dist/` for Firefox, or
- click `Load unpacked` and select the `dist-v3/` directory for Chrome.

class LinkIO {
  maxURLLength = 4_000;
  baseURL;
  cbPackData;
  cbUnpackData;
  cbDataIsDefault;

  constructor(baseURL, cbPackData, cbUnpackData, cbDataIsDefault = () => false) {
    this.baseURL = baseURL;
    this.cbPackData = cbPackData;
    this.cbUnpackData = cbUnpackData;
    this.cbDataIsDefault = cbDataIsDefault;
    this.shareURL = this.baseURL;

    // If this optional parameter is not supplied, assume data is never default (share URL must always be generated)
    if (typeof cbDataIsDefault === 'undefined') {
      this.cbDataIsDefault = () => false;
    }
  }

  /*
  TODO createCopyShareURLInput
  with automatic linking to updateShareURL
   */

  /*
  use to create and bind a new share URL button
   */
  createCopyShareURLButton = (
    container,
    elButtonId,
    elSuccessId = '',
    elFailId = '',
    extraClasses = "",
    buttonText = "Copy",
    buttonTitle = "Copy share URL"
  ) => {
    container.append(
      `<button title="${buttonTitle}" class='_copyShareURLButton ${extraClasses}' id='${elButtonId}'>${buttonText}</button>`
    );

    $(`#${elButtonId}`).click(() => {
      this.copyShareURL(elSuccessId, elFailId)
    });
  }

  /*
  use for an existing share URL button
   */
  bindCopyShareURLButton = (
    elButtonId,
    elSuccessId = '',
    elFailId = ''
  ) => {

    $(`#${elButtonId}`).click(() => {
      this.copyShareURL(elSuccessId, elFailId)
    });
  }

  compress = data => {
    return LZString.compressToEncodedURIComponent(data);
  }

  decompress = data => {
    return LZString.decompressFromEncodedURIComponent(data);
  }

  // getBaseURL = () => {
  //   let L = window.location;
  //   return `${L['origin']}${L['pathname']}`;
  // }

  updateShareURL = () => {
    // let baseURL = this.getBaseURL();

    if (this.cbDataIsDefault()) {
      this.shareURL = this.baseURL;

    } else {
      let params = this.packURLParams();
      this.shareURL = `${this.baseURL}?${params}`;
    }

    return this.shareURL;
  }

  copyShareURL = (elSuccessId, elFailId) => {
    this.updateShareURL();
    if (this.shareURLIsValid()) {
      Copy.writeToClipboard(this.shareURL);
      Copy.ping($(`#${elSuccessId}`));
    } else {
      Copy.ping($(`#${elFailId}`));
    }
  }

  shareURLIsValid = () => {
    return this.shareURL.length <= this.maxURLLength;
  }

  packURLParams = () => {
    let data = this.cbPackData();
    let packed = {};
    for (let k of Object.keys(data)) {
      packed[k] = encodeURIComponent(data[k]);
    }
    return new URLSearchParams(packed);
  };

  unpackURLParams = () => {
    let packed = new URLSearchParams(location.search);
    let data = {};
    for (let k of packed.keys()) {
      data[k] = decodeURIComponent(packed.get(k));
    }
    return data;
  }

  readURL = () => {
    this.cbUnpackData(this.unpackURLParams());
  }
}

/**
 * Usage:
 * 
 * (1) Instantiate, passing a base URL, callbacks to pack and unpack data and optionally
 * a callback to say whether the data is default (so shareURL will = baseURL).
 * 
 * (2) CB to pack is a function that returns an object mapping keys to data
 * values for your app. Optionally, you can use the compress functions here.
 * (i.e. compress going into the dictionary, decompress coming out of it.)
 * Regular strings should not use this; in fact, I'm not clear on when
 * it actually saves space. Note that you are responsible for short keys.
 * 
 * (3) CB to unpack takes such a mapping back and does something with it. (This is
 * where to reset app state, etc.) Don't forget to decompress what you compressed.
 * 
 * (4) Use createCopyShareURLButton, passing it the IDs of a success
 * notification div and fail notification div to be pinged.
 * 
 * Examples of CSS to be applied to these:
 * 
 
.copyPingNotification {
    pointer-events: none;
    padding: 0 .5em;
    font-size: .9em;
    line-height: 1.7em;
}

.copyPingNotification.pinged {
    background: rgba(255,255,255, 0.25);
    color: rgba(255, 255, 255, 1);
}

.copyPingNotification:not(.pinged) {
    background: rgba(255,255,255, 0);
    color: rgba(255, 255, 255, 0);
}

.fade {
    transition-duration: 1s;
    transition-timing-function: linear;
}

*/

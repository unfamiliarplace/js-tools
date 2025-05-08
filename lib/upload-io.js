class UploadIO {
  static getFile = (event, callback) => {
    const input = event.target;
    if ("files" in input && input.files.length > 0) {
      UploadIO.sendFileContent(callback, input.files[0], input.value);
    }
  };

  static sendFileContent = (callback, file, filename) => {
    UploadIO.readFileContent(file)
      .then((content) => {
        callback(content, filename);
      })
      .catch((error) => console.log(error));
  };

  static readFileContent = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
}

class UploadButton {
  static create = (
    container,
    callback,
    elId,
    extraClasses = "",
    buttonText = "Upload",
    buttonTitle = "Browse for and upload file"
  ) => {

    container.append(
      `<button title="${buttonTitle}" class='_uploadButton ${extraClasses}' id='${elId}'>${buttonText}</button>`
    );

    UploadButton.bindElement($(`#${elId}`));

    let button = $(`#${elId}`);
  };

  static bind = (button, callback) => {
    let inputId = button.attr('id') + '_input';
    $('body').append(
        `<input type='file' id='${inputId}' style="display: none; visibility: hidden;">`
    );

    let input = $(`#${inputId}`);

    button.click(() => {
      input.click();
    });

    input.change(e => {UploadIO.getFile(e, callback); } );
  }
}

class Dropzone {
  static css_dz_input = "display: none;";

  static getFile = (e, callback) => {
    UploadIO.getFile(e, callback);
  }

  static getDroppedFile = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();

    // JQ has a separate event that doesn't contain the file
    // Access it through the original event
    let oe = e.originalEvent;
    if (oe.dataTransfer.files.length) {
      UploadIO.sendFileContent(callback, oe.dataTransfer.files[0], oe.dataTransfer.files[0].name);
    }
  };
}

class DropzoneUniversal {
  static css_dz_universal =
    "display: none; position: absolute; width: 100%; height: 100%; z-index: 99999; background: rgba(255, 255, 255, 0.7); top: 0; left: 0;";

  static showDropzone = (e, dz) => {
    e.preventDefault();
    e.stopPropagation();
    dz.css("display", "block");
  };

  static hideDropzone = (e, dz) => {
    e.preventDefault();
    e.stopPropagation();
    dz.css("display", "none");
  };

  static create = (
    container,
    callback,
    optionalId = "",
    extraClasses = ""
  ) => {
    let dzId = optionalId === "" ? "_dz" : optionalId;
    let inputId = `${dzId}_input`;

    let dzEl = `<div class="dropzone dz_universal ${extraClasses}" id="${dzId}" style="${DropzoneUniversal.css_dz_universal}"><input type="file" id=${inputId} class="dropzoneInput" style="${Dropzone.css_dz_input}"></div>`;

    container.append(dzEl);

    let dz = $(`#${dzId}`);
    let dzInput = $(`#${inputId}`);

    container.on("dragover", (e) => {
      DropzoneUniversal.showDropzone(e, dz);
    });

    dz.on("dragleave dragexit", (e) => {
      DropzoneUniversal.hideDropzone(e, dz);
    });

    dzInput.change((e) => {
      Dropzone.getFile(e, callback);
      DropzoneUniversal.hideDropzone(e, dz);
    });
    dz.on("drop", (e) => {
      Dropzone.getDroppedFile(e, callback);
      DropzoneUniversal.hideDropzone(e, dz);
    });
  };
}

class DropzoneLocal {

  static showDragging = (e, dz) => {
    e.preventDefault();
    dz.addClass("dropzoneDragging");
    e.originalEvent.dataTransfer.dropEffect = "copy";
  };

  static hideDragging = (e, dz) => {
    e.preventDefault();
    dz.removeClass("dropzoneDragging");
  };

  static create = (
    container,
    callback,
    dzId,
    extraClasses = "",
    text = "Drag & drop",
    clickable = true
  ) => {
    let inputId = `${dzId}_input`;

    let promptEl =
      text === "" ? "" : `<div class="dropzonePrompt">${text}</div>`;

    let dzEl = `<div class="dropzone dz_local ${extraClasses}" id="${dzId}">${promptEl}<input type="file" id=${inputId} class="dropzoneInput" style="${Dropzone.css_dz_input}"></div>`;

    container.append(dzEl);

    let dz = $(`#${dzId}`);
    let dzInput = $(`#${inputId}`);

    // Add clickability
    if (clickable) {
      dz.click((e) => {
        if (!$(e.target).is(dzInput)) {
          dzInput.click();
        }
      });
    }

    // styling
    dz.on("dragover", (e) => {
      DropzoneLocal.showDragging(e, dz);
    });
    dz.on("dragend dragleave dragexit", (e) => {
      DropzoneLocal.hideDragging(e, dz);
    });

    dzInput.change((e) => {
      Dropzone.getFile(e, callback);
      DropzoneLocal.hideDragging(e, dz);
    });
    dz.on("drop", (e) => {
      Dropzone.getDroppedFile(e, callback);
      DropzoneLocal.hideDragging(e, dz);
    });
  };
}

// Test

const _testCallback = (content, filename) => {
  $('#filenameTarget').val(filename);
  $("#contentTarget").text(content);
}

const _testCreateUploadButton = () => {
  UploadButton.create($('#testAppendTo'), _testCallback, 'btnUploadTo');
}

const _testCreateLocalDropzone = () => {
  DropzoneLocal.create($("#testAppendTo"), _testCallback, "dzUpload");
};

const _testCreateUniversalDropzone = () => {
  DropzoneUniversal.create($("#app"), _testCallback, "dzUpload");
};

// $(document).ready(_testCreateLocalDropzone);
// $(document).ready(_testCreateUniversalDropzone);
// $(document).ready(_testCreateUploadButton);

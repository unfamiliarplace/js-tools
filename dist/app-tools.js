class Tools {

  static proportion(percent, n) {
    return Math.round(percent / 100 * n);
  }

  static shuffle(items, copy) {

    if (typeof copy === undefined) {
      copy = false;
    }

    if (copy) {
      items = items.slice();
    }

    // Durstenfeld shuffle stackoverflow.com/a/12646864/5228348
    for (let i = items.length - 1; i > 0; i--) {
      const j = Tools.random(i);
      [items[i], items[j]] = [items[j], items[i]];
    }

    // for good measure
    return items;
  }

  static random(min, max) {
    if (typeof max === 'undefined') {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomChoice(arr, pop) {
    let i = Math.floor(Math.random() * arr.length);
    if ((typeof pop !== 'undefined') && pop) {
      return arr.splice(i, 1);
    } else {
      return arr[i];
    }
  }

  static randomColour(min, max) {

    if ((typeof min === undefined) || (min < 0)) {
      min = 0;
    }

    if ((typeof max === undefined) || (max > 255)) {
      max = 255;
    }

    let r = Tools.random(min, max);
    let g = Tools.random(min, max);
    let b = Tools.random(min, max);

    return [r, g, b];
  }

  static rotate(el, degrees, seconds) {
    if (typeof seconds === 'undefined') seconds = 0.5;

    let ease = `all ${seconds}s ease-in-out`;
    el.css('-webkit-transition', ease);
    el.css('-moz-transition', ease);
    el.css('-o-transition', ease);
    el.css('transition', ease);

    let rotate = `rotate(${degrees}deg)`;
    el.css('webkitTransform', rotate);
    el.css('mozTransform', rotate);
    el.css('msTransform', rotate);
    el.css('oTransform', rotate);
    el.css('transform', rotate);
  }

  static disableInput(disable) {
    $("input, button").prop("disabled", disable);
    Tools.waitCursor(disable);
  }

  static toggleDisableInput(ms) {
    let states = [];
    $("input, button").each(function (i, v) {
      states.push($(v).prop('disabled'));
    });

    $("input, button").prop("disabled", true);
    Tools.waitCursor(true);

    setTimeout(() => {
      $("input, button").prop('disabled', function (i, v) {
        return states[i];
      });
      Tools.waitCursor(false);
    }, ms);
  }

  static waitCursor(on) {
    if (on)
      $("#app, input, button, span, div, label").addClass('waitCursor');
    else {
      $("#app, input, button, span, div, label").removeClass('waitCursor');
    }
  }

  static getTopLeft(el, heightRequirement, widthRequirement) {
    let rect = el[0].getBoundingClientRect();

    let top = ((window.innerHeight - rect.bottom) < heightRequirement) ? rect.bottom - heightRequirement : rect.top;
    let left = ((window.innerWidth - rect.right) < widthRequirement) ? rect.right - widthRequirement : rect.left;

    top += window.scrollY;
    left += window.scrollX;
    return {'top': top, 'left': left};
  }

  static getTextareaLines = (el) => {

    let lines = [];
    for (let line of el.val().split(/\n/)) {
      if (line.trim() !== "") {
        lines.push(line);
      }
    }
    return lines;
  }

  static setTextareaLines = (el, items) => {
    el.val(items.join("\n"));
  }
}

class Copy {
  static ping = (notif, msBeforeFade = 1500, msBeforeHide = 2500) => {
    notif.removeClass("hide");
    notif.removeClass("fade");
    notif.removeClass("pinged");

    notif.addClass("pinged");
    setTimeout(() => {
      notif.removeClass("pinged");
      notif.addClass("fade");
    }, msBeforeFade);

    setTimeout(() => {
      notif.removeClass("fade");
      notif.addClass("hide");
    }, msBeforeHide);
  }

  static pingButton = (button, msBeforeFade = 1500, msBeforeHide = 2500) => {
    let parent = button.parent();
    let parentId = parent.attr("id");

    let pingId = `${parentId}-ping`;
    parent.append(`<div id='${pingId}' class="buttonPing">Copied!</div>`);

    let ping = $(`#${pingId}`);
    ping.css("width", button.css("width"));
    ping.css("height", button.css("height"));
    ping.addClass("pinged");

    button.addClass("hide");

    setTimeout(() => {
      ping.removeClass("pinged");
      ping.addClass("fade");
    }, msBeforeFade);

    setTimeout(() => {
      ping.remove();
      button.removeClass("hide");
    }, msBeforeHide);
  };

  // https://www.30secondsofcode.org/js/s/copy-to-clipboard
  static writeToClipboard = data => {
    const el = document.createElement("textarea");
    el.value = data;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };

  // Example of CSS to go with ping
// #copyPingNotification {
//   font-style: italic;
//   padding: 10px;
//   pointer-events: none;
//   width: 75px;
//   border-radius: 25px;
// }
//
// #copyPingNotification.pinged {
//   background: rgba(255,255,255, 0.5);
//   color: rgba(255, 255, 255, 1);
// }
//
// #copyPingNotification:not(.pinged) {
//   background: rgba(255,255,255, 0);
//   color: rgba(255, 255, 255, 0);
// }
//
// .fade {
//   transition-duration: 1s;
//   transition-timing-function: linear;
// }


  // Example of CSS to go with pingButton

// .buttonPing {
//   box-sizing: border-box;
//   position: relative;
//   top: 0;
//   left: 0;
//   z-index: 99;
//   text-align: center;
//   font-style: italic;
//   font-size: 14px;
//   padding: 10px;
//   pointer-events: none;
//   line-height: 16px;
//   border-radius: 5px;
// }
//
// .pinged {
//   background: #647e99;
//   color: rgba(255, 255, 255, 1);
// }
//
// .fade {
//   transition-duration: 1s;
//   transition-timing-function: linear;
// }
}

class _Stage {
  constructor() {
    this.scenes = {};
    this.active = null;
    this.default = null;
  }

  addScene = (s) => {
    this.scenes[s.name] = s;
  };

  setDefault = (sid) => {
    this.default = sid;
  };

  showing = (sid) => {
    return this.active === sid;
  };

  // lol
  hiding = (sid) => {
    return !this.showing(sid);
  };

  toggle = (sid) => {
    if (this.showing(sid)) {
      this.hide(sid);
    } else {
      this.show(sid);
    }
  };

  show = (sid) => {
    this.hideAll();
    this.scenes[sid].show();
    this.active = sid;
  };

  hide = (sid) => {
    this.scenes[sid].hide();

    if (this.default !== null) {
      this.show(this.default);
    } else {
      this.active = null;
    }
  };

  hideAll = () => {
    for (let s of Object.values(this.scenes)) {
      s.hide();
    }
  };
}

class _Scene {
  // panel id
  // toggler id
  constructor(name, pid, tid, actors) {
    this.name = name;
    this.pid = pid;
    this.tid = tid;

    this.panel = $(pid);
    this.toggler = $(tid);
    this.actors = actors;

    this.toggler.click(() => {
      stage.toggle(this.name);
    });
  }

  toggle = () => {
    if (this.panel.hasClass("hide")) {
      this.show();
    } else {
      this.hide();
    }
  };

  hide = () => {
    this.panel.addClass("hide");
    this.panel.css("z-index", "10");
    this.toggler.css("z-index", "11");
  };

  show = () => {
    this.panel.removeClass("hide");
    this.panel.css("z-index", "20");
    this.toggler.css("z-index", "21");
  };
}

class FontAwesome {
  static fa(key) {
    return `<i class="fas fa-${key}"></i>`;
  }
}

class Jukebox {
  /** @type object */ sounds;
  /** @type int */ savedVolume;
  /** @type boolean */ disabled;

  constructor() {
    this.sounds = {};
    this.savedVolume = 50;
    this.disabled = false;
    this.playing = null;
  }

  add(key, audio) {
    this.sounds[key] = audio;
    this.sounds[key].volume = this.savedVolume / 100;
  }

  addBySelector(key, selector) {
    this.add(key, $(selector)[0]);
  }

  addByElement(key, element) {
    this.add(key, element[0]);
  }

  addByURL(key, url) {
    let id = `jb-audio-${key}`;
    let element = `<audio id="${id}" src="${url}" style="display; none; visibility: hidden;" preload="auto"></audio>`;
    $('#app').append(element);
    this.addBySelector(key, `#${id}`);
  }

  play(key) {
    if (!this.disabled) {
      this.sounds[key].play();
    }
  }

  pause(key) {
    if (!this.disabled) {
      this.sounds[key].pause();
    }
  }

  stop(key) {
    if (!this.disabled) {
      this.sounds[key].pause();
      this.sounds[key].currentTime = 0;
    }
  }

  disable(value) {
    this.disabled = value;
  }

  volume(value) {
    if (typeof value === 'undefined') {
      // get
      return this.savedVolume;

    } else {
      // set
      this.savedVolume = value;
      for (let k in this.sounds) {
        this.sounds[k].volume = this.savedVolume / 100;
      }
    }
  }
}

class Scene {
  name;
  light;
  panel;
  active;

  constructor(panel, name, light) {
    this.panel = panel;
    this.name = name;
    this.light = light;
    this.active = false;
  }

  show() {
    this.panel.show();
    this.active = true;
  }

  hide() {
    this.panel.hide();
    this.active = false;
  }

  toggle() {
    if (this.active) {
      this.hide();
    } else {
      this.show();
    }
  }
}


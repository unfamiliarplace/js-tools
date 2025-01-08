class Speech {
    /*
    Return a list of tuples of the form [language key, language nice name]
     */
    static getVoiceLanguages = () => {
        if (typeof speechSynthesis === "undefined") {
            return [];
        }

        let key, name;
        let keyToName = {};
        let keys = new Set();
        let voices = speechSynthesis.getVoices();

        for (let voice of voices) {
            if (voice.lang.includes(" - ")) {
                name = voice.lang.split(" - ")[1];
            } else {
                name = voice.lang;
            }

            key = voice.lang.toLowerCase();
            keyToName[key] = name;
            keys.add(key);
        }

        let voiceLanguages = [];
        for (let key of keys) {
            voiceLanguages.push([key, keyToName[key]]);
        }

        return voiceLanguages;
    };

    static prefix = (languageCode) => {
        return languageCode.split('-')[0];
    }

    /**
     * Return voices that match the given language.
     * In fuzzy mode, return voices whose prefix matches the given language's prefix.
     * By default, fuzzy mode is false.
     * However, in autofuzz mode (default true), finding no voices means try again in fuzzy mode.
     */
    static getVoicesForLanguage = (needleCode, fuzzy, autofuzz) => {
        if (typeof speechSynthesis === "undefined") {
            return [];
        }

        if (typeof fuzzy === 'undefined') {
            fuzzy = false;
        }

        if (typeof autofuzz === 'undefined') {
            autofuzz = true;
        }

        let allVoices = speechSynthesis.getVoices();

        let voices = [];
        let voiceCode;
        for (let voice of allVoices) {
            voiceCode = voice.lang.toLowerCase();

            if ((voiceCode === needleCode)
                || (fuzzy && (Speech.prefix(voiceCode) === Speech.prefix(needleCode)))) {
                voices.push(voice);
            }
        }

        // If we found no voices in non-fuzzy mode, and autofuzz is on, try again in fuzzy mode
        if ((autofuzz && (!fuzzy)) && (voices.length === 0)) {
            fuzzy = true;
            for (let voice of allVoices) {
                voiceCode = voice.lang.toLowerCase();

                if ((voiceCode === needleCode)
                    || (fuzzy && (Speech.prefix(voiceCode) === Speech.prefix(needleCode)))) {
                    voices.push(voice);
                }
            }
        }

        return voices;
    };

    static populateLanguageSelect = (select) => {
        let option, optionValue, optionText;

        select.empty();

        option = `<option value="--">--</option>`;
        select.append(option);

        for (let lang of Speech.getVoiceLanguages()) {
            optionValue = lang[0];
            optionText = lang[1];
            option = `<option value="${optionValue}">${optionText}</option>`;
            select.append(option);
        }
    };

    static populateVoiceSelect = (select, languageKey) => {
        let option, optionValue, optionText;

        select.empty();

        let voices = Speech.getVoicesForLanguage(languageKey);

        if (voices.length === 0) {
            option = `<option value="--">--</option>`;
            select.append(option);

        } else {
            for (let voice of voices) {
                optionValue = voice.name;
                optionText = voice.name.split(" - ")[0];
                option = `<option value="${optionValue}">${optionText}</option>`;
                select.append(option);
            }

            select.val(voices[0].name).change();
        }
    };

    /**
    Some language codes have prefix and suffix, e.g. fr-ca.
    For others, the code is only the prefix.

    Caller supplies a code. If it matches an available code exactly, return it.
        e.g. they supply fr and fr exists. Or they supply fr-ca and fr-ca exists.

    If they supply a prefix and a prefix-suffix code exists, return the first one.
        e.g. they supply fr. It does not exist, but fr-ca does. Return fr-ca.

    If they supply a prefix-suffix code and a prefix exists, return the first prefix-suffix option.
        e.g. they supply fr-ca. It does not exist, but fr does: beturn fr. Or fr-fr does: return fr-fr.
     **/
    static getClosestVoiceLanguageCode = (needleCode) => {
        let codes = [];
        let prefixes = [];
        let prefixToCodes = {};

        // tuples of the form [language code, nice name]
        let voiceLanguages = Speech.getVoiceLanguages();

        // Create a list of prefixes and a map of prefixes to the prefix-suffix keys
        let code, prefix;
        for (let tuple of voiceLanguages) {
            code = tuple[0];
            codes.push(code);

            prefix = code.split('-')[0];
            prefixes.push(prefix);

            if (!(prefix in prefixToCodes)) {
                prefixToCodes[prefix] = [];
            }
            prefixToCodes[prefix].push(code);
        }

        let needlePrefix = needleCode.split('-')[0];

        // If we have a language where the prefix is the whole key, e.g. 'zh'
        if (codes.includes(needleCode)) {
            return code;

        } else if (prefixes.includes(needlePrefix)) {
            prefixToCodes[needlePrefix].sort();
            return prefixToCodes[needlePrefix][0];

        } else {
            return undefined;
        }
    }

    static makeUtterance = (text, langCode, voiceName, volume, rate, pitch) => {

        let u = new SpeechSynthesisUtterance(text);

        if (typeof langCode !== "undefined") {
            u.lang = langCode;
        }

        if (typeof voiceName !== "undefined") {
            for (let voice of speechSynthesis.getVoices()) {
                if (voice.name === voiceName) {
                    u.voice = voice;
                    break;
                }
            }
        }

        if (typeof volume !== "undefined") {
            u.volume = volume;
        }
        if (typeof rate !== "undefined") {
            u.rate = rate;
        }
        if (typeof pitch !== "undefined") {
            u.pitch = pitch;
        }

        return u;
    };

    static speak = (text, langCode, voiceName, volume, rate, pitch) => {
        let u = Speech.makeUtterance(text, langCode, voiceName, volume, rate, pitch);
        speechSynthesis.speak(u);
    };
}

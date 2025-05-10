class Speech {

    /**
     * lol. Just need to poke it to force it to load
     */
    static wake = () => {
        Speech.getVoices();
    }

    /**
     * Wrapper for speechSynthesis.getVoices
     */
    static getVoices = () => {
        return speechSynthesis.getVoices();
    }

    /**
     Return a list of language codes
     */
    static getVoiceLanguages = () => {
        let codes = new Set();
        for (let voice of Speech.getVoices()) {
            codes.add(voice.lang);
        }
        return Array.from(codes);
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

        if (typeof fuzzy === 'undefined') {
            fuzzy = false;
        }

        if (typeof autofuzz === 'undefined') {
            autofuzz = true;
        }

        let allVoices = Speech.getVoices();

        let voices = [];
        for (let voice of allVoices) {
            if ((voice.lang === needleCode)
                || (fuzzy && (Speech.prefix(voice.lang) === Speech.prefix(needleCode)))) {
                voices.push(voice);
            }
        }

        // If we found no voices in non-fuzzy mode, and autofuzz is on, try again in fuzzy mode
        if ((autofuzz && (!fuzzy)) && (voices.length === 0)) {
            for (let voice of allVoices) {
                if (Speech.prefix(voice.lang) === Speech.prefix(needleCode)) {
                    voices.push(voice);
                }
            }
        }

        return voices;
    };

    /**
     * Only languages used by the available speechSynthesis voices.
     *
     * @param select
     * @param selectFirst
     * @param triggerChange
     */
    static populateVoiceLanguageSelect = (select, selectFirst, triggerChange) => {
        if (typeof selectFirst === 'undefined') {
            selectFirst = true;
        }

        if (typeof triggerChange === 'undefined') {
            triggerChange = true;
        }

        let option, optionValue, optionText;

        select.empty();

        option = `<option value="--">--</option>`;
        select.append(option);

        let languages = Speech.getVoiceLanguages();

        for (let langCode of languages) {
            optionValue = langCode;
            optionText = langCode;
            option = `<option value="${optionValue}">${optionText}</option>`;
            select.append(option);
        }

        // Automatically select the first one and trigger a change
        if (!!selectFirst) {
            select.val(languages[0]);
            if (!!triggerChange) {
                select.change();
            }
        }
    };

    static populateVoiceSelect = (select, selectNull, triggerChange) => {
        if (typeof selectNull === 'undefined') {
            selectNull = true;
        }

        if (typeof triggerChange === 'undefined') {
            triggerChange = true;
        }

        let option, optionValue, optionText;

        select.empty();

        let voices = Speech.getVoices(langCode);

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
        }

        if (!!selectNull) {
            select.val('--');
            if (!!triggerChange) {
                select.change();
            }
        }
    }

    static populateVoiceSelectForLanguage = (select, langCode, selectFirst, triggerChange) => {
        if (typeof selectFirst === 'undefined') {
            selectFirst = true;
        }

        if (typeof triggerChange === 'undefined') {
            triggerChange = true;
        }

        let option, optionValue, optionText;

        select.empty();

        let voices = Speech.getVoicesForLanguage(langCode);

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
        }

        // Automatically select the first one and trigger a change
        if (!!selectFirst) {
            select.val(voices[0].name);
            if (!!triggerChange) {
                select.change();
            }
        }
    };

    /**
     Some language codes have prefix and suffix, e.g. fr-ca.
     For others, the code is only the prefix.

     Caller supplies a code. If it matches an available code exactly, return it.
     e.g. they supply fr and fr exists. Or they supply fr-ca and fr-ca exists.

     If they supply a prefix and a prefix-suffix code exists, return the first one.
     e.g. they supply fr. It does not exist, but fr-ca does. Return fr-ca.

     If the supply a prefix-suffix code and a prefix-only code exists, return it.
     e.g. they supply fr-ca. It does not exist, but fr does: return fr.

     If they supply a prefix-suffix code and a prefix does not exist, but a prefix-suffix does, return the first one.
     e.g. they supply fr-ca. It does not exist, but fr-fr does: return fr-fr.

     If none of the above, return null.
     **/
    static getClosestLanguage = (needleCode) => {
        let codes = [];
        let prefixes = [];
        let prefixToCodes = {};

        // tuples of the form [language code, nice name]
        let voiceLanguages = Speech.getVoiceLanguages();

        // Create a list of prefixes and a map of prefixes to the prefix-suffix keys
        let prefix;
        for (let langCode of voiceLanguages) {
            codes.push(langCode);

            prefix = Speech.prefix(langCode);
            prefixes.push(prefix);

            if (!(prefix in prefixToCodes)) {
                prefixToCodes[prefix] = [];
            }
            prefixToCodes[prefix].push(langCode);
        }

        let needlePrefix = Speech.prefix(needleCode);

        // If we have a language where the prefix is the whole key, e.g. 'zh'
        if (codes.includes(needleCode)) {
            return needleCode;

        } else if (prefixes.includes(needlePrefix)) {
            prefixToCodes[needlePrefix].sort();
            return prefixToCodes[needlePrefix][0];
        }

        // else null
        return null;
    }

    static makeUtterance = (text, langCode, voiceName, volume, rate, pitch) => {

        let u = new SpeechSynthesisUtterance(text);

        if (typeof langCode !== "undefined") {
            u.lang = Speech.getClosestLanguage(langCode);
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

    static say = (text, langCode, voiceName, volume, rate, pitch) => {
        let u = Speech.makeUtterance(text, langCode, voiceName, volume, rate, pitch);
        speechSynthesis.speak(u);
    };
}

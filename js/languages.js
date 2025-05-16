class Language {
    code;
    ownName;
    engName;
    flag;

    constructor(code, ownName, engName, flag) {
        this.code = code;
        this.ownName = ownName;
        this.engName = engName;
        this.flag = flag;
    }

    parts = () => {
        return this.code.split('-');
    }

    prefix = () => {
        return this.parts()[0];
    }

    suffix = () => {
        let parts = this.parts();
        if (parts.length === 2) {
            return this.parts()[1];
        } else {
            return '';
        }        
    }

    formatBilingualName = () => {
        if (this.engName === this.ownName) {
            return this.ownName;
        } else {
            return `${this.engName} / ${this.ownName}`;
        }
    }
}

class Languages {
    static getLanguageByCode = code => {
        for (const lang of Languages.languages) {
            if (lang.code === code) {
                return lang;
            }
        }
    }

    static populateLanguageSelect = (select, selectNull, triggerChange) => {
        if (typeof selectNull === 'undefined') {
            selectNull = true;
        }

        if (typeof triggerChange === 'undefined') {
            triggerChange = true;
        }

        let option, optionValue, optionText;

        select.empty();

        option = `<option value="--">--</option>`;
        select.append(option);

        // Sort alphabetically by English name
        let sortedLanguages = Languages.languages;
        sortedLanguages.sort((a, b) => {
            a.engName.localeCompare(b.engName);
        })

        for (let lang of sortedLanguages) {
            optionValue = lang.code;
            optionText = lang.formatBilingualName();
            option = `<option value="${optionValue}">${optionText}</option>`;
            select.append(option);
        }

        if (!! selectNull) {
            select.val('--');
            if (!! triggerChange) {
                select.change();
            }
        }
    };

    static languages = [
        new Language('af-ZA', 'Afrikaans', 'Afrikaans', '🇿🇦'),
        new Language('sq-AL', 'Shqip', 'Albanian', '🇦🇱'),
        new Language('am-ET', 'አማርኛ', 'Amharic', '🇪🇹'),
        new Language('ar-SA', 'العربية', 'Arabic', '🇸🇦'),
        new Language('hy-AM', 'Հայերեն', 'Armenian', '🇦🇲'),
        new Language('my-MM', 'ဗမာ', 'Burmese', '🇲🇲'),
        new Language('eu-ES', 'Euskara', 'Basque', '🇪🇸'),
        new Language('bn-BD', 'বাংলা', 'Bengali', '🇧🇩'),
        new Language('bg-BG', 'Български', 'Bulgarian', '🇧🇬'),
        new Language('be-BY', 'Беларуская', 'Belarusian', '🇧🇾'),
        new Language('hr-HR', 'Hrvatski', 'Croatian', '🇭🇷'),
        new Language('da-DK', 'Dansk', 'Danish', '🇩🇰'),
        new Language('de-DE', 'Deutsch', 'German', '🇩🇪'),
        new Language('en-AU', 'English (Australia)', 'English (Australia)', '🇦🇺'),
        new Language('en-CA', 'English (Canada)', 'English (Canada)', '🇨🇦'),
        new Language('en-GB', 'English (United Kingdom)', 'English (United Kingdom)', '🇬🇧'),
        new Language('en-US', 'English (United States)', 'English (United States)', '🇺🇸'),
        new Language('et-EE', 'Eesti', 'Estonian', '🇪🇪'),
        new Language('tl-PH', 'Filipino', 'Filipino', '🇵🇭'),
        new Language('fi-FI', 'Suomi', 'Finnish', '🇫🇮'),
        new Language('fr-FR', 'Français (France)', 'French (France)', '🇫🇷'),
        new Language('fr-CA', 'Français (Canada)', 'French (Canada)', '🇨🇦'),
        new Language('gl-ES', 'Galego', 'Galician', '🇪🇸'),
        new Language('ka-GE', 'ქართული', 'Georgian', '🇬🇪'),
        new Language('gu-IN', 'ગુજરાતી', 'Gujarati', '🇮🇳'),
        new Language('he-IL', 'עברית', 'Hebrew', '🇮🇱'),
        new Language('hi-IN', 'हिन्दी', 'Hindi', '🇮🇳'),
        new Language('id-ID', 'Indonesia', 'Indonesian', '🇮🇩'),
        new Language('is-IS', 'Íslenska', 'Icelandic', '🇮🇸'),
        new Language('it-IT', 'Italiano', 'Italian', '🇮🇹'),
        new Language('ja-JP', '日本語', 'Japanese', '🇯🇵'),
        new Language('kn-IN', 'ಕನ್ನಡ', 'Kannada', '🇮🇳'),
        new Language('ca-ES', 'Català', 'Catalan', '🇪🇸'),
        new Language('kk-KZ', 'Қазақ тілі', 'Kazakh', '🇰🇿'),
        new Language('km-KH', 'ខ្មែរ', 'Khmer', '🇰🇭'),
        new Language('ko-KR', '한국어', 'Korean', '🇰🇷'),
        new Language('ky-KG', 'Кыргызча', 'Kyrgyz', '🇰🇬'),
        new Language('lo-LA', 'ລາວ', 'Lao', '🇱🇦'),
        new Language('lt-LT', 'Lietuvių', 'Lithuanian', '🇱🇹'),
        new Language('lv-LV', 'Latviešu', 'Latvian', '🇱🇻'),
        new Language('mk-MK', 'Македонски', 'Macedonian', '🇲🇰'),
        new Language('ml-IN', 'മലയാളം', 'Malayalam', '🇮🇳'),
        new Language('ms-MY', 'Bahasa Melayu (Malaysia)', 'Malay (Malaysia)', '🇲🇾'),
        new Language('mr-IN', 'मराठी', 'Marathi', '🇮🇳'),
        new Language('hu-HU', 'Magyar', 'Hungarian', '🇭🇺'),
        new Language('mn-MN', 'Монгол', 'Mongolian', '🇲🇳'),
        new Language('ne-NP', 'नेपाली', 'Nepali', '🇳🇵'),
        new Language('nl-NL', 'Nederlands', 'Dutch', '🇳🇱'),
        new Language('no-NO', 'Norsk', 'Norwegian', '🇳🇴'),
        new Language('pa-IN', 'ਪੰਜਾਬੀ', 'Punjabi', '🇮🇳'),
        new Language('fa-IR', 'فارسی', 'Persian', '🇮🇷'),
        new Language('pl-PL', 'Polski', 'Polish', '🇵🇱'),
        new Language('pt-BR', 'Português (Brasil)', 'Portuguese (Brazil)', '🇧🇷'),
        new Language('pt-PT', 'Português (Portugal)', 'Portuguese (Portugal)', '🇵🇹'),
        new Language('ro-RO', 'Română', 'Romanian', '🇷🇴'),
        new Language('ru-RU', 'Русский', 'Russian', '🇷🇺'),
        new Language('rm-CH', 'Rumantsch', 'Romansh', '🇨🇭'),
        new Language('si-LK', 'සිංහල', 'Sinhala', '🇱🇰'),
        new Language('sk-SK', 'Slovenčina', 'Slovak', '🇸🇰'),
        new Language('sl-SL', 'Slovenščina', 'Slovenian', '🇸🇮'),
        new Language('sr-RS', 'Српски', 'Serbian', '🇷🇸'),
        new Language('sw-TZ', 'Kiswahili', 'Swahili', '🇹🇿'),
        new Language('ta-IN', 'தமிழ்', 'Tamil', '🇮🇳'),
        new Language('te-IN', 'తెలుగు', 'Telugu', '🇮🇳'),
        new Language('th-TH', 'ไทย', 'Thai', '🇹🇭'),
        new Language('tr-TR', 'Türkçe', 'Turkish', '🇹🇷'),
        new Language('uk-UA', 'Українська', 'Ukrainian', '🇺🇦'),
        new Language('ur-PK', 'اردو', 'Urdu', '🇵🇰'),
        new Language('vi-VN', 'Tiếng Việt', 'Vietnamese', '🇻🇳'),
        new Language('zu-ZA', 'Zulu', 'Zulu', '🇿🇦'),
        new Language('az-AZ', 'Azərbaycan dili', 'Azerbaijani', '🇦🇿'),
        new Language('cs-CZ', 'Čeština', 'Czech', '🇨🇿'),
        new Language('zh-CN', '中文（简体）', 'Chinese (China)', '🇨🇳'),
        new Language('zh-HK', '中文（香港）', 'Chinese (Hong Kong)', '🇭🇰'),
        new Language('zh-TW', '中文（繁體）', 'Chinese (Taiwan)', '🇹🇼'),
        new Language('el-GR', 'Ελληνικά', 'Greek', '🇬🇷'),
        new Language('es-ES', 'Español (España)', 'Spanish (Spain)', '🇪🇸'),
        new Language('es-419', 'Español (Latinoamérica)', 'Spanish (Latin America)', '🌎'),
        new Language('es-US', 'Español (Estados Unidos)', 'Spanish (United States', '🇺🇸'),
        new Language('sv-SE', 'Svenska', 'Swedish', '🇸🇪'),
    ]
}

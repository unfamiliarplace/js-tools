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
        if (this.engName === lang.ownName) {
            return this.ownName;
        } else {
            return `${this.engName} / ${this.ownName}`;
        }
    }
}

class Languages {
    static getLanguageByCode = (code) => {
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
        new Language('af', 'Afrikaans', 'Afrikaans', '🇿🇦'),
        new Language('sq', 'Shqip', 'Albanian', '🇦🇱'),
        new Language('am', 'አማርኛ', 'Amharic', '🇪🇹'),
        new Language('ar', 'العربية', 'Arabic', '🇸🇦'),
        new Language('hy', 'Հայերեն', 'Armenian', '🇦🇲'),
        new Language('my', 'ဗမာ', 'Burmese', '🇲🇲'),
        new Language('eu', 'Euskara', 'Basque', '🇪🇸'),
        new Language('bn', 'বাংলা', 'Bengali', '🇧🇩'),
        new Language('bg', 'Български', 'Bulgarian', '🇧🇬'),
        new Language('be', 'Беларуская', 'Belarusian', '🇧🇾'),
        new Language('hr', 'Hrvatski', 'Croatian', '🇭🇷'),
        new Language('da', 'Dansk', 'Danish', '🇩🇰'),
        new Language('en', 'English', 'English', '🇨🇦'),
        new Language('en-AU', 'English (Australia)', 'English (Australia)', '🇦🇺'),
        new Language('en-CA', 'English (Canada)', 'English (Canada)', '🇨🇦'),
        new Language('en-GB', 'English (United Kingdom)', 'English (United Kingdom)', '🇬🇧'),
        new Language('en-US', 'English (United States)', 'English (United States)', '🇺🇸'),
        new Language('et', 'Eesti', 'Estonian', '🇪🇪'),
        new Language('tl', 'Filipino', 'Filipino', '🇵🇭'),
        new Language('fi', 'Suomi', 'Finnish', '🇫🇮'),
        new Language('fr-FR', 'Français (France)', 'French (France)', '🇫🇷'),
        new Language('fr-CA', 'Français (Canada)', 'French (Canada)', '🇨🇦'),
        new Language('gl', 'Galego', 'Galician', '🇪🇸'),
        new Language('ka', 'ქართული', 'Georgian', '🇬🇪'),
        new Language('gu', 'ગુજરાતી', 'Gujarati', '🇮🇳'),
        new Language('he', 'עברית', 'Hebrew', '🇮🇱'),
        new Language('hi', 'हिन्दी', 'Hindi', '🇮🇳'),
        new Language('id', 'Indonesia', 'Indonesian', '🇮🇩'),
        new Language('is', 'Íslenska', 'Icelandic', '🇮🇸'),
        new Language('it', 'Italiano', 'Italian', '🇮🇹'),
        new Language('ja', '日本語', 'Japanese', '🇯🇵'),
        new Language('kn', 'ಕನ್ನಡ', 'Kannada', '🇮🇳'),
        new Language('ca', 'Català', 'Catalan', '🇪🇸'),
        new Language('kk', 'Қазақ тілі', 'Kazakh', '🇰🇿'),
        new Language('km', 'ខ្មែរ', 'Khmer', '🇰🇭'),
        new Language('ko', '한국어', 'Korean', '🇰🇷'),
        new Language('ky', 'Кыргызча', 'Kyrgyz', '🇰🇬'),
        new Language('lo', 'ລາວ', 'Lao', '🇱🇦'),
        new Language('lt', 'Lietuvių', 'Lithuanian', '🇱🇹'),
        new Language('lv', 'Latviešu', 'Latvian', '🇱🇻'),
        new Language('mk', 'Македонски', 'Macedonian', '🇲🇰'),
        new Language('ml', 'മലയാളം', 'Malayalam', '🇮🇳'),
        new Language('ms-MY', 'Bahasa Melayu (Malaysia)', 'Malay (Malaysia)', '🇲🇾'),
        new Language('ms', 'Bahasa Melayu', 'Malay', '🇲🇾'),
        new Language('mr', 'मराठी', 'Marathi', '🇮🇳'),
        new Language('hu', 'Magyar', 'Hungarian', '🇭🇺'),
        new Language('mn', 'Монгол', 'Mongolian', '🇲🇳'),
        new Language('ne', 'नेपाली', 'Nepali', '🇳🇵'),
        new Language('nl', 'Nederlands', 'Dutch', '🇳🇱'),
        new Language('no', 'Norsk', 'Norwegian', '🇳🇴'),
        new Language('de', 'Deutsch', 'German', '🇩🇪'),
        new Language('pa', 'ਪੰਜਾਬੀ', 'Punjabi', '🇮🇳'),
        new Language('fa', 'فارسی', 'Persian', '🇮🇷'),
        new Language('pl', 'Polski', 'Polish', '🇵🇱'),
        new Language('pt-BR', 'Português (Brasil)', 'Portuguese (Brazil)', '🇧🇷'),
        new Language('pt-PT', 'Português (Portugal)', 'Portuguese (Portugal)', '🇵🇹'),
        new Language('ro', 'Română', 'Romanian', '🇷🇴'),
        new Language('ru', 'Русский', 'Russian', '🇷🇺'),
        new Language('rm', 'Rumantsch', 'Romansh', '🇨🇭'),
        new Language('si', 'සිංහල', 'Sinhala', '🇱🇰'),
        new Language('sk', 'Slovenčina', 'Slovak', '🇸🇰'),
        new Language('sl', 'Slovenščina', 'Slovenian', '🇸🇮'),
        new Language('sr', 'Српски', 'Serbian', '🇷🇸'),
        new Language('sw', 'Kiswahili', 'Swahili', '🇹🇿'),
        new Language('ta', 'தமிழ்', 'Tamil', '🇮🇳'),
        new Language('te', 'తెలుగు', 'Telugu', '🇮🇳'),
        new Language('th', 'ไทย', 'Thai', '🇹🇭'),
        new Language('tr', 'Türkçe', 'Turkish', '🇹🇷'),
        new Language('uk', 'Українська', 'Ukrainian', '🇺🇦'),
        new Language('ur', 'اردو', 'Urdu', '🇵🇰'),
        new Language('vi', 'Tiếng Việt', 'Vietnamese', '🇻🇳'),
        new Language('zu', 'Zulu', 'Zulu', '🇿🇦'),
        new Language('az', 'Azərbaycan dili', 'Azerbaijani', '🇦🇿'),
        new Language('cs', 'Čeština', 'Czech', '🇨🇿'),
        new Language('zh-HK', '中文（香港）', 'Chinese (Hong Kong)', '🇭🇰'),
        new Language('zh-TW', '中文（繁體）', 'Chinese (Taiwan)', '🇹🇼'),
        new Language('zh', '中文（简体）', 'Chinese', '🇨🇳'),
        new Language('el', 'Ελληνικά', 'Greek', '🇬🇷'),
        new Language('es-419', 'Español (Latinoamérica)', 'Spanish (Latin America)', '🌎'),
        new Language('es-US', 'Español (Estados Unidos)', 'Spanish (United States', '🇺🇸'),
        new Language('es', 'Español (España)', 'Spanish (Spain)', '🇪🇸'),
        new Language('sv', 'Svenska', 'Swedish', '🇸🇪'),
    ]
}

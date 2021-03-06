class ThemesSwitch {
    constructor(themes) {
        this.themes = themes
        this.themesSwitchEl = document.querySelector('#themesSwitch')

        this.themeLinkeEl = document.querySelector('#themeLink')

        this.init()
    }

    init() {
        // Get styles from hljs
        themeManager.getHljsStyles()

        // Get default theme name
        this.getDefaultThemeName()

        // Bind switching theme event
        this.listenToSwitchChange()

        // Bind listener for theme changing
        this.listenToTheme()
    }

    setPopupTheme(themeName) {
        if (themeName) {
            this.themeLinkeEl.href = `../lib/highlight/styles/${themeName}.css`
        }
    }

    listenToTheme() {
        eventHub.listen('themeChanged', (themeName) => {
            this.setPopupTheme(themeName)

            // Get styles from Hljs
            themeManager.getHljsStyles()
        })
    }

    listenToSwitchChange() {
        this.themesSwitchEl.addEventListener('change', (event) => {
            let themeName = event.target.value
            // Send msg to parse switch theme
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'switchThemeName', themeName: themeName});
            });

            // Trigger theme change event
            eventHub.trigger('themeChanged', themeName)
        })
    }

    getDefaultThemeName() {
        chrome.storage.sync.get(['themeName'], (result) => {
            let defaultThemeName = (result.themeName) ? result.themeName : 'atom-one-dark'
            this.generateOptions(defaultThemeName)

            this.setPopupTheme(defaultThemeName)
        });
    }

    // Generate theme options for <select/>
    generateOptions(defaultTheme) {
        this.themes.forEach((theme) => {
            let optionEl = document.createElement('option')
            optionEl.setAttribute('value', theme)
            optionEl.innerText = theme
            if (theme === defaultTheme) {
                optionEl.setAttribute('selected', true)
            }

            this.themesSwitchEl.appendChild(optionEl)
        })
    }
}

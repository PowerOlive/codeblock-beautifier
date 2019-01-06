class RevertButton {
    constructor(themeManager) {
        this.themeManager = themeManager
        this.revertButtonEl = document.querySelector('#revertBtn')

        this.init()
    }

    init() {
        this.initStyles()

        this.bindEvent()
    }

    initStyles() {
        this.themeManager.getStylesByClassName('hljs-meta', (computedStyles) => {
            this.revertButtonEl.style.border = `1px solid ${computedStyles.color}`
        })
    }

    bindEvent() {
        this.revertButtonEl.addEventListener('click', (event) => {
            // Send msg to parse Medium article
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {eventName: 'revert'});
            });
        });
    }
}
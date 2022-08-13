const downloadToFile = (content, filename = 'GameSave', contentType = 'text/plain') => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(a.href);
};


class SettingsPageClass extends PageClass {
    constructor(name) {
        super(name);
        this.pageButton = document.getElementById('SettingsPageButton');
        this.saveGameButton = document.getElementById('SaveGameButton');
        this.loadGameButton = document.getElementById('LoadGameButton');
        this.changeThemeButton = document.getElementById('ChangeTheme');
        this.colorThemes= {
            'Black Theme': [
                ['--default-background-color', 'rgb(14, 14, 15)'],
                ['--default-color', 'rgb(240, 248, 255)'],
                ['--default-toggle-button-border-color', 'rgb(255, 69, 0)'],
                ['--selected-toggle-button-border-color', 'rgb(64, 00, 255)'],
                ['--default-button-border-color', 'rgb(69,192,0)'],
                ['--default-tower-floor-background-color', 'rgb(255, 255, 0)'],
                ['--hover-tower-floor-background-color', 'rgb(214, 188, 40)'],
                ['--selected-tower-floor-background-color', 'rgb(194, 146, 24)'],
                ['--hover-selected-tower-floor-background-color', 'rgb(156, 116, 13)'],
                ['--default-tower-floor-color', 'rgb(0, 0, 0)'],
                ['--default-tower-floor-border-color', 'rgb(0, 0, 0)'],
                ['--default-tower-level-background-color', 'rgb(222, 184, 135)'], 
                ['--disabled-tower-level-background-color', 'rgb(70, 66, 61)'],
                ['--default-selection-list-border-color', 'rgb(128, 0, 128)'],
            ],
            'Grey Theme': [
                ['--default-background-color', 'rgb(60, 60, 67)'],
                ['--default-color', 'rgb(255, 255, 255)'],
                ['--default-toggle-button-border-color', 'rgb(255, 55, 20)'],
                ['--selected-toggle-button-border-color', 'rgb(53, 101, 202)'],
                ['--default-button-border-color', 'rgb(102, 185, 53)'],
                ['--default-tower-floor-background-color', 'rgb(218, 218, 37)'],
                ['--hover-tower-floor-background-color', 'rgb(214, 188, 40)'],
                ['--selected-tower-floor-background-color', 'rgb(194, 146, 24)'],
                ['--hover-selected-tower-floor-background-color', 'rgb(156, 116, 13)'],
                ['--default-tower-floor-color', 'rgb(0, 0, 0)'],
                ['--default-tower-floor-border-color', 'rgb(24, 23, 32)'],
                ['--default-tower-level-background-color', 'rgb(199, 156, 99)'], 
                ['--disabled-tower-level-background-color', 'rgb(54, 52, 49)'],
                ['--default-selection-list-border-color', 'rgb(112, 5, 112)'],
            ],
            'Dark Red Theme': [
                ['--default-background-color', 'rgb(35, 7, 9)'],
                ['--default-color', 'rgb(168, 127, 52)'],
                ['--default-toggle-button-border-color', 'rgb(252, 25, 25)'],
                ['--selected-toggle-button-border-color', 'rgb(145, 76, 45)'],
                ['--default-button-border-color', 'rgb(252, 25, 25)'],
                ['--default-tower-floor-background-color', 'rgb(146, 0, 0)'],
                ['--hover-tower-floor-background-color', 'rgb(110, 0, 0)'],
                ['--selected-tower-floor-background-color', 'rgb(90, 9, 9)'],
                ['--hover-selected-tower-floor-background-color', 'rgb(73, 9, 9)'],
                ['--default-tower-floor-color', 'rgb(39, 1, 1)'],
                ['--default-tower-floor-border-color', 'rgb(41, 0, 0)'],
                ['--default-tower-level-background-color', 'rgb(184, 21, 62)'], 
                ['--disabled-tower-level-background-color', 'rgb(73, 27, 27)'],
                ['--default-selection-list-border-color', 'rgb(128, 0, 128)'],
            ],
        };
        this.themeOrder= ['Black Theme', 'Dark Red Theme'];
        this.currentTheme= -1;
        this.tutorialButton= document.querySelector('#SettingsPageTutorialButton');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        let c_obj = this;
        //Theme button
        this.changeThemeButton.addEventListener('click', function() {
            c_obj.changeTheme();
        });
        
        //Save your game to file
        this.saveGameButton.addEventListener('click', () => {
            let save_text = Player.save();
            save_text += '*/*' + allThingsStatistics.save();
            save_text += '*/*' + UH.save();
            for(let page of Object.values(GM.pages)) {
                save_text += '*/*' + page.save();
            }
            save_text += '*/*' + GM.currentPage;
            save_text += '*/*' + Date.now();
            downloadToFile(save_text);
        });
        
        //Load in your game from file
        this.loadGameButton.addEventListener('input', () => {
            GM.canSave = false;
            if(c_obj.loadGameButton.files.length) {
                let file_reader = new FileReader();
                file_reader.onload = () => {
                    let save_text = file_reader.result;
                    save_text = save_text.split('*/*');
                    let i = 0;
                    Player.load(save_text[i]); i++;
                    allThingsStatistics.load(save_text[i]); i++;
                    UH.load(save_text[i]); i++;
                    for(let page of Object.values(GM.pages)) {
                        page.load(save_text[i]); i++;
                    }
                    HidePages(save_text[i]); i++;
                    GM.LoadOfflineProgress(Date.now() - Number(save_text[i])); i++;
                    
                };
                file_reader.readAsText(c_obj.loadGameButton.files[0]);
            }
            GM.canSave = true;
        });
        
        //tutorial button
        this.tutorialButton.addEventListener('click', function() {
            TutorialPage.startTutorial('None', false, 'SettingsPage');
            HidePages('TutorialPage');
        });
        
        //reset button
        document.getElementById('ResetButton').addEventListener('click', function() {
            GM.canSave = false;
        
            window.localStorage.clear();
            location.reload();
        });
    }
    changeTheme() {
        this.currentTheme++;
        if(this.currentTheme == this.themeOrder.length) {
            this.currentTheme = 0;
        }
        this.changeThemeButton.innerHTML = this.themeOrder[this.currentTheme];
        for(let j = 0; j < this.colorThemes[this.themeOrder[this.currentTheme]].length; j++) {
            document.body.style.setProperty(...this.colorThemes[this.themeOrder[this.currentTheme]][j]);
        }
    }
    displayOnLoad() {
        this.changeTheme();
    }
    display() {
        if(this.timesVisited == 0) {
            TutorialPage.startTutorial('Settings Page', true, 'SettingsPage');
        }
        else if(this.timesVisited == 1) {
            //CHANGE/SOLVE THIS
            GB.pageButtons.container.parentElement.hidden = false;
        }
        this.timesVisited++;
    }
    displayEveryTick(c_obj) {

    }
    save() {
        let save_text =  super.save() + '/*/';
        save_text += String(this.currentTheme - 1);
        return save_text;
    }
    load(save_text) {
        save_text = save_text.split('/*/');
        //load base page and start counting from there in save file
        let i = super.load(save_text);
        this.currentTheme = Number(save_text[i]) <= -1 ? -1 : Number(save_text[i]);
        this.changeTheme();
    }
};

let SettingsPage = new SettingsPageClass('SettingsPage');
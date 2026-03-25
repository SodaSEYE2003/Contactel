/**
 * AppManager.js
 * Chef d'orchestre — instancie et connecte toutes les pages
 */

class AppManager {

    constructor() {
        this.homePage   = new HomePage();
        this.profilPage = new ProfilPage();
        this.addPage    = new AddPage();
        this.editPage   = new EditPage();
    }

    onDeviceReady() {
        this.homePage.init(this.profilPage);
        this.profilPage.init(this.homePage);
        this.addPage.init(this.homePage);
        this.editPage.init(this.profilPage, this.homePage);

        // Charger les contacts dès le lancement sans attendre pageshow
        this.homePage.loadContacts();
    }

    // Affiche un toast jQuery Mobile
    static showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = isError ? 'toast toast-error' : 'toast toast-success';
        $(toast).fadeIn(300);
        setTimeout(() => {
            $(toast).fadeOut(500);
        }, 3000);
    }

}
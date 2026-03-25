/**
 * ProfilPage.js
 * Responsabilité : afficher le détail d'un contact et gérer la suppression
 */

class ProfilPage {

    constructor() {
        this.currentContact = null;
    }

    init(homePage) {
        this.homePage = homePage;

        // Bouton supprimer → ouvre le popup jQuery Mobile
        $(document).on('click', '#btnDelete', () => {
            if (!this.currentContact) return;
            $('#popupDelete').popup('open', { transition: 'pop' });
        });

        // Bouton confirmer suppression dans le popup
        $(document).on('click', '#btnConfirmDelete', () => {
            $('#popupDelete').popup('close');
            this.deleteContact();
        });

        // Bouton annuler dans le popup
        $(document).on('click', '#btnCancelDelete', () => {
            $('#popupDelete').popup('close');
        });
    }

    loadContact(contactId) {
        let options = new ContactFindOptions();
        options.filter   = contactId;
        options.multiple = false;

        let fields = ['*'];

        navigator.contacts.find(
            fields,
            (contacts) => this.render(contacts),
            (error)    => this.showError(error),
            options
        );
    }

    setCurrentContact(contact) {
        this.currentContact = contact;
    }

    getCurrentContact() {
        return this.currentContact;
    }

    render(contacts) {
        if (contacts.length === 0) return;

        this.currentContact = contacts[0];
        let contact = this.currentContact;

        let contactDetails = `
            <li>
                <img src="img/contact-1.png" />
                <h2>${contact.displayName}</h2>
                <p>${contact.phoneNumbers[0].value}</p>
            </li>
            <li>
                <h2>Téléphone</h2>
                <p>${contact.phoneNumbers[0].value}</p>
            </li>
            <li>
                <h2>Email</h2>
                <p>${contact.emails ? contact.emails[0].value : 'Non renseigné'}</p>
            </li>
            <li>
                <h2>Organisation</h2>
                <p>${contact.organizations ? contact.organizations[0].name : 'Non renseigné'}</p>
            </li>
        `;

        const profilDetail = document.getElementById('profilDetail');
        profilDetail.innerHTML = contactDetails;
        $(profilDetail).listview('refresh');
    }

    deleteContact() {
        if (!this.currentContact) return;

        this.currentContact.remove(
            () => {
                this.currentContact = null;
                AppManager.showToast("Contact supprimé avec succès !");
                $.mobile.changePage('#homePage', {
                    transition: 'slide',
                    reverse: true
                });
                this.homePage.loadContacts();
            },
            (error) => {
                AppManager.showToast("Erreur lors de la suppression : " + error.code, true);
            }
        );
    }

    showError(error) {
        AppManager.showToast("Erreur lors du chargement du profil.", true);
        console.log("Erreur ProfilPage : " + error);
    }

}

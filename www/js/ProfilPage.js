/**
 * ProfilPage.js
 * Responsabilité : afficher le détail d'un contact et gérer la suppression
 *
 * CHANGEMENT CLÉ : on ne recharge plus le contact par ID depuis l'API.
 * HomePage passe directement l'objet contact via setCurrentContact() + render(),
 * ce qui évite le bug de filtre Cordova qui retournait un mauvais contact.
 */

class ProfilPage {

    constructor() {
        this.currentContact = null;
    }

    init(homePage) {
        this.homePage = homePage;

        // Afficher le profil juste avant que la page soit visible
        // (même pattern qu'EditPage avec fillForm)
        // À ce moment le DOM de #profilPage est prêt et listview() fonctionne
        $(document).on('pagebeforeshow', '#profilPage', () => {
            if (this.currentContact) {
                this.render([this.currentContact]);
            }
        });

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

        // Réinitialiser currentContact quand on quitte la page profil
        // pour éviter qu'un ancien contact ne reste en cache
        $(document).on('pagehide', '#profilPage', () => {
            // On ne met pas à null ici car EditPage en a besoin après navigation,
            // mais on s'assure que render() ne s'exécute que si currentContact est défini.
        });
    }

    setCurrentContact(contact) {
        this.currentContact = contact;
    }

    getCurrentContact() {
        return this.currentContact;
    }

    render(contacts) {
        if (!contacts || contacts.length === 0) return;

        // Mettre à jour currentContact uniquement si on lui passe un tableau
        // (cas d'appel depuis HomePage ou EditPage)
        this.currentContact = contacts[0];
        let contact = this.currentContact;

        let phoneValue = contact.phoneNumbers && contact.phoneNumbers[0]
            ? contact.phoneNumbers[0].value
            : 'Non renseigné';

        let emailValue = contact.emails && contact.emails[0]
            ? contact.emails[0].value
            : 'Non renseigné';

        let orgValue = contact.organizations && contact.organizations[0]
            ? contact.organizations[0].name
            : 'Non renseigné';

        let contactDetails = `
            <li>
                <img src="img/contact-1.png" />
                <h2>${contact.displayName}</h2>
                <p>${phoneValue}</p>
            </li>
            <li>
                <h2>Téléphone</h2>
                <p>${phoneValue}</p>
            </li>
            <li>
                <h2>Email</h2>
                <p>${emailValue}</p>
            </li>
            <li>
                <h2>Organisation</h2>
                <p>${orgValue}</p>
            </li>
        `;

        const profilDetail = document.getElementById('profilDetail');
        profilDetail.innerHTML = contactDetails;
        $(profilDetail).listview('refresh');
    }

    deleteContact() {
        if (!this.currentContact) return;

        // Capturer la référence avant de la mettre à null
        const contactToDelete = this.currentContact;

        contactToDelete.remove(
            () => {
                // Vider le cache et le DOM immédiatement après suppression
                this.currentContact = null;
                document.getElementById('profilDetail').innerHTML = '';

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
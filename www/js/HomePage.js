/**
 * HomePage.js
 * Responsabilité : charger et afficher la liste des contacts
 */

class HomePage {

    init(profilPage) {
        // Stocker la référence à profilPage pour pouvoir lui passer le contact directement
        this.profilPage = profilPage;

        // Recharger les contacts à chaque affichage de la page
        $(document).on('pageshow', '#homePage', () => {
            this.loadContacts();
        });
    }

    loadContacts() {
        let options = new ContactFindOptions();
        options.multiple = true;
        options.hasPhoneNumber = true;

        let fields = ["*"];

        navigator.contacts.find(
            fields,
            (contacts) => this.render(contacts),
            (error)    => this.showError(error),
            options
        );
    }

    render(contacts) {
        let contactItems = "";

        for (const contact of contacts) {
            contactItems += `
                <li>
                    <a href="#profilPage"
                       data-transition="slide"
                       data-contact-id="${contact.id}">
                        <img src="img/contact-1.png" />
                        <h2>${contact.displayName}</h2>
                        <p>${contact.phoneNumbers[0].value}</p>
                    </a>
                </li>
            `;
        }

        const contactList = document.getElementById('contactList');
        contactList.innerHTML = contactItems;
        $(contactList).listview('refresh');

        // Stocker les contacts pour les retrouver par ID au clic
        this._contacts = contacts;

        // Au clic : on stocke juste le contact — render() sera appelé
        // par pagebeforeshow dans ProfilPage, quand le DOM est prêt
        $(contactList).off('click', 'a[data-contact-id]')
                      .on('click', 'a[data-contact-id]', (e) => {
            const id = $(e.currentTarget).attr('data-contact-id');
            const found = this._contacts.find(c => String(c.id) === String(id));
            if (found) {
                this.profilPage.setCurrentContact(found);
            }
        });
    }

    showError(error) {
        AppManager.showToast("Erreur lors du chargement des contacts.", true);
        console.log("Erreur HomePage : " + error);
    }

}
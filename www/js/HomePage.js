/**
 * HomePage.js
 * Responsabilité : charger et afficher la liste des contacts
 */

class HomePage {

    init() {
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
                       onclick="app.profilPage.loadContact('${contact.id}')">
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
    }

    showError(error) {
        AppManager.showToast("Erreur lors du chargement des contacts.", true);
        console.log("Erreur HomePage : " + error);
    }

}

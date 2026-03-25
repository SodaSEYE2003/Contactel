/**
 * AddPage.js
 * Responsabilité : créer un nouveau contact
 */

class AddPage {

    init(homePage) {
        this.homePage = homePage;

        $(document).on('click', '#btnAdd', () => {
            this.addContact();
        });
    }
    /**
     * Valide un numéro de téléphone.
     * Accepte uniquement les chiffres, espaces, +, - et parenthèses.
     * Doit contenir au minimum 8 chiffres.
     */
    isValidPhone(tel) {
        const sanitized = tel.replace(/[\s\-().+]/g, '');
        return /^\d{8,15}$/.test(sanitized);
    }
    addContact() {
        let nom   = document.getElementById('addNom').value.trim();
        let tel   = document.getElementById('addTel').value.trim();
        let email = document.getElementById('addEmail').value.trim();
        let org   = document.getElementById('addOrg').value.trim();

        if (!nom || !tel) {
            AppManager.showToast("Le nom et le téléphone sont obligatoires.", true);
            return;
        }

        if (!this.isValidPhone(tel)) {
            AppManager.showToast("Le numéro de téléphone est invalide. Utilisez uniquement des chiffres.", true);
            return;
        }
        let contact = navigator.contacts.create();
        contact.displayName = nom;
        contact.name = new ContactName(null, nom.split(' ')[1] || '', nom.split(' ')[0]);
        contact.phoneNumbers = [new ContactField('mobile', tel, true)];

        if (email) {
            contact.emails = [new ContactField('home', email, true)];
        }
        if (org) {
            let organization = new ContactOrganization();
            organization.name = org;
            contact.organizations = [organization];
        }

        contact.save(
            () => {
                this.clearForm();
                AppManager.showToast("Contact créé avec succès !");
                $.mobile.changePage('#homePage', {
                    transition: 'slide',
                    reverse: true
                });
                this.homePage.loadContacts();
            },
            (error) => {
                AppManager.showToast("Erreur lors de la création : " + error.code, true);
            }
        );
    }

    clearForm() {
        document.getElementById('addNom').value   = '';
        document.getElementById('addTel').value   = '';
        document.getElementById('addEmail').value = '';
        document.getElementById('addOrg').value   = '';
    }

}

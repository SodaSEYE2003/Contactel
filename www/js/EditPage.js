/**
 * EditPage.js
 * Responsabilité : pré-remplir le formulaire et sauvegarder les modifications
 */

class EditPage {

    init(profilPage, homePage) {
        this.profilPage = profilPage;
        this.homePage   = homePage;

        // Pré-remplir le formulaire avant d'afficher la page
        $(document).on('pagebeforeshow', '#editPage', () => {
            this.fillForm();
        });

        // Bouton enregistrer modifications
        $(document).on('click', '#btnUpdate', () => {
            this.updateContact();
        });
    }

    fillForm() {
        let contact = this.profilPage.getCurrentContact();
        if (!contact) return;

        document.getElementById('editNom').value   = contact.displayName || '';
        document.getElementById('editTel').value   = contact.phoneNumbers ? contact.phoneNumbers[0].value : '';
        document.getElementById('editEmail').value = contact.emails ? contact.emails[0].value : '';
        document.getElementById('editOrg').value   = contact.organizations ? contact.organizations[0].name : '';
    }

    updateContact() {
        let contact = this.profilPage.getCurrentContact();
        if (!contact) return;

        let nom   = document.getElementById('editNom').value.trim();
        let tel   = document.getElementById('editTel').value.trim();
        let email = document.getElementById('editEmail').value.trim();
        let org   = document.getElementById('editOrg').value.trim();

        if (!nom || !tel) {
            AppManager.showToast("Le nom et le téléphone sont obligatoires.", true);
            return;
        }

        contact.displayName  = nom;
        contact.name         = new ContactName(null, nom.split(' ')[1] || '', nom.split(' ')[0]);
        contact.phoneNumbers = [new ContactField('mobile', tel, true)];
        contact.emails       = email ? [new ContactField('home', email, true)] : [];

        if (org) {
            let organization = new ContactOrganization();
            organization.name = org;
            contact.organizations = [organization];
        } else {
            contact.organizations = [];
        }

        contact.save(
            () => {
                this.profilPage.setCurrentContact(contact);
                this.profilPage.render([contact]);
                AppManager.showToast("Contact modifié avec succès !");
                $.mobile.changePage('#profilPage', {
                    transition: 'slideup',
                    reverse: true
                });
                this.homePage.loadContacts();
            },
            (error) => {
                AppManager.showToast("Erreur lors de la modification : " + error.code, true);
            }
        );
    }

}

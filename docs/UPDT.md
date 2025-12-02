Refactoring of Protected View
The monolithic 

views/protected.ejs
 file has been refactored into a modular structure using EJS partials and separate page views.

Changes Made
1. Directory Structure
New directories were created to organize the views and assets:

views/partials/: Contains reusable UI components.
views/pages/: Contains specific page content.
public/css/: Expanded with new CSS files for better organization.
public/js/: Created to house extracted JavaScript logic.
2. New Files
Views
views/layout.ejs: The main layout template that includes the head, navbar, dynamic body content, modals, and scripts.
Partials:
views/partials/head.ejs: Meta tags and CSS links.
views/partials/navbar.ejs: Navigation bar.
views/partials/modals.ejs: Shared modals (Confirmation, Doctor Details).
views/partials/scripts.ejs: Script tags and libraries.
Pages:
views/pages/dashboard.ejs: Dashboard content.
views/pages/pacientes.ejs: Pacientes management view.
views/pages/medicos.ejs: Medicos management view (list and form).
views/pages/especialidades.ejs: Especialidades management view.
views/pages/consultorios.ejs: Placeholder for Consultorios.
CSS
public/css/main.css: Global styles, variables, and navbar.
public/css/components.css: Styles for modals, cards, and buttons.
public/css/dashboard.css: Specific styles for the dashboard.
public/css/medicos-list.css: Styles for the doctors list grid.
JavaScript
public/js/utils.js: Common utilities, specifically the ModalManager.
public/js/pacientes.js: Logic for managing patients.
public/js/medicos.js: Logic for managing doctors (CRUD and form).
public/js/especialidades.js: Logic for managing specialties.
3. Updates
app.js: Updated routes to render layout instead of protected.
views/protected.ejs: Renamed to views/protected.ejs.bak as a backup.
Verification Steps
Start the Server: Run npm start or node app.js.
Login: Access the application and log in.
Dashboard: Verify that the dashboard loads correctly with the welcome message and cards.
Navigation: Click on the navbar links to navigate between sections.
Pacientes:
Check if the list of patients loads.
Try adding a new patient.
Try deleting a patient.
Médicos:
Check if the list of doctors loads.
Try adding a new doctor (check form validation and interactivity).
Try viewing doctor details (modal).
Try editing a doctor.
Try deleting a doctor.
Especialidades:
Check if the list of specialties loads.
Try adding a new specialty.
Try editing a specialty.
Try deleting a specialty.
Consultorios: Verify the "En Construcción" placeholder page.
Logout: Verify the logout functionality.
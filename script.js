// Initialize data from local storage
let shop = JSON.parse(localStorage.getItem('shop')) || [];

// Cache the DOM elements to prevent repeated querying
const cartCount = document.getElementById('cartCount');

// Prevent XSS attacks by escaping HTML characters from user input
const escapeHTML = (str) => {
    // Return empty string if str is null or undefined to prevent errors when calling replace on non-string values
    if (!str) return '';
    // Replace special characters with their corresponding HTML entities to prevent them from being interpreted as HTML tags or attributes
    return str.replace(/[&<>'"]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
};

// Backward compatibility for existing data: add unique ID if missing
// carts = carts.map(c => c.id ? c : { ...c, id: Date.now().toString() + Math.random().toString(36).slice(2) });

// Save contacts to local storage
const saveCarts = () => {
    localStorage.setItem('carts', JSON.stringify(carts));
};

// Render contacts to the UI. This will be called every time the create, update, and/or delete a contact is executed
const addtocart = () => {
    // Update the contact count based on the saved pairs in local storage
    cartCount.textContent = carts.length === 0
        ? "Belum ada kontak tersimpan"
        : `Ditambahkan: ${carts.length} kali`;
}
    // Loop through the contacts and create a card for each with sanitized input
   
// Show modal for creating or editing a contact

// Hide modal

// Update contact will be called when the update button is clicked

const addToC = (id) => {
    
}

// Delete contact will be called when the delete button is clicked
const deleteContact = (id) => {
    const contact = carts.find(c => c.id === id);
    if (!contact) return;

    // Confirm before deleting the contact. If the user clicks "OK", remove the contact from the array and update local storage
    if (confirm(`Hapus kontak ${contact.name}?`)) {
        carts = carts.filter(c => c.id !== id);
        saveContacts();
        renderContacts();
    }
};

// Event delegation for dynamically created buttons inside contact list
contactList.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === 'update') updateContact(id);
    if (action === 'delete') deleteContact(id);
});

// Helper for validating input data
const validateInput = (name, phone, email) => {
    if (name.length < 3) return "Nama harus memiliki minimal 3 karakter.";
    if (/\d/.test(name)) return "Nama tidak boleh mengandung angka.";

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) return "Nomor telepon tidak valid (hanya angka, 10-15 digit).";

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Format email tidak valid.";
    }

    return null; // Return null if all valid
};

// Event listeners for form submission and button clicks. When the form is submitted, prevent the default action and save the contact
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Modern approach using FormData API
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const phone = formData.get('phone').trim();
    const email = formData.get('email').trim();

    // Validate inputs
    const errorError = validateInput(name, phone, email);
    if (errorError) {
        alert(errorError);
        return; // Stop execution if validation fails
    }

    const id = contactIdInput.value;

    // If id is not empty, it means this updating an existing contact. Otherwise, create a new contact
    if (id !== '') {
        carts = carts.map(c => c.id === id ? { ...c, name, phone, email } : c);
    } else {
        const newContact = {
            id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(),
            name,
            phone,
            email
        };
        carts.push(newContact);
    }

    saveContacts();
    renderContacts();
    hideModal();
});

// Event listeners for the create contact button and close modal button
createContactButton.addEventListener('click', () => showModal());
closeModal.addEventListener('click', hideModal);

// Close the modal when pressing the Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && !modal.classList.contains('hidden')) {
        hideModal();
    }
});

// Initial render
renderContacts();
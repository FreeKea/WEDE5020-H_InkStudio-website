
// FAQ Accordion Functionality
const accordionButtons = document.querySelectorAll(".accordion-button");

accordionButtons.forEach(button => {
    button.addEventListener("click", function () {
        const content = this.nextElementSibling;

        if (!content) return;

        const isOpen = content.style.display === "block";

        content.style.display = isOpen ? "none" : "block";

        const icon = this.querySelector("span");

        if (icon) {
            icon.textContent = isOpen ? "+" : "-";
        }
    });
});


// Services Tabs Functionality
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
    button.addEventListener("click", function () {

        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        this.classList.add("active");

        const selectedTab = document.getElementById(this.dataset.tab);

        if (selectedTab) {
            selectedTab.classList.add("active");
        }
    });
});


// Portfolio Image Modal and Load More Functionality
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalCloseButton = document.querySelector(".modal-close");

const loadMoreButton = document.getElementById("loadMoreButton");
const portfolioGallery = document.querySelector(".portfolio-gallery");


// Additional Tattoo Images
const extraTattoos = [
    {
        image: "images/Chainsaw Man x AOT.jpeg",
        title: "Chainsaw Man x AOT",
        loading: "lazy"
    },
    {
        image: "images/Spine Piece.jpeg",
        title: "Spine Piece",
        loading: "lazy"
    },
    {
        image: "images/Tribal Arm Piece.jpeg",
        title: "Tribal Arm Piece",
        loading: "lazy"
    }
];


// Load More Tattoos
if (loadMoreButton && portfolioGallery) {
    loadMoreButton.addEventListener("click", function () {

        extraTattoos.forEach(tattoo => {
            const card = document.createElement("a");
            card.classList.add("portfolio-card");
            card.href = tattoo.image;

            const image = document.createElement("img");
            image.src = tattoo.image;
            image.alt = tattoo.title;

            const title = document.createElement("span");
            title.textContent = tattoo.title;

            card.appendChild(image);
            card.appendChild(title);

            portfolioGallery.appendChild(card);
        });

        loadMoreButton.style.display = "none";
    });
}


// Portfolio Images - Open in a New Tab
if (portfolioGallery) {

    portfolioGallery.addEventListener("click", function (event) {

        const clickedImage = event.target.closest(".portfolio-card img");

        if (!clickedImage) return;

        const imageLink = clickedImage.closest("a");

        if (imageLink) {
            imageLink.target = "_blank";
            imageLink.rel = "noopener noreferrer";
        }
    });
}


// Dynamic Character Count for Description Textarea
const tattooDescription = document.getElementById("description");
const characterCount = document.getElementById("characterCount");

if (tattooDescription && characterCount) {

    characterCount.textContent = tattooDescription.value.length;

    tattooDescription.addEventListener("input", function () {
        characterCount.textContent = this.value.length;
    });
}

// Services Search and Sorting Functionality
const serviceSearch = document.getElementById("serviceSearch");
const serviceSort = document.getElementById("serviceSort");
const servicesContainer = document.querySelector(".services");
const noServicesMessage = document.getElementById("noServicesMessage");

if (serviceSearch && serviceSort && servicesContainer) {

    const serviceCards = Array.from(
        servicesContainer.querySelectorAll(".service-card")
    );

    function updateServices() {

        const searchTerm = serviceSearch.value.toLowerCase().trim();
        const sortOrder = serviceSort.value;

        // Filter services
        serviceCards.forEach(card => {
            const serviceText = card.textContent.toLowerCase();

            card.style.display = serviceText.includes(searchTerm)
                ? ""
                : "none";
        });

        // Sort services alphabetically
        const sortedCards = [...serviceCards];

        if (sortOrder === "az") {
            sortedCards.sort((a, b) =>
                a.querySelector("h3").textContent.localeCompare(
                    b.querySelector("h3").textContent
                )
            );
        } else if (sortOrder === "za") {
            sortedCards.sort((a, b) =>
                b.querySelector("h3").textContent.localeCompare(
                    a.querySelector("h3").textContent
                )
            );
        }

        // Reorganise the service cards
        sortedCards.forEach(card => {
            servicesContainer.appendChild(card);
        });

        // Display message if no services match
        const visibleServices = serviceCards.filter(
            card => card.style.display !== "none"
        );

        if (noServicesMessage) {
            noServicesMessage.style.display =
                visibleServices.length === 0 ? "block" : "none";
        }
    }

    // Search as the visitor types
    serviceSearch.addEventListener("input", updateServices);

    // Sort when the dropdown changes
    serviceSort.addEventListener("change", updateServices);
}

// Enquiry Form Validation
const enquiryForm = document.querySelector(".enquiry-form");

if (enquiryForm) {

    const requiredFields = enquiryForm.querySelectorAll("[required]");
    const formMessage = document.getElementById("formMessage");
    const submitButton = enquiryForm.querySelector(".submit-button");

    // Validate fields when the user leaves them
    requiredFields.forEach(field => {

        field.addEventListener("blur", function () {

            this.value = this.value.trim();

            if (!this.checkValidity()) {
                this.reportValidity();
            }

        });

    });

    // Submit the form using AJAX
    enquiryForm.addEventListener("submit", async function (event) {

        // Prevent normal form submission and page refresh
        event.preventDefault();

        // Check that the form is valid
        if (!enquiryForm.checkValidity()) {
            enquiryForm.reportValidity();
            return;
        }

        // Display sending message
        if (formMessage) {
            formMessage.textContent = "Sending your enquiry...";
        }

        // Disable button while submitting
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {

            // Collect all form data
            const formData = new FormData(enquiryForm);

            // Send data asynchronously to FormSubmit
            const response = await fetch(
                "https://formsubmit.co/ajax/ST10502037@rcconnect.edu.za",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(
                        Object.fromEntries(formData.entries())
                    )
                }
            );

            // Reading the server response
            const result = await response.json();

            // Checking whether submission was successful
            if (!response.ok ||
                (result.success !== true && result.success !== "true")) {
                throw new Error("Form submission failed.");
            }

            // Display success message
            if (formMessage) {
                formMessage.textContent =
                    "Thank you! Your enquiry has been submitted successfully.";
            }

            // Clear the form after successful submission
            enquiryForm.reset();

            // Reset character counter
            const characterCount = document.getElementById("characterCount");

            if (characterCount) {
                characterCount.textContent = "0";
            }

        } catch (error) {

            // Display error message
            if (formMessage) {
                formMessage.textContent =
                    "Sorry, your enquiry could not be submitted. Please try again.";
            }

            console.error("AJAX submission error:", error);

        } finally {

            // Enable the submit button again
            submitButton.disabled = false;
            submitButton.textContent = "Send Enquiry";

        }

    });

}
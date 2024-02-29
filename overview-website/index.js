document.addEventListener('DOMContentLoaded', function () {
    var mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    var mobileMenu = document.querySelector('.mobile-menu');

    // Function to toggle mobile menu visibility
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
    }

    // Toggle mobile menu when the button is clicked
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside of it or on an anchor link inside it
    document.body.addEventListener('click', function (event) {
        // Check if the clicked element is not the mobile menu button or the mobile menu itself
        if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.mobile-menu')) {
            // Close the mobile menu if it's open
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });

    // Close mobile menu when clicking on an anchor link inside it
    mobileMenu.addEventListener('click', function (event) {
        // Check if the clicked element is an anchor link
        if (event.target.tagName === 'A') {
            // Close the mobile menu
            toggleMobileMenu();
        }
    });
});

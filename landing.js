document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".slide");
    let index = 0;

    function showSlides() {
        slides.forEach((slide) => {
            slide.classList.remove("active");
        });
        slides[index].classList.add("active");
        index = (index + 1) % slides.length;
    }

    showSlides();
    setInterval(showSlides, 3000);
});

//ip address

document.addEventListener("DOMContentLoaded", function() {
    const reportForm = document.getElementById("reportForm");
    const popup = document.getElementById("popup");

    reportForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const message = document.getElementById("text").value.trim();
        if (!message) return alert("Please enter a message!");

        // 1. Get the user's public IP address
        let ip = "Unavailable";
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            ip = data.ip;
        } catch (err) {
            console.error("Failed to fetch IP address", err);
        }

        // 2. Get the current date & time
        const dateTime = new Date().toLocaleString();

        // Log for debugging
        console.log({ ip, message, dateTime });

        // Send report to server
        try {
            const response = await fetch('/submit-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, message, dateTime })
            });
            const result = await response.json();
            if (result.success) {
                // Show popup
                popup.classList.add("show");
                popup.style.display = "block";

                // Fade out after 3 seconds
                setTimeout(() => {
                    popup.classList.remove("show");
                    popup.classList.add("hide");
                    setTimeout(() => {
                        popup.style.display = "none";
                        popup.classList.remove("hide");
                        reportForm.reset(); // Clear form
                    }, 500); // Match CSS transition
                }, 3000);
            } else {
                alert("Failed to submit report");
            }
        } catch (err) {
            console.error("Error submitting report:", err);
            alert("Error submitting report");
        }
    });
});
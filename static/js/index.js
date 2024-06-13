document.addEventListener('DOMContentLoaded', function () {
    const yesRadio = document.getElementById('yes');
    const noRadio = document.getElementById('no');
    const pdfLinkInput = document.getElementById('pdf-link-input');

    yesRadio.addEventListener('change', function () {
        if (yesRadio.checked) {
            pdfLinkInput.style.display = 'block';
        }
    });

    noRadio.addEventListener('change', function () {
        if (noRadio.checked) {
            pdfLinkInput.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('upload-form');
    const uploadButton = document.getElementById('upload-btn');
    const sendEmailButton = document.getElementById('send-email-btn');

    // Initially hide the Send Emails button
    sendEmailButton.style.display = 'none';

    uploadButton.addEventListener('click', function () {
        const formData = new FormData(uploadForm);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('CSV file uploaded:', data);
            // Show the Send Emails button after file upload
            sendEmailButton.style.display = 'block';
        })
        .catch(error => console.error('Error uploading CSV:', error));
    });

    sendEmailButton.addEventListener('click', function () {
        fetch('/send_email', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => console.log('Emails sent:', data))
        .catch(error => console.error('Error sending emails:', error));
    });
});

document.getElementById("send-email-btn").addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/send_email", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Emails sent successfully!");
        }
    };
    xhr.send();
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[name="Contact-form"]');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            // If form is valid, submit it
            this.submit();
        } else {
            // If form is not valid, display error message to the user
            alert('Please fill out all required fields.');
        }
    });

    function validateForm() {
        // Example validation function to check if required fields are filled out
        const requiredInputs = form.querySelectorAll('[required]');
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        return true;
    }
});

// JavaScript code for the additional buttons

// Example function for the Cancel button
document.getElementById("cancel-btn").addEventListener("click", function() {
    // Perform cancel action here
    alert("Operation canceled!");
});

// Add this event listener to handle click event on the download button
document.getElementById("download-csv-btn").addEventListener("click", function() {
    // Send a GET request to the /download_csv route to download the updated CSV file
    fetch("/download_csv")
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error("Failed to download CSV file.");
            }
        })
        .then(blob => {
            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "updated.csv"; // Set the filename for the downloaded file
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
document.addEventListener('DOMContentLoaded', function() {
    const responseBtns = document.querySelectorAll('.response-btn');
    responseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const email = btn.dataset.email;
            const name = btn.dataset.name;
            const responseUrl = btn.dataset.responseUrl;
            const redirectUrl = `${responseUrl}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
            window.location.href = redirectUrl;
        });
    });
});

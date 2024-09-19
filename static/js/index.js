document.addEventListener('DOMContentLoaded', function() {
    const chooseFileBtn = document.getElementById('choose-file-btn');
    const fileInput = document.getElementById('csv-file');
    const uploadBtn = document.getElementById('upload-btn');
    const sendEmailBtn = document.getElementById('send-email-btn');
    const setEmailCredentialsBtn = document.getElementById('set-email-credentials-btn');
    const yesRadio = document.getElementById('yes');
    const noRadio = document.getElementById('no');
    const pdfLinkInput = document.getElementById('pdf-link-input');
    const responseBtns = document.querySelectorAll('.response-btn');
    const uploadForm = document.getElementById('upload-form');

    // Event listener for "Choose CSV File" button
    chooseFileBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // Event listener for file input change
    fileInput.addEventListener('change', function() {
        chooseFileBtn.disabled = true;
    });

    // Event listener for "Upload CSV" button
    uploadBtn.addEventListener('click', function() {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const fileName = selectedFile.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension === 'csv') {
                alert('File uploaded successfully.');
                sendEmailBtn.style.display = 'block';
            } else {
                alert('Please select a CSV file.');
            }
        } else {
            alert('Please choose a file.');
        }
    });

    // Event listener for "Send Emails" button
    sendEmailBtn.addEventListener('click', function() {
        alert('Your emails have been sent.');
    });

    // Event listener for "OK" button in email credentials form
    setEmailCredentialsBtn.addEventListener('click', function() {
        const emailId = document.getElementById('email_id').value;
        const passwordKey = document.getElementById('password_key').value;
        if (emailId && passwordKey) {
            fetch('/set_email_credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email_id=${emailId}&password_key=${passwordKey}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Email credentials saved successfully.');
                } else {
                    alert('Failed to save email credentials.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving email credentials.');
            });
        } else {
            alert('Please fill in both fields.');
        }
    });

    // Event listener for Yes/No radio buttons
    yesRadio.addEventListener('change', function() {
        if (yesRadio.checked) {
            pdfLinkInput.style.display = 'block';
        }
    });

    noRadio.addEventListener('change', function() {
        if (noRadio.checked) {
            pdfLinkInput.style.display = 'none';
        }
    });

    // Event listener for CSV upload form
    uploadButton.addEventListener('click', function() {
        const formData = new FormData(uploadForm);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('CSV file uploaded:', data);
            sendEmailButton.style.display = 'block';
        })
        .catch(error => console.error('Error uploading CSV:', error));
    });

    // Event listener for Send Emails button
    sendEmailButton.addEventListener('click', function() {
        fetch('/send_email', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => console.log('Emails sent:', data))
        .catch(error => console.error('Error sending emails:', error));
    });

    // Event listener for Cancel button
    document.getElementById("cancel-btn").addEventListener("click", function() {
        alert("Operation canceled!");
    });

    // Event listener for Download CSV button
    document.getElementById("download-csv-btn").addEventListener("click", function() {
        fetch("/download_csv")
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error("Failed to download CSV file.");
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "updated.csv";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    // Event listener for response buttons
    responseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const email = btn.dataset.email;
            const name = btn.dataset.name;
            const responseUrl = btn.dataset.responseUrl;
            const redirectUrl = `${responseUrl}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
            window.location.href = redirectUrl;
        });
    });

    // Event listener for Contact form
    const form = document.querySelector('form[name="Contact-form"]');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            this.submit();
        } else {
            alert('Please fill out all required fields.');
        }
    });

    // Form validation function
    function validateForm() {
        const requiredFields = document.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
            }
        });
        return isValid;
    }
});

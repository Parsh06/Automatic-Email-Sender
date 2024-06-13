import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from email.utils import formataddr
from dotenv import load_dotenv 
import csv
import requests

# Constants
PORT = 587  
EMAIL_SERVER = "smtp.gmail.com"  

# Load environment variables
load_dotenv()

# Read environment variables
sender_email = os.getenv("EMAIL")
password_email = os.getenv("PASSWORD")

def send_email(receiver_email, name, amount, attachment_file_path=None):
    if not receiver_email:
        print("Recipient email is empty. Skipping.")
        return

    response_url = "http://localhost:5000/dash"
    response_url_with_params = f"{response_url}?email={receiver_email}&name={name}"

    msg = MIMEMultipart()
    msg["Subject"] = "Payment Reminder"
    msg["From"] = formataddr(("FalconX", sender_email))
    msg["To"] = receiver_email 
    msg["BCC"] = sender_email

    html_body = f"""\
        <html>
            <body>
                <p>Dear Business Partner {name}</p>
                <p>The remaining Amount is {amount}</p>

                <p>It has come to our attention that you have missed to respond to the previous email.</p>
                <p><a href="{response_url_with_params}" class="response-link"><button class="response-btn" data-email="{receiver_email}">Click to Respond</button></a></p>

                <p>In case of mismatch in amount, kindly attach the Outstanding as on 31st Dec 2023 and ledger for the period 1st April 2023 to 31st Dec 2023 in excel format.</p>

                <p>For any queries, please feel free to contact the concerned purchaser in <a href="http://www.falconx.in/">FalconX</a> CO</p>

                <p><b>Note:</b></p>
                <ol>
                    <li>The above link is encrypted and secured with HTTPS. Kindly respond by clicking on the link. Do not reply to this email.</li>
                    <li>In case of mismatch in amount kindly attach the ledger / outstanding statements in excel format through the link only.</li>
                    <li>If you are not the right recipient, forward this email to the authorised person.</li>
                    <li>To know how to respond to this confirmation Watch a video Read User Guide.</li>
                </ol>

                <p>Regards,<br>
                FalconX Private limited CO.</p>
                <script src="../static/js/index.js"></script>
                <p>Attachment: {os.path.basename(attachment_file_path) if attachment_file_path else 'None'}</p>
            </body>
        </html>
    """

    # Set HTML version of the email
    msg.attach(MIMEText(html_body, "html"))

    if attachment_file_path:
        add_attachment_to_message(msg, attachment_file_path)

    # Connect to SMTP server and send email
    with smtplib.SMTP(EMAIL_SERVER, PORT) as server:
        try:
            server.starttls()
            server.login(sender_email, password_email)
            server.sendmail(sender_email, receiver_email, msg.as_string())
            print(f"Email sent to {receiver_email} successfully.")
        except Exception as e:
            print(f"Failed to send email to {receiver_email}: {e}")

def add_attachment_to_message(msg, attachment_file_path):
    try:
        with open(attachment_file_path, 'rb') as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename= {os.path.basename(attachment_file_path)}",
            )
            msg.attach(part)
    except FileNotFoundError:
        print(f"Attachment file not found: {attachment_file_path}")
    except Exception as e:
        print(f"An error occurred while attaching the file: {e}")

from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for
import csv
import os
from prac import send_email  
from dotenv import load_dotenv, set_key, dotenv_values

app = Flask(__name__)

load_dotenv()

# Ensure temp.csv exists
if not os.path.exists('temp.csv'):
    with open('temp.csv', 'w', newline='') as csvfile:
        fieldnames = ['name', 'email', 'amount', 'attachment']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    return render_template('data.html')

def get_person_details(email):
    with open('temp.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['email'] == email:
                return {
                    'person': {
                        'name': row['name'],
                        'email': row['email'],
                        'amount': row['amount'],
                    }
                }
    return None

@app.route('/response')
def response_page():
    email = request.args.get('email')
    person_details = get_person_details(email)
    return render_template('response.html', email=email)

@app.route('/dash')
def dash_page():
    email = request.args.get('email')
    person_details = get_person_details(email)
    if person_details:
        return render_template('dash.html', person=person_details['person'])
    else:
        return render_template('error.html', message="Person details not found for the provided email.")

@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'csv-file' not in request.files:
        return jsonify({'error': 'No file part'})
    csv_file = request.files['csv-file']
    if csv_file.filename == '':
        return jsonify({'error': 'No selected file'})
    if csv_file:
        try:
            # Save the uploaded file
            csv_file.save('uploaded.csv')
            # Append the contents of the uploaded file to uploaded.csv
            with open('uploaded.csv', 'r') as infile, open('temp.csv', 'a') as outfile:
                outfile.write(infile.read())
            return jsonify({'success': True})
        except Exception as e:
            return jsonify({'error': f'An error occurred: {e}'}), 500

@app.route('/send_email', methods=['POST'])
def trigger_send_email():
    try:
        with open('uploaded.csv', 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                receiver_email = row.get('email')
                name = row.get('name')
                amount = row.get('amount')
                attachment_file_path = row.get('attachment')
                send_email(receiver_email, name, amount, attachment_file_path)
    except FileNotFoundError:
        return jsonify({'error': 'File not found.'}), 404
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500
    return jsonify({'success': True})

@app.route('/get_csv_data')
def get_csv_data():
    """
    Get CSV data and serve it as JSON.
    """
    csv_data = []
    with open('uploaded.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            person = {
                'id': row['id'],  # Assuming 'id' is a unique identifier in your CSV
                'name': row['name'],
                'email': row['email'],
                'amount': row['amount'],
                'attachment': row['attachment']
            }
            csv_data.append(person)
    return jsonify(csv_data)

@app.route('/download_csv', methods=['GET'])
def download_csv():
    try:
        return send_file('temp.csv', as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found.'}), 404

@app.route('/set_email_credentials', methods=['POST'])
def set_email_credentials():
    data = request.json
    email_id = data.get('email_id')
    password_key = data.get('password_key')
    if not email_id or not password_key:
        return jsonify({'error': 'Email ID and Password Key are required.'}), 400
    set_key('.env', 'email', email_id)
    set_key('.env', 'password', password_key)
    return jsonify({'success': True})

@app.route('/check_email_credentials', methods=['GET'])
def check_email_credentials():
    env_vars = dotenv_values(".env")
    email_id = env_vars.get('email')
    password_key = env_vars.get('password')
    if email_id and password_key:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

if __name__ == '__main__':
    app.run(debug=True)

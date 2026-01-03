from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# Initial data
employees = [
    {"id": "1", "name": "Admin User", "email": "admin@nexus.com", "role": "Admin", "department": "Management", "status": "Active", "joinDate": "2023-01-01"},
    {"id": "2", "name": "John Doe", "email": "john@nexus.com", "role": "Employee", "department": "Engineering", "status": "Active", "joinDate": "2023-05-15"}
]

attendance = [
    {"id": "1", "employeeId": "2", "date": datetime.date.today().isoformat(), "checkIn": "09:00", "checkOut": "17:00", "status": "Present"}
]

leaves = [
    {"id": "1", "employeeId": "2", "type": "Annual", "startDate": "2024-01-10", "endDate": "2024-01-15", "status": "Approved", "reason": "Family vacation"}
]

payroll = [
    {"id": "1", "employeeId": "2", "month": "December", "year": "2025", "baseSalary": 5000, "bonuses": 500, "deductions": 200, "netPay": 5300, "status": "Paid"}
]

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    user = next((u for u in employees if u['email'] == email), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(employees)

@app.route('/api/employees', methods=['GET'])
def get_employees():
    return jsonify(employees)

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    return jsonify(attendance)

@app.route('/api/leaves', methods=['GET', 'POST'])
def handle_leaves():
    if request.method == 'POST':
        data = request.json
        new_leave = {
            "id": str(len(leaves) + 1),
            "employeeId": data.get('userId'),
            "type": data.get('type'),
            "startDate": data.get('startDate'),
            "endDate": data.get('endDate'),
            "status": "Pending",
            "reason": data.get('reason')
        }
        leaves.append(new_leave)
        return jsonify(new_leave), 201
    
    user_id = request.args.get('userId')
    if user_id:
        user_leaves = [l for l in leaves if l['employeeId'] == user_id]
        return jsonify(user_leaves)
    return jsonify(leaves)

@app.route('/api/payroll', methods=['GET'])
def get_payroll():
    return jsonify(payroll)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        "totalEmployees": len(employees),
        "presentToday": 15,
        "onLeave": 3,
        "pendingLeaves": 5
    })

@app.route('/api/analytics/happiness', methods=['GET'])
def get_happiness():
    return jsonify([
        {"name": "Happy", "value": 70, "color": "#10B981"},
        {"name": "Neutral", "value": 20, "color": "#F59E0B"},
        {"name": "Stressed", "value": 10, "color": "#EF4444"}
    ])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)

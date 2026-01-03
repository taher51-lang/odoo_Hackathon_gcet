import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(20), default='EMPLOYEE')
    position = db.Column(db.String(100), default='')
    department = db.Column(db.String(100), default='')
    join_date = db.Column(db.String(20), default='')
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    salary = db.Column(db.Float, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'position': self.position,
            'department': self.department,
            'joinDate': self.join_date,
            'phone': self.phone,
            'address': self.address,
            'salary': self.salary,
            'avatarUrl': self.avatar_url
        }


class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    check_in = db.Column(db.String(50), nullable=True)
    check_out = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='PRESENT')
    total_hours = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'date': self.date,
            'checkIn': self.check_in,
            'checkOut': self.check_out,
            'status': self.status,
            'totalHours': self.total_hours
        }


class Leave(db.Model):
    __tablename__ = 'leaves'
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)
    reason = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='PENDING')
    admin_comment = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'type': self.type,
            'startDate': self.start_date,
            'endDate': self.end_date,
            'reason': self.reason,
            'status': self.status,
            'adminComment': self.admin_comment
        }


# Routes

@app.route('/api/init', methods=['GET'])
def init_db():
    db.create_all()
    # Create default admin if not exists
    admin = User.query.filter_by(email='admin@hrms.com').first()
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            name='Admin User',
            email='admin@hrms.com',
            password=generate_password_hash('admin123'),
            role='ADMIN',
            position='System Administrator',
            department='IT',
            join_date='2024-01-01',
            salary=100000
        )
        db.session.add(admin)
        db.session.commit()
    return jsonify({'message': 'Database initialized'})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    existing = User.query.filter_by(email=data.get('email')).first()
    if existing:
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        id=data.get('id', str(uuid.uuid4())),
        name=data.get('name', ''),
        email=data.get('email', ''),
        password=generate_password_hash(data.get('password', '')),
        role=data.get('role', 'EMPLOYEE'),
        position=data.get('position', ''),
        department=data.get('department', ''),
        join_date=data.get('joinDate', ''),
        phone=data.get('phone'),
        address=data.get('address'),
        salary=data.get('salary'),
        avatar_url=data.get('avatarUrl')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password', '')
    
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        return jsonify(user.to_dict())
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)
    user.position = data.get('position', user.position)
    user.department = data.get('department', user.department)
    user.join_date = data.get('joinDate', user.join_date)
    user.phone = data.get('phone', user.phone)
    user.address = data.get('address', user.address)
    user.salary = data.get('salary', user.salary)
    user.avatar_url = data.get('avatarUrl', user.avatar_url)
    
    if data.get('password'):
        user.password = generate_password_hash(data.get('password'))
    
    db.session.commit()
    return jsonify(user.to_dict())


@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    records = Attendance.query.all()
    return jsonify([r.to_dict() for r in records])


@app.route('/api/attendance', methods=['POST'])
def save_attendance():
    data = request.json
    user_id = data.get('userId')
    date = data.get('date')
    
    # Check if record exists for this user and date
    existing = Attendance.query.filter_by(user_id=user_id, date=date).first()
    
    if existing:
        # Update existing record (checkout)
        if data.get('checkOut'):
            existing.check_out = data.get('checkOut')
        if data.get('totalHours'):
            existing.total_hours = data.get('totalHours')
        if data.get('status'):
            existing.status = data.get('status')
        db.session.commit()
        return jsonify(existing.to_dict())
    else:
        # Create new record (checkin)
        record = Attendance(
            id=str(uuid.uuid4()),
            user_id=user_id,
            date=date,
            check_in=data.get('checkIn'),
            check_out=data.get('checkOut'),
            status=data.get('status', 'PRESENT'),
            total_hours=data.get('totalHours')
        )
        db.session.add(record)
        db.session.commit()
        return jsonify(record.to_dict()), 201


@app.route('/api/leaves', methods=['GET'])
def get_leaves():
    leaves = Leave.query.all()
    return jsonify([l.to_dict() for l in leaves])


@app.route('/api/leaves', methods=['POST'])
def create_leave():
    data = request.json
    leave = Leave(
        id=data.get('id', str(uuid.uuid4())),
        user_id=data.get('userId'),
        type=data.get('type'),
        start_date=data.get('startDate'),
        end_date=data.get('endDate'),
        reason=data.get('reason'),
        status=data.get('status', 'PENDING'),
        admin_comment=data.get('adminComment')
    )
    db.session.add(leave)
    db.session.commit()
    return jsonify(leave.to_dict()), 201


@app.route('/api/leaves/<leave_id>', methods=['PUT'])
def update_leave(leave_id):
    leave = Leave.query.get(leave_id)
    if not leave:
        return jsonify({'error': 'Leave not found'}), 404
    
    data = request.json
    if data.get('status'):
        leave.status = data.get('status')
    if data.get('adminComment'):
        leave.admin_comment = data.get('adminComment')
    
    db.session.commit()
    return jsonify(leave.to_dict())


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='localhost', port=8000, debug=True)

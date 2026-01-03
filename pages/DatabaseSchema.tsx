import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Check, Database, Download } from 'lucide-react';

const SCHEMA_SQL = `-- HRMS Database Schema for PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE');
CREATE TYPE leave_type AS ENUM ('PAID', 'SICK', 'UNPAID');
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE payroll_status AS ENUM ('PAID', 'PENDING');

-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255), -- Added password column
    role user_role NOT NULL DEFAULT 'EMPLOYEE',
    position VARCHAR(100),
    department VARCHAR(100),
    join_date DATE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    salary NUMERIC(10, 2),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status attendance_status NOT NULL DEFAULT 'ABSENT',
    total_hours NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Leaves Table
CREATE TABLE leaves (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status leave_status NOT NULL DEFAULT 'PENDING',
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Table
CREATE TABLE payroll (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    basic_salary NUMERIC(10, 2) NOT NULL,
    allowances NUMERIC(10, 2) DEFAULT 0,
    deductions NUMERIC(10, 2) DEFAULT 0,
    net_salary NUMERIC(10, 2) NOT NULL,
    status payroll_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const DatabaseSchema = () => {
    const { users, attendance, leaves } = useApp();
    const [activeTab, setActiveTab] = useState<'schema' | 'data'>('schema');
    const [copied, setCopied] = useState(false);

    const generateDataSQL = () => {
        let sql = '-- Exported Data from HRMS Pro\n\n';
        
        sql += '-- Users\n';
        users.forEach(u => {
            sql += `INSERT INTO users (id, name, email, password, role, position, department, join_date, salary, phone, address, avatar_url) VALUES ('${u.id}', '${u.name.replace(/'/g, "''")}', '${u.email}', '${u.password || 'password'}', '${u.role}', '${u.position}', '${u.department}', '${u.joinDate}', ${u.salary || 'NULL'}, ${u.phone ? `'${u.phone}'` : 'NULL'}, ${u.address ? `'${u.address.replace(/'/g, "''")}'` : 'NULL'}, ${u.avatarUrl ? `'${u.avatarUrl}'` : 'NULL'});\n`;
        });

        sql += '\n-- Attendance\n';
        attendance.forEach(a => {
             sql += `INSERT INTO attendance (id, user_id, date, check_in, check_out, status, total_hours) VALUES ('${a.id}', '${a.userId}', '${a.date}', ${a.checkIn ? `'${a.checkIn}'` : 'NULL'}, ${a.checkOut ? `'${a.checkOut}'` : 'NULL'}, '${a.status}', ${a.totalHours || 'NULL'});\n`;
        });

        sql += '\n-- Leaves\n';
        leaves.forEach(l => {
             sql += `INSERT INTO leaves (id, user_id, type, start_date, end_date, reason, status, admin_comment) VALUES ('${l.id}', '${l.userId}', '${l.type}', '${l.startDate}', '${l.endDate}', '${l.reason.replace(/'/g, "''")}', '${l.status}', ${l.adminComment ? `'${l.adminComment.replace(/'/g, "''")}'` : 'NULL'});\n`;
        });

        return sql;
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Database</h2>
                    <p className="text-slate-500">PostgreSQL Schema & Data Export</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                    <Database size={18} />
                    <span>PostgreSQL Ready</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                <div className="border-b border-slate-200 flex">
                    <button 
                        onClick={() => setActiveTab('schema')}
                        className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'schema' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
                    >
                        Schema Definition
                    </button>
                    <button 
                         onClick={() => setActiveTab('data')}
                        className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'data' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
                    >
                        Export Data SQL
                    </button>
                </div>
                
                <div className="p-0 bg-slate-900 flex-1 relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                             <button 
                                onClick={() => handleCopy(activeTab === 'schema' ? SCHEMA_SQL : generateDataSQL())}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:bg-slate-700 hover:text-white transition-colors text-sm"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                            </button>
                    </div>
                    <pre className="text-slate-300 p-6 overflow-auto font-mono text-sm leading-relaxed h-full">
                        {activeTab === 'schema' ? SCHEMA_SQL : generateDataSQL()}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default DatabaseSchema;
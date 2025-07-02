from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "student" or "tutor"
    cohort = db.Column(db.String(50), nullable=True)  # e.g., "CSE 2024"

    faqs = db.relationship("FAQ", backref="uploader", lazy=True)
    questions = db.relationship("Question", backref="author", lazy=True)

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=True)  # e.g., 2025
    description = db.Column(db.Text, nullable=True)
    semester = db.Column(db.String(10), nullable=True)  # e.g., "T2"

    assignments = db.relationship("Assignment", backref="course", lazy=True)
    faqs = db.relationship("FAQ", backref="course", lazy=True)

class Assignment(db.Model):  # ✅ 修改类名
    __tablename__ = "assignments"  # ✅ 修改表名

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)

class FAQ(db.Model):
    __tablename__ = "faqs"

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)

    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=True)

    assignment = db.relationship("Assignment", backref="questions")  # ✅ 引用也改成 Assignment

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
    questions = db.relationship("Question", back_populates="author", lazy=True)

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=True)  # e.g., 2025
    description = db.Column(db.Text, nullable=True)
    semester = db.Column(db.String(10), nullable=True)  # e.g., "T2"

    assignments = db.relationship("Assignment", backref="course", lazy=True)
    faqs = db.relationship("FAQ", backref="course", lazy=True)

class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)

    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    questions = db.relationship("Question", back_populates="assignment", lazy=True)

    forum = db.relationship("Forum", back_populates="assignment", uselist=False)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "due_date": self.due_date.isoformat() if self.due_date else None, # 将 datetime 对象转换为 ISO 格式字符串
            "course_id": self.course_id,
            "user_id": self.user_id
        }

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
    # answer = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    forum_id = db.Column(db.Integer, db.ForeignKey("forums.id"), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=False)

    author = db.relationship("User", back_populates="questions")    
    forum = db.relationship("Forum", back_populates="questions")
    assignment = db.relationship("Assignment", back_populates="questions")

class Forum(db.Model):
    __tablename__ = "forums"

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), unique=True, nullable=False)

    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # ✅ 一对一反向 assignment
    assignment = db.relationship("Assignment", back_populates="forum")

    # ✅ 一对多问题列表
    questions = db.relationship("Question", back_populates="forum", lazy=True)
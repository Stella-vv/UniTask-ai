from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os 
from sqlalchemy.sql import func
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "student" or "tutor"
    school = db.Column(db.String(100), nullable=True)
    year = db.Column(db.Integer, nullable=True)
    

    faqs = db.relationship("FAQ", backref="uploader", lazy=True)
    questions = db.relationship("Question", back_populates="author", lazy=True)
    replies = db.relationship("Reply", backref="author", lazy=True)

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=True)
    semester = db.Column(db.String(10), nullable=True)

    assignments = db.relationship("Assignment", backref="course", lazy=True)
    #faqs = db.relationship("FAQ", backref="course", lazy=True)

class QAUpload(db.Model):
    __tablename__ = "qa_uploads"

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    filename = db.Column(db.String(255), nullable=False)       # 原始文件名
    filepath = db.Column(db.String(255), nullable=False)       # 实际保存路径
    filetype = db.Column(db.String(10), nullable=False)        # csv / pdf / xml
    description = db.Column(db.Text, nullable=True)            # 备注（可选）

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    uploader = db.relationship("User", backref="qa_uploads")
    assignment = db.relationship("Assignment", backref="qa_uploads")
    #course = db.relationship("Course", backref="qa_uploads")


class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    rubric = db.Column(db.String(255), nullable=True)
    attachment = db.Column(db.String(255), nullable=True)

    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationships
    questions = db.relationship("Question", back_populates="assignment", lazy=True)
    forum = db.relationship("Forum", back_populates="assignment", uselist=False)

    # --- A robust and safe to_dict() method ---
    def to_dict(self):
        # Safely create the attachments list
        attachments_list = []
        if self.attachment and isinstance(self.attachment, str):
            attachments_list.append({
                "id": self.id,
                "path": self.attachment,
                "filename": os.path.basename(self.attachment)
            })

        # Safely create the rubric object
        rubric_object = None
        if self.rubric and isinstance(self.rubric, str):
            rubric_object = {
                "id": self.id,
                "path": self.rubric,
                "filename": os.path.basename(self.rubric)
            }

        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "dueDate": self.due_date.strftime("%Y-%m-%d %H:%M:%S") if self.due_date else None,
            "rubric": rubric_object,
            "attachments": attachments_list,
            
            # --- Key Fix: This check prevents a crash if the course is missing ---
            "courseName": self.course.name if self.course else "Unknown Course",
        }


class FAQ(db.Model):
    __tablename__ = "faqs"

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)

    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    forum_id = db.Column(db.Integer, db.ForeignKey("forums.id"), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=False)

    author = db.relationship("User", back_populates="questions")
    forum = db.relationship("Forum", back_populates="questions")
    assignment = db.relationship("Assignment", back_populates="questions")
    replies = db.relationship("Reply", back_populates="question", lazy=True)

class Forum(db.Model):
    __tablename__ = "forums"

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), unique=True, nullable=False)

    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    assignment = db.relationship("Assignment", back_populates="forum")
    questions = db.relationship("Question", back_populates="forum", lazy=True)

class Reply(db.Model):
    __tablename__ = "replies"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    question = db.relationship("Question", back_populates="replies")

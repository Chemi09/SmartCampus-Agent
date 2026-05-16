"""
Données de démonstration SmartCampus (phase 8).
Usage : cd backend && python -m seeds.demo_data
Option : python -m seeds.demo_data --reset  (efface les données démo puis recrée)
"""

from __future__ import annotations

import argparse
from datetime import date
from decimal import Decimal

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.faculty import Faculty
from app.models.fee_type import FeeType
from app.models.grade import Grade
from app.models.payment import Payment
from app.models.program import Program
from app.models.semester import Semester
from app.models.student import Student

DEMO_MATRICULE = "ETU-2026-001"
DEMO_PHONE = "+243810000001"

STUDENTS_DATA = [
    ("ETU-2026-001", "Jean", "Mukendi", DEMO_PHONE, "jean.mukendi@demo.local"),
    ("ETU-2026-002", "Marie", "Kabila", "+243810000002", "marie.kabila@demo.local"),
    ("ETU-2026-003", "Paul", "Ilunga", "+243810000003", "paul.ilunga@demo.local"),
    ("ETU-2026-004", "Grace", "Mwamba", "+243810000004", "grace.mwamba@demo.local"),
    ("ETU-2026-005", "David", "Tshisekedi", "+243810000005", "david.tshisekedi@demo.local"),
    ("ETU-2026-006", "Sarah", "Mutombo", "+243810000006", "sarah.mutombo@demo.local"),
    ("ETU-2026-007", "Eric", "Kalala", "+243810000007", "eric.kalala@demo.local"),
    ("ETU-2026-008", "Amina", "Nzuzi", "+243810000008", "amina.nzuzi@demo.local"),
    ("ETU-2026-009", "Patrick", "Luboya", "+243810000009", "patrick.luboya@demo.local"),
]

COURSES_DATA = [
    ("INF201", "Algorithmique", 4),
    ("INF202", "Bases de données", 4),
    ("INF203", "Réseaux informatiques", 3),
]

GRADES_DEMO = [
    ("INF201", 75.0),
    ("INF202", 70.0),
    ("INF203", 72.5),
]


def _clear_demo_data(db: Session) -> None:
    demo_ids = list(
        db.scalars(
            select(Student.id).where(Student.matricule.like("ETU-2026-%"))
        ).all()
    )
    if not demo_ids:
        return

    enrollment_ids = list(
        db.scalars(select(Enrollment.id).where(Enrollment.student_id.in_(demo_ids))).all()
    )
    if enrollment_ids:
        db.execute(delete(Grade).where(Grade.enrollment_id.in_(enrollment_ids)))
        db.execute(delete(Enrollment).where(Enrollment.id.in_(enrollment_ids)))

    db.execute(delete(Payment).where(Payment.student_id.in_(demo_ids)))
    db.execute(delete(Student).where(Student.id.in_(demo_ids)))
    db.commit()


def seed_demo_data(db: Session, *, reset: bool = False) -> None:
    if reset:
        _clear_demo_data(db)

    existing = db.scalar(select(Student).where(Student.matricule == DEMO_MATRICULE))
    if existing:
        print(f"Données démo déjà présentes ({DEMO_MATRICULE}). Utilisez --reset pour recréer.")
        return

    faculty = db.scalar(
        select(Faculty).where(Faculty.name == "Faculté des Sciences et Technologies")
    )
    if faculty is None:
        faculty = Faculty(name="Faculté des Sciences et Technologies")
        db.add(faculty)
        db.flush()

    program = db.scalar(
        select(Program).where(Program.name == "L2 Informatique", Program.faculty_id == faculty.id)
    )
    if program is None:
        program = Program(
            faculty_id=faculty.id,
            name="L2 Informatique",
            level="L2",
        )
        db.add(program)
        db.flush()

    semester = db.scalar(select(Semester).where(Semester.is_active.is_(True)))
    if semester is None:
        semester = Semester(
            label="S2 2025-2026",
            start_date=date(2026, 1, 15),
            end_date=date(2026, 6, 30),
            is_active=True,
        )
        db.add(semester)
        db.flush()
    else:
        semester.is_active = True
        semester.label = "S2 2025-2026"

    courses: dict[str, Course] = {}
    for code, name, credits in COURSES_DATA:
        course = Course(
            program_id=program.id,
            code=code,
            name=name,
            credits=credits,
        )
        db.add(course)
        db.flush()
        courses[code] = course

    fee_type = FeeType(label="Frais de scolarité S2", amount=Decimal("500000"))
    db.add(fee_type)
    db.flush()

    students: list[Student] = []
    for matricule, first_name, last_name, phone, email in STUDENTS_DATA:
        student = Student(
            matricule=matricule,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            email=email,
            program_id=program.id,
            status="active",
        )
        db.add(student)
        db.flush()
        students.append(student)

    demo_student = students[0]
    enrollments: dict[int, Enrollment] = {}
    for student in students:
        enrollment = Enrollment(
            student_id=student.id,
            semester_id=semester.id,
            program_id=program.id,
        )
        db.add(enrollment)
        db.flush()
        enrollments[student.id] = enrollment

    demo_enrollment = enrollments[demo_student.id]
    for code, score in GRADES_DEMO:
        db.add(
            Grade(
                enrollment_id=demo_enrollment.id,
                course_id=courses[code].id,
                score=score,
                session="normal",
            )
        )

    due = date(2026, 12, 31)
    fee_amount = Decimal("500000")

    for index, student in enumerate(students):
        if student.matricule == DEMO_MATRICULE:
            paid_amount = Decimal("200000")
            status = "partial"
        elif index in (1, 2):
            paid_amount = Decimal("0")
            status = "unpaid"
        else:
            paid_amount = fee_amount
            status = "paid"

        db.add(
            Payment(
                student_id=student.id,
                semester_id=semester.id,
                fee_type_id=fee_type.id,
                amount=fee_amount,
                paid_amount=paid_amount,
                status=status,
                due_date=due,
            )
        )

    db.commit()
    print("Seed démo terminé.")
    print(f"  Faculté : {faculty.name}")
    print(f"  Programme : {program.name}")
    print(f"  Semestre actif : {semester.label}")
    print(f"  Étudiants : {len(students)}")
    print(f"  Démo : {DEMO_MATRICULE} — Jean Mukendi — {DEMO_PHONE}")
    print("  Paiements : 2 impayés, 1 partiel (Jean), reste payé")
    print("  Moyenne Jean (pondérée) : ~72,5 %")


def main() -> None:
    parser = argparse.ArgumentParser(description="Charger les données de démo SmartCampus")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Supprime les étudiants ETU-2026-* puis recrée les données",
    )
    args = parser.parse_args()

    db = SessionLocal()
    try:
        seed_demo_data(db, reset=args.reset)
    finally:
        db.close()

    from scripts.seed_admin import main as seed_admin_main

    seed_admin_main()


if __name__ == "__main__":
    main()

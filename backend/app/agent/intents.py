from enum import StrEnum
import re
import unicodedata


class Intent(StrEnum):
    GRADES_AVERAGE = "grades.average"
    PAYMENT_STATUS = "payment.status"
    ENROLLMENT_DATES = "enrollment.dates"
    STUDENT_STATUS = "student.status"
    UNKNOWN = "unknown"


_GRADES = (
    "moyenne",
    "note",
    "notes",
    "semestre",
    "bulletin",
    "resultat",
    "moyenne na",
    "note na",
    "ba notes",
)
_PAYMENT = (
    "paye",
    "payé",
    "paiement",
    "frais",
    "solde",
    "reste",
    "impaye",
    "impayé",
    "scolarite",
    "scolarité",
    "kobonga",
    "mbongo",
    "kofuta",
)
_ENROLLMENT = (
    "inscription",
    "inscrire",
    "master",
    "licence",
    "date limite",
    "fermeture",
    "deadline",
    "kofungola",
)
_STATUS = (
    "dossier",
    "actif",
    "statut",
    "status",
    "inscrit",
    "compte",
    "etudiant",
    "étudiant",
)


def _normalize(text: str) -> str:
    lowered = text.lower().strip()
    normalized = unicodedata.normalize("NFD", lowered)
    return "".join(c for c in normalized if unicodedata.category(c) != "Mn")


def detect_language(message: str) -> str:
    lingala_markers = (
        "mbote",
        "ndeko",
        "oyo",
        "nini",
        "soki",
        "kobonga",
        "kofuta",
        "moyenne na",
        "ba ",
        "na ngai",
    )
    norm = _normalize(message)
    if any(marker in norm for marker in lingala_markers):
        return "ln"
    return "fr"


def classify_intent(message: str) -> Intent:
    text = _normalize(message)
    if not text or re.fullmatch(r"[\W\d\s]+", text):
        return Intent.UNKNOWN

    # Salutations seules → fallback
    greetings = ("bonjour", "bonsoir", "salut", "hello", "hi", "mbote", "coucou")
    if text in greetings or (len(text.split()) <= 2 and any(g in text for g in greetings)):
        return Intent.UNKNOWN

    scores: dict[Intent, int] = {intent: 0 for intent in Intent}

    for kw in _GRADES:
        if kw in text:
            scores[Intent.GRADES_AVERAGE] += 1
    for kw in _PAYMENT:
        if kw in text:
            scores[Intent.PAYMENT_STATUS] += 1
    for kw in _ENROLLMENT:
        if kw in text:
            scores[Intent.ENROLLMENT_DATES] += 1
    for kw in _STATUS:
        if kw in text:
            scores[Intent.STUDENT_STATUS] += 1

    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return Intent.UNKNOWN
    return best

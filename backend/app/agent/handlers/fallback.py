def handle_fallback(*, language: str) -> str:
    if language == "ln":
        return (
            "Mbote ! Nakoki kosalisa na : moyenne na semestre, frais ya scolarité, "
            "mikolo ya inscription Master, to statut ya dossier na yo. "
            "Lobela ndakisa : « Moyenne na ngai ? » to « Nafuti frais S2 ? »"
        )
    return (
        "Bonjour ! Je peux vous aider sur : votre moyenne du semestre, vos frais de "
        "scolarité, les dates d'inscription en Master, ou le statut de votre dossier. "
        "Exemples : « Quelle est ma moyenne ? » ou « Ai-je payé mes frais S2 ? »"
    )

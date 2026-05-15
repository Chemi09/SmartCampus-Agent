from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, status_code: int, error: str, message: str) -> None:
        self.status_code = status_code
        self.error = error
        self.message = message


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentification requise") -> None:
        super().__init__(401, "unauthorized", message)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Accès refusé") -> None:
        super().__init__(403, "forbidden", message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Ressource introuvable") -> None:
        super().__init__(404, "not_found", message)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.error, "message": exc.message},
        )

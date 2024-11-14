"""
Provides a centralized error handler for returning consistent JSON error
responses across the Flask application.

"""

from flask import jsonify


def register_error_handlers(app):
    """
    Registers a generic error handler for all exceptions.

    Returns a JSON response with a status code and message based on error type.
    Includes additional error details for internal server errors (500).
    """
    @app.errorhandler(Exception)
    def handle_error(e):
        # default status code is 500 if not set
        code = getattr(e, 'code', 500)

        # default message based on the status code
        message = {
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            409: "Conflict",
            500: "Internal Server Error"
        }.get(code, "Unknown Error")

        error_response = {
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }

        if code == 500:
            error_response["error"]["details"] = str(e)

        return jsonify(error_response), code

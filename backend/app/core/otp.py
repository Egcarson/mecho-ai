import hashlib
import hmac
import secrets

from app.core.config import settings


def generate_otp() -> str:
    """
    Generate a cryptographically secure
    6-digit OTP.
    """
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(
    otp: str,
) -> str:
    """
    Hash OTP using HMAC-SHA256.
    """

    return hmac.new(
        settings.SECRET_KEY.encode(),
        otp.encode(),
        hashlib.sha256,
    ).hexdigest()


def verify_otp_hash(
    otp: str,
    otp_hash: str,
) -> bool:
    """
    Securely compare an OTP against
    its stored hash.
    """

    candidate_hash = hash_otp(
        otp,
    )

    return hmac.compare_digest(
        candidate_hash,
        otp_hash,
    )
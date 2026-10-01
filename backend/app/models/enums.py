from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    COMPLETED = "completed"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ProjectWorkflow(str, Enum):
    SOCIAL = "social"
    CAMPAIGN = "campaign"
    SPEECH = "speech"


class AssetType(str, Enum):
    AUDIO = "audio"
    IMAGE = "image"
    VIDEO = "video"
    PDF = "pdf"
    DOCUMENT = "document"
    THUMBNAIL = "thumbnail"
    COVER = "cover"


class AssetProvider(str, Enum):
    CLOUDINARY = "cloudinary"
    YARNGPT = "yarngpt"
    OPENAI = "openai"
    RUNWAY = "runway"
    LOCAL = "local"
    USER_UPLOAD = "user_upload"


class GenerationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ContentObjective(str, Enum):
    AWARENESS = "awareness"

    ENGAGEMENT = "engagement"

    EDUCATION = "education"

    CONVERSION = "conversion"

    LEAD_GENERATION = "lead_generation"

    PROMOTION = "promotion"

    SALES_CONVERSION = "sales_conversion"

    RETENTION = "retention"

    COMMUNITY_BUILDING = "community_building"

    STORYTELLING = "storytelling"

    INSPIRATION = "inspiration"

    EVENT_PROMOTION = "event_promotion"

    FUNDRAISING = "fundraising"

    PRODUCT_LAUNCH = "product_launch"

    SPEECH = "speech"


class ContentTone(str, Enum):
    PROFESSIONAL = "professional"
    FRIENDLY = "friendly"
    FORMAL = "formal"
    CONVERSATIONAL = "conversational"
    PERSUASIVE = "persuasive"
    HUMOROUS = "humorous"
    INSPIRATIONAL = "inspirational"
    EDUCATIONAL = "educational"


class ContentLength(str, Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"
    EXTENDED = "extended"

class OTPPurpose(str, Enum):
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"


class VoiceGenerationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class VoiceProviderJobStatus(str, Enum):
    PENDING = "pending"
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class LibraryMediaType(str, Enum):
    VOICE = "voice"
    IMAGE = "image"
    VIDEO = "video"


class ImageGenerationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ImageDesignStyle(str, Enum):
    AUTO = "auto"
    MINIMAL = "minimal"
    PREMIUM = "premium"
    LUXURY = "luxury"
    BOLD = "bold"
    CORPORATE = "corporate"
    PLAYFUL = "playful"
    MODERN = "modern"


class ImageFormat(str, Enum):
    AUTO = "auto"
    SQUARE = "square"
    PORTRAIT = "portrait"
    STORY = "story"
    LANDSCAPE = "landscape"
PART_P1 = "P1"
PART_P2 = "P2"
PART_P3 = "P3"
PART_P4 = "P4"
PART_P5 = "P5"
PART_P6 = "P6"
PART_P7 = "P7"
PART_P8 = "P8"
PART_W1 = "W1"
PART_W2 = "W2"

CANONICAL_PART_ORDER = [
    PART_P1,
    PART_P2,
    PART_P3,
    PART_P4,
    PART_P5,
    PART_P6,
    PART_P7,
    PART_P8,
    PART_W1,
    PART_W2,
]

PART_CHOICES = [(part, part) for part in CANONICAL_PART_ORDER]

SECTION_TYPE_RUOE = "ruoe"
SECTION_TYPE_WRITING = "writing"

SECTION_TYPE_CHOICES = [
    (SECTION_TYPE_RUOE, "Reading and Use of English"),
    (SECTION_TYPE_WRITING, "Writing"),
]

EXAM_STATUS_DRAFT = "draft"
EXAM_STATUS_GENERATING = "generating"
EXAM_STATUS_READY = "ready"
EXAM_STATUS_IN_PROGRESS = "in_progress"
EXAM_STATUS_COMPLETED = "completed"

EXAM_STATUS_CHOICES = [
    (EXAM_STATUS_DRAFT, "Draft"),
    (EXAM_STATUS_GENERATING, "Generating"),
    (EXAM_STATUS_READY, "Ready"),
    (EXAM_STATUS_IN_PROGRESS, "In progress"),
    (EXAM_STATUS_COMPLETED, "Completed"),
]

SECTION_STATUS_PENDING = "pending"
SECTION_STATUS_GENERATING = "generating"
SECTION_STATUS_READY = "ready"
SECTION_STATUS_FAILED = "failed"
SECTION_STATUS_SUBMITTED = "submitted"

SECTION_STATUS_CHOICES = [
    (SECTION_STATUS_PENDING, "Pending"),
    (SECTION_STATUS_GENERATING, "Generating"),
    (SECTION_STATUS_READY, "Ready"),
    (SECTION_STATUS_FAILED, "Failed"),
    (SECTION_STATUS_SUBMITTED, "Submitted"),
]

MODE_BUDGET = "budget"
MODE_QUALITY = "quality"

MODE_CHOICES = [
    (MODE_BUDGET, "Budget"),
    (MODE_QUALITY, "Quality"),
]

DIFFICULTY_C1_LOW = "c1_low"
DIFFICULTY_C1_MID = "c1_mid"
DIFFICULTY_C1_HIGH = "c1_high"

DIFFICULTY_CHOICES = [
    (DIFFICULTY_C1_LOW, "C1 low"),
    (DIFFICULTY_C1_MID, "C1 mid"),
    (DIFFICULTY_C1_HIGH, "C1 high"),
]

RUOE_PARTS = {
    PART_P1,
    PART_P2,
    PART_P3,
    PART_P4,
    PART_P5,
    PART_P6,
    PART_P7,
    PART_P8,
}

WRITING_PARTS = {
    PART_W1,
    PART_W2,
}

PART_TO_SECTION_TYPE = {
    **{part: SECTION_TYPE_RUOE for part in RUOE_PARTS},
    **{part: SECTION_TYPE_WRITING for part in WRITING_PARTS},
}


def sort_parts(parts: list[str]) -> list[str]:
    unique_parts = list(dict.fromkeys(parts))
    return sorted(unique_parts, key=lambda part: CANONICAL_PART_ORDER.index(part))


def infer_section_type(part_code: str) -> str:
    try:
        return PART_TO_SECTION_TYPE[part_code]
    except KeyError as exc:
        raise ValueError(f"Unknown part code: {part_code}") from exc

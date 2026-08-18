import re

# Common aliases: map variant -> canonical form
SKILL_ALIASES = {
    "js": "javascript",
    "reactjs": "react",
    "react.js": "react",
    "nodejs": "node.js",
    "node js": "node.js",
    "ml": "machine learning",
    "dl": "deep learning",
    "nlp": "natural language processing",
    "ai": "artificial intelligence",
    "genai": "generative ai",
    "gen ai": "generative ai",
    "cv": "computer vision",
    "oop": "object oriented programming",
    "oops": "object oriented programming",
    "dbms": "database management systems",
    "os": "operating systems",
    "dsa": "data structures and algorithms",
    "rest api": "rest apis",
    "restful api": "rest apis",
    "restful apis": "rest apis",
    "postgres": "postgresql",
    "mongo": "mongodb",
    "tf": "tensorflow",
    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",
    "py": "python",
    "c plus plus": "c++",
    "cpp": "c++",
    "html5": "html",
    "css3": "css",
    "aws cloud": "aws",
    "amazon web services": "aws",
    "gcp": "google cloud platform",
    "vscode": "visual studio code",
    "git & github": "git",
    "git and github": "git",
}


def normalize_skill(skill: str) -> str:
    """
    Normalizes a skill string for comparison:
    - lowercase
    - strip whitespace
    - remove trailing punctuation
    - map known aliases to canonical form
    """
    if not skill:
        return ""

    cleaned = skill.strip().lower()
    cleaned = re.sub(r"[.\-/]+$", "", cleaned)  # trailing dots/dashes/slashes
    cleaned = re.sub(r"\s+", " ", cleaned)       # collapse multiple spaces

    return SKILL_ALIASES.get(cleaned, cleaned)


def normalize_skill_list(skills: list[str]) -> set[str]:
    """
    Normalizes a list of skills and returns a set of unique canonical skills.
    """
    if not skills:
        return set()
    return {normalize_skill(s) for s in skills if s}
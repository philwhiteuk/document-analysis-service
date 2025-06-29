"""Text metrics computation engine."""

from __future__ import annotations

import re
from collections import Counter
from typing import Dict, List

# A minimal English stopword list (can be expanded later or replaced with nltk).
STOPWORDS: set[str] = {
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "if",
    "in",
    "on",
    "with",
    "to",
    "of",
    "for",
    "at",
    "by",
    "from",
    "up",
    "down",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "he",
    "she",
    "it",
    "they",
    "them",
    "his",
    "her",
    "their",
    "that",
    "this",
    "these",
    "those",
    "you",
    "your",
    "yours",
    "I",
    "we",
    "us",
    "me",
    "my",
    "mine",
}

WORD_RE = re.compile(r"[A-Za-z']+")  # Words with optional apostrophes
SENTENCE_RE = re.compile(r"[.!?]+")


def _tokenize_words(text: str) -> List[str]:
    return WORD_RE.findall(text.lower())


def _tokenize_sentences(text: str) -> List[str]:
    # Split on punctuation but keep simple approach
    sentences = SENTENCE_RE.split(text)
    return [s.strip() for s in sentences if s.strip()]


def flesch_kincaid_grade_level(total_sent: int, total_words: int, total_syllables: int) -> float:
    if total_sent == 0 or total_words == 0:
        return 0.0
    return 0.39 * (total_words / total_sent) + 11.8 * (total_syllables / total_words) - 15.59


def count_syllables(word: str) -> int:
    word = word.lower()
    vowels = "aeiouy"
    syllables = 0
    prev_char_was_vowel = False

    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_char_was_vowel:
            syllables += 1
        prev_char_was_vowel = is_vowel

    if word.endswith("e") and syllables > 1:
        syllables -= 1

    return max(syllables, 1)


def compute_metrics(text: str) -> Dict[str, object]:
    """Compute text metrics required by acceptance criteria."""

    sentences = _tokenize_sentences(text)
    words = _tokenize_words(text)

    total_words = len(words)
    unique_words = len(set(words))
    total_sentences = len(sentences)

    avg_sentence_length = total_words / total_sentences if total_sentences else 0

    # Compute syllables for readability
    total_syllables = sum(count_syllables(w) for w in words)
    fk_grade = flesch_kincaid_grade_level(total_sentences, total_words, total_syllables)

    # Top 10 words excluding stopwords
    filtered_words = [w for w in words if w not in STOPWORDS]
    common = Counter(filtered_words).most_common(10)

    return {
        "total_word_count": total_words,
        "unique_word_count": unique_words,
        "average_sentence_length": round(avg_sentence_length, 2),
        "flesch_kincaid_grade_level": round(fk_grade, 2),
        "top_10_words": common,
    }

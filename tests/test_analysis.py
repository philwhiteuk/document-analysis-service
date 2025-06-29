import pytest
from app.services.analysis import (
    _tokenize_words,
    _tokenize_sentences,
    flesch_kincaid_grade_level,
    count_syllables,
    compute_metrics,
)

# _tokenize_words
@pytest.mark.parametrize("text,expected", [
    ("Hello, world!", ["hello", "world"]),
    ("It's a test.", ["it's", "a", "test"]),
    ("", []),
])
def test_tokenize_words(text, expected):
    assert _tokenize_words(text) == expected

# _tokenize_sentences
@pytest.mark.parametrize("text,expected", [
    ("Hello world. This is a test!", ["Hello world", "This is a test"]),
    ("One? Two! Three.", ["One", "Two", "Three"]),
    ("No punctuation", ["No punctuation"]),
    ("", []),
])
def test_tokenize_sentences(text, expected):
    assert _tokenize_sentences(text) == expected

# flesch_kincaid_grade_level
@pytest.mark.parametrize("total_sent,total_words,total_syllables,expected", [
    (1, 10, 10, pytest.approx(0.39 * 10 + 11.8 * 1 - 15.59, 0.01)),
    (2, 20, 30, pytest.approx(0.39 * 10 + 11.8 * 1.5 - 15.59, 0.01)),
    (0, 10, 10, 0.0),
    (1, 0, 0, 0.0),
])
def test_flesch_kincaid_grade_level(total_sent, total_words, total_syllables, expected):
    assert flesch_kincaid_grade_level(total_sent, total_words, total_syllables) == expected

# count_syllables
@pytest.mark.parametrize("word,expected", [
    ("hello", 2),
    ("world", 1),
    ("syllable", 2),
    ("a", 1),
    ("bee", 1),
    ("", 1),
])
def test_count_syllables(word, expected):
    assert count_syllables(word) == expected

# compute_metrics
@pytest.mark.parametrize("text,expected_keys", [
    ("Hello world. This is a test!", [
        "total_word_count",
        "unique_word_count",
        "average_sentence_length",
        "flesch_kincaid_grade_level",
        "top_10_words",
    ]),
    ("", [
        "total_word_count",
        "unique_word_count",
        "average_sentence_length",
        "flesch_kincaid_grade_level",
        "top_10_words",
    ]),
])
def test_compute_metrics_keys(text, expected_keys):
    metrics = compute_metrics(text)
    assert set(metrics.keys()) == set(expected_keys)


def test_compute_metrics_values():
    text = "Hello hello world. This is a test!"
    metrics = compute_metrics(text)
    assert metrics["total_word_count"] == 7
    assert metrics["unique_word_count"] == 6
    assert metrics["average_sentence_length"] == 3.5
    assert isinstance(metrics["flesch_kincaid_grade_level"], float)
    assert isinstance(metrics["top_10_words"], list)
    # Check top_10_words content
    top_words = dict(metrics["top_10_words"])
    assert "hello" in top_words and top_words["hello"] == 2
    assert "test" in top_words

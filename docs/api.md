# API Documentation

Base URL: `http://localhost:8000`

## Upload a File

```
POST /upload/
Content-Type: multipart/form-data
```

**Form Fields**
- `file`: `.txt` file, max 5 MB

**Response 201**
```json
{
  "file_id": "7b9f8c2e78a14b6bb0ad9e2e770f8f4b",
  "filename": "sample.txt",
  "metrics": {
    "total_word_count": 120,
    "unique_word_count": 80,
    "average_sentence_length": 14.3,
    "flesch_kincaid_grade_level": 8.1,
    "top_10_words": [["the", 10], ["service", 4] /* … */]
  }
}
```

---

## Get Results for a File

```
GET /results/{file_id}
```

**Response 200**
```json
{
  "file_id": "7b9f8c2e78a14b6bb0ad9e2e770f8f4b",
  "filename": "sample.txt",
  "uploaded_at": "2025-06-29T13:00:00Z",
  "metrics": { /* same as above */ }
}
```

Returns `404` if `file_id` is unknown.

---

## List Recent Documents

```
GET /history/?limit=20
```

**Response 200**
```json
[
  {
    "file_id": "…",
    "filename": "sample.txt",
    "uploaded_at": "2025-06-29T13:00:00Z"
  },
  { /* 19 more */ }
]
```

---

## Health Check

```
GET /health
```

**Response 200**
```json
{ "status": "ok" }
```

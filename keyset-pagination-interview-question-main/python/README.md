# Keyset Pagination

**Time budget:** ~1 hour
**Stack:** Python 3.8+ / FastAPI

## Setup

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn
uvicorn server:app --reload
```

Your working file is `server.py`. The datasets live in `data.py`.

---

## Problem

Implement `GET /query` — a **generic** paginated, sorted view over any dataset in `data.py`.

Two datasets are provided. They share only an `id` column; all other fields differ. Your pagination logic must work for both without hard-coding field names or assuming a particular row shape.

### Datasets

| Name | Columns | Types |
|------|---------|-------|
| `items` | `id`, `priority`, `created_at`, `is_active` | string, number, number, **boolean** |
| `orders` | `id`, `amount`, `ordered_at`, `region`, `is_express` | string, number, number, string, **boolean** |

Look up rows via the `DATASETS` registry in `data.py`.

### Route

```
GET /query?dataset=<name>&sort=<base64>&page_size=<int>&cursor=<string>
```

| Param | Required | Description |
|-------|----------|-------------|
| `dataset` | yes | `"items"` or `"orders"` |
| `sort` | yes | Base64-encoded JSON array of sort entries. Fields must exist on the chosen dataset. |
| `page_size` | yes | Items per page (minimum 1) |
| `cursor` | no | Cursor from a previous response. Omit for the first page. |

### Response

```json
{
  "items": [...],
  "next_cursor": "..." or null
}
```

`next_cursor` is `null` when there are no more pages. When present, the consumer passes it back as the `cursor` query param to get the next page.

### Examples

**Items** — sort by priority descending, then created_at ascending:

```json
[
  {"field": "priority", "dir": "desc"},
  {"field": "created_at", "dir": "asc"}
]
```

Base64-encoded: `W3siZmllbGQiOiAicHJpb3JpdHkiLCAiZGlyIjogImRlc2MifSwgeyJmaWVsZCI6ICJjcmVhdGVkX2F0IiwgImRpciI6ICJhc2MifV0=`

```bash
# first page
curl "http://localhost:8000/query?dataset=items&sort=W3siZmllbGQiOiAicHJpb3JpdHkiLCAiZGlyIjogImRlc2MifSwgeyJmaWVsZCI6ICJjcmVhdGVkX2F0IiwgImRpciI6ICJhc2MifV0=&page_size=5"

# next page — pass next_cursor from the previous response as the cursor param
curl "http://localhost:8000/query?dataset=items&sort=W3siZmllbGQiOiAicHJpb3JpdHkiLCAiZGlyIjogImRlc2MifSwgeyJmaWVsZCI6ICJjcmVhdGVkX2F0IiwgImRpciI6ICJhc2MifV0=&page_size=5&cursor=<next_cursor>"
```

**Orders** — sort by amount descending, then is_express ascending, then ordered_at ascending:

```json
[
  {"field": "amount", "dir": "desc"},
  {"field": "is_express", "dir": "asc"},
  {"field": "ordered_at", "dir": "asc"}
]
```

Base64-encoded: `W3siZmllbGQiOiAiYW1vdW50IiwgImRpciI6ICJkZXNjIn0sIHsiZmllbGQiOiAiaXNfZXhwcmVzcyIsICJkaXIiOiAiYXNjIn0sIHsiZmllbGQiOiAib3JkZXJlZF9hdCIsICJkaXIiOiAiYXNjIn1d`

```bash
curl "http://localhost:8000/query?dataset=orders&sort=W3siZmllbGQiOiAiYW1vdW50IiwgImRpciI6ICJkZXNjIn0sIHsiZmllbGQiOiAiaXNfZXhwcmVzcyIsICJkaXIiOiAiYXNjIn0sIHsiZmllbGQiOiAib3JkZXJlZF9hdCIsICJkaXIiOiAiYXNjIn1d&page_size=5"
```

from typing import Optional

from fastapi import FastAPI, Query

from data import DATASETS

app = FastAPI()


@app.get("/query")
def query(
    dataset: str = Query(description='Dataset name: "items" or "orders"'),
    sort: str = Query(description="Base64-encoded JSON array of sort entries"),
    page_size: int = Query(ge=1),
    cursor: Optional[str] = Query(default=None),
):
    """
    Return a paginated, sorted view of a dataset.
    See README.md for the full spec.
    """
    raise NotImplementedError("implement me")

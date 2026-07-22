import express from "express";
import { DATASETS } from "./data";

const app = express();
const PORT = 3000;

interface QueryParams {
	dataset: string;
	sort: string;
	page_size: string;
	cursor?: string;
}

interface QueryResponse {
	items: Record<string, unknown>[];
	next_cursor: string | null;
}

/**
 * GET /query?dataset=<name>&sort=<base64>&page_size=<int>&cursor=<base64>
 *
 * Return a paginated, sorted view of a dataset.
 * See README.md for the full spec.
 */
app.get("/query", (req, res) => {
	const { dataset, sort, page_size, cursor } =
		req.query as unknown as QueryParams;

	throw new Error("implement me");
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

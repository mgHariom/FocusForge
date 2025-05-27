import { Router } from "express";

const searchDocumentRouter = Router();

searchDocumentRouter.post("/search-summary", async (req, res) => {
    const { query, top_k } = req.body;

    try {
        const response = await fetch("http://localhost:8000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query:query, top_k: 3 }),
        });

        const data = await response.json();
        if (!data.success) {
            return res.status(500).json({ error: "Failed to fetch search summary" });
        }

        res.status(200).json({
            success: true,
            summary: data.documents,
            message: "Search summary fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching search summary:", error);
    }
});

// const searchDocumentFunction = async (query, top_k = 3) => {
//     try {
//         const response = await fetch("http://localhost:8000/search", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ query:query, top_k: 3 }),
//         });

//         const data = await response.json();
//         if (!data.success) {
//             return res.status(500).json({ error: "Failed to fetch search summary" });
//         }
//     } catch (error) {
//         console.error("Error fetching search summary:", error);
//     }
// }

export default searchDocumentRouter;
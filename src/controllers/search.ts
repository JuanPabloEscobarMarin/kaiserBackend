import type { Request, Response } from "express";
import SearchService from "../services/search.services.ts";

class SearchController {
    search = async (req: Request, res: Response) => {
        try {
            const raw = req.query.q as string;
            const q = raw ? raw.replace(/\+/g, " ") : raw;

            if (!q || q.trim().length === 0) {
                return res
                    .status(400)
                    .json({ error: "El parámetro 'q' es requerido" });
            }

            if (q.trim().length < 2) {
                return res
                    .status(400)
                    .json({
                        error: "La búsqueda debe tener al menos 2 caracteres",
                    });
            }

            const results = await SearchService.search(q.trim());

            return res.json({
                query: q.trim(),
                total: results.length,
                results,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({
                error: "Error interno del servidor",
            });
        }
    };
}

export default new SearchController();

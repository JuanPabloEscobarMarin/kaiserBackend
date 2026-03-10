import SearchRepository from "../repositories/search.repository.ts";

const SCORE_THRESHOLD = 0.25;

export interface SearchResultItem {
    id: string;
    label: string;
    type: "service";
    score: number;
    meta: Record<string, unknown>;
}

function bigrams(str: string): Set<string> {
    const s = str.toLowerCase().replace(/\s+/g, " ").trim();
    const result = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) {
        result.add(s.slice(i, i + 2));
    }
    return result;
}

function diceSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length < 2 || b.length < 2) return 0;

    const bgA = bigrams(a);
    const bgB = bigrams(b);

    let intersection = 0;
    bgA.forEach((bg) => {
        if (bgB.has(bg)) intersection++;
    });

    return (2 * intersection) / (bgA.size + bgB.size);
}

function scoreMatch(query: string, text: string): number {
    const normalQuery = query.toLowerCase().trim();
    const normalText = text.toLowerCase().trim();

    if (normalText.includes(normalQuery)) return 1;

    const queryTokens = normalQuery.split(/\s+/).filter((t) => t.length > 1);
    const textTokens = normalText.split(/\s+/);

    if (queryTokens.length === 0) return 0;

    let totalScore = 0;

    for (const qToken of queryTokens) {
        let best = 0;
        for (const tToken of textTokens) {
            if (tToken.includes(qToken) || qToken.includes(tToken)) {
                best = Math.max(best, 0.85);
            }
            const sim = diceSimilarity(qToken, tToken);
            if (sim > best) best = sim;
        }
        totalScore += best;
    }

    return totalScore / queryTokens.length;
}

function tokenize(query: string): string[] {
    const stopwords = new Set(["de", "la", "el", "en", "y", "a", "del"]);
    return query
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.replace(/[^a-z]/gi, ""))
        .filter((t) => t.length >= 2 && !stopwords.has(t));
}

class SearchService {
    search = async (query: string): Promise<SearchResultItem[]> => {
        if (!query || query.trim().length === 0) {
            throw new Error("La busqueda no puede estar vacia");
        }

        const tokens = tokenize(query);
        const searchTokens = tokens.length > 0 ? tokens : [query.trim()];

        const services = await SearchRepository.searchServices(searchTokens);

        const scoredServices: SearchResultItem[] = services
            .map((s) => ({
                id: s.id,
                label: s.name,
                type: "service" as const,
                score: scoreMatch(query, s.name),
                meta: {
                    price: s.price,
                    duration: s.duration,
                    discount: s.discount,
                    urlImage: s.urlImage,
                },
            }))
            .filter((s) => s.score >= SCORE_THRESHOLD);

        scoredServices.sort((a, b) => b.score - a.score);

        return scoredServices;
    };
}

export default new SearchService();

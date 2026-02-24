export interface ContentItem {
    id: number;
    value: string;
    valueAr?: string;
}

export interface ContentMap {
    [section: string]: {
        [key: string]: ContentItem;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const contentService = {
    async getContentByPage(page: string): Promise<ContentMap> {
        const url = `${API_URL}/content/page/${page}`;
        console.log(`📡 Fetching content from: ${url}`);
        const response = await fetch(url, {
            cache: 'no-store',
        });
        if (!response.ok) {
            const errorBody = await response.text().catch(() => 'Could not read body');
            console.error(`❌ Content fetch failed: status=${response.status}, url=${url}, body=${errorBody}`);
            throw new Error(`Failed to fetch content: ${response.status} - ${errorBody}`);
        }
        return response.json();
    },

    async updateContent(id: number, value: string): Promise<void> {
        // We'll use the bulk-update endpoint or single update depending on need
        // For single update: PATCH /content/:id
        const response = await fetch(`${API_URL}/content/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header if needed, for now assuming public/dev or handled by cookie
            },
            body: JSON.stringify({ value }),
        });
        if (!response.ok) {
            throw new Error('Failed to update content');
        }
    },

    async bulkUpdateContent(updates: { id: number; value?: string; valueAr?: string }[]): Promise<void> {
        const response = await fetch(`${API_URL}/content/bulk-update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error('Failed to bulk update content');
        }
    },

    // Helper to flatten the nested map into what the editor expects
    flattenContent(contentMap: ContentMap): { [key: string]: string } {
        const flat: { [key: string]: string } = {};
        Object.keys(contentMap).forEach(section => {
            Object.keys(contentMap[section]).forEach(key => {
                if (section === 'hero' || section === 'products' || section === 'cta') {
                    flat[key] = contentMap[section][key].value;
                } else {
                    flat[`${section}-${key}`] = contentMap[section][key].value;
                }
            });
        });
        return flat;
    },

    // Helper to flatten Arabic content from the nested map
    flattenContentAr(contentMap: ContentMap): { [key: string]: string } {
        const flat: { [key: string]: string } = {};
        Object.keys(contentMap).forEach(section => {
            Object.keys(contentMap[section]).forEach(key => {
                const ar = contentMap[section][key].valueAr;
                if (ar) {
                    if (section === 'hero' || section === 'products' || section === 'cta') {
                        flat[key] = ar;
                    } else {
                        flat[`${section}-${key}`] = ar;
                    }
                }
            });
        });
        return flat;
    },

    // Helper to get ID map for updates
    // returns { 'badge-text': 1, 'product-1-title': 15, ... }
    getIdMap(contentMap: ContentMap): { [key: string]: number } {
        const ids: { [key: string]: number } = {};
        Object.keys(contentMap).forEach(section => {
            Object.keys(contentMap[section]).forEach(key => {
                if (section === 'hero' || section === 'products' || section === 'cta') {
                    ids[key] = contentMap[section][key].id;
                } else {
                    ids[`${section}-${key}`] = contentMap[section][key].id;
                }
            });
        });
        return ids;
    }
};

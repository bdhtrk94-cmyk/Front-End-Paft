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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const contentService = {
    async getContentByPage(page: string): Promise<ContentMap> {
        const response = await fetch(`${API_URL}/content/page/${page}`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch content');
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

    async bulkUpdateContent(updates: { id: number; value: string }[]): Promise<void> {
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
                // Determine if we should prefix with section name
                // Editor expects 'title' for hero title, but 'product-1-title' for product
                // This mapping logic is specific to how the seed data was structured vs editor expectations

                // If section is 'hero', we might want to keep keys as is if they are unique enough?
                // Seed: hero -> title, description, badge-text
                // Editor: title, description, badge-text
                if (section === 'hero' || section === 'products' || section === 'cta') {
                    flat[key] = contentMap[section][key].value;
                } else {
                    // Seed: product-1 -> title
                    // Editor: product-1-title
                    flat[`${section}-${key}`] = contentMap[section][key].value;
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

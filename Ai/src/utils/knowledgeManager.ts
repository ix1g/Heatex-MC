import fs from 'fs';
import path from 'path';

class KnowledgeManager {
    private knowledge: Record<string, any>;
    private knowledgePath: string;

    constructor() {
        this.knowledge = {};
        this.knowledgePath = path.join(process.cwd(), '..', 'knowledge', 'knowledge.json');
        this.loadKnowledge();
    }

    private loadKnowledge(): void {
        try {
            if (fs.existsSync(this.knowledgePath)) {
                const data = fs.readFileSync(this.knowledgePath, 'utf8');
                this.knowledge = JSON.parse(data);
                console.log('Knowledge base loaded successfully');
            } else {
                console.log('No knowledge base found. Creating empty knowledge base.');
                this.saveKnowledge();
            }
        } catch (error) {
            console.error('Error loading knowledge:', error);
            this.knowledge = {};
        }
    }

    private saveKnowledge(): void {
        try {
            const dir = path.dirname(this.knowledgePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.knowledgePath, JSON.stringify(this.knowledge, null, 2));
        } catch (error) {
            console.error('Error saving knowledge:', error);
        }
    }

    addKnowledge(category: string, key: string, value: string): void {
        if (!this.knowledge[category]) {
            this.knowledge[category] = {};
        }
        this.knowledge[category][key] = value;
        this.saveKnowledge();
    }

    getKnowledge(category: string, key?: string): any {
        if (key) {
            return this.knowledge[category]?.[key];
        }
        return this.knowledge[category];
    }

    getRelevantKnowledge(input: string): string {
        const relevantInfo: string[] = [];
        
        for (const category in this.knowledge) {
            for (const key in this.knowledge[category]) {
                const value = this.knowledge[category][key];
                // Simple keyword matching - could be enhanced with more sophisticated matching
                if (
                    input.toLowerCase().includes(key.toLowerCase()) ||
                    input.toLowerCase().includes(category.toLowerCase())
                ) {
                    relevantInfo.push(`${category} - ${key}: ${value}`);
                }
            }
        }

        return relevantInfo.join('\n');
    }
}

export const knowledgeManager = new KnowledgeManager();
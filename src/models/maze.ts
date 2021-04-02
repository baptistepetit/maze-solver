export class Maze {
    obj: string;

    constructor(file?: Blob) {
        if (file) {
            this.loadFromFile(file);
        }
    }

    loadFromFile(file: Blob): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const output = event.target.result.toString();
                this.loadFromText(output);
                resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    loadFromText(text: string): void {
        this.obj = text;
    }
}

export class Buttons {
    isSelectingEnd: boolean;
    isSelectingStart: boolean;
    private startButton: HTMLButtonElement;
    private endButton: HTMLButtonElement;

    constructor(startButton: HTMLButtonElement, endButton: HTMLButtonElement) {
        this.isSelectingEnd = false;
        this.isSelectingStart = false;
        this.startButton = startButton;
        this.endButton = endButton;
    }

    selectStart(): void {
        if (this.isSelectingStart) {
            this.startButton.className = 'off';
            this.isSelectingStart = false;
        } else {
            this.isSelectingStart = true;
            this.isSelectingEnd = false;
            this.endButton.className = 'off';
            this.startButton.className = 'on';
        }
    }

    selectEnd(): void {
        if (this.isSelectingEnd) {
            this.endButton.className = 'off';
            this.isSelectingEnd = false;
        } else {
            this.isSelectingStart = false;
            this.isSelectingEnd = true;
            this.startButton.className = 'off';
            this.endButton.className = 'on';
        }
    }
}

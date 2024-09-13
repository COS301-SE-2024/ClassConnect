let speechSynthesis: SpeechSynthesis;
let speechRate = 0.5;

if (typeof window !== 'undefined') {
	speechSynthesis = window.speechSynthesis;
}

export function speak(text: string): void {
	if (!speechSynthesis) return;
	speechSynthesis.cancel();

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.rate = speechRate;
	speechSynthesis.speak(utterance);
}

export function setRate(rate: number): void {
	speechRate = rate;
}

export function cancel(): void {
	if (speechSynthesis) {
		speechSynthesis.cancel();
	}
}

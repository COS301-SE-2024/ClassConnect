import { speak, cancel } from '$lib/components/webspeech/speechSynthesis';

let currentIndex = 0;

export function handleKeyDown(event: KeyboardEvent) {
	if (event.key === 'Tab' || event.key === 'Enter') {
		event.preventDefault();

		if (event.key === 'Enter') {
			handleSelection(currentIndex);
		} else if (event.key === 'Tab') {
			moveFocus(currentIndex + 1);
		}
	}
}

export function moveFocus(index: number) {
	const links = document.querySelectorAll('a');
	if (links[index]) {
		links[index].focus();
		currentIndex = index;
		if (links[index].textContent) {
			speak(links[index].textContent.trim());
		}
	}
}

export function handleSelection(index: number) {
	const links = document.querySelectorAll('a');
	if (links[index]) {
		window.location.href = links[index].getAttribute('href')!;
	}
}

export function handleMouseEnter(name: string) {
	speak(name);
}

export function handleMouseLeave() {
	cancel();
}

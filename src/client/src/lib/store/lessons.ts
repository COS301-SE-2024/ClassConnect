import { writable } from 'svelte/store';
import { type StreamVideoParticipant } from '@stream-io/video-client';

export const screenShareEnabled = writable(false);
export const screenShareParticipant = writable<StreamVideoParticipant | null>(null);
export const cameraEnabled = writable(false);

export const participantsThere = writable<StreamVideoParticipant[]>([]);

export const participantsCount = writable<number>(0);

participantsThere.subscribe((participants) => {
	participantsCount.set(participants.length);
});

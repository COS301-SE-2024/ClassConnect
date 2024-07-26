
import type { Actions, PageServerLoad } from './$types';
import { fail, error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import Question from '$lib/server/database/schemas/Question';
import Quiz from '$lib/server/database/schemas/Quiz';


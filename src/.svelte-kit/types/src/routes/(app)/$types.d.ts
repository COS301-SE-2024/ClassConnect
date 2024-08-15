import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/(app)';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type LayoutRouteId = RouteId | "/(app)/admins" | "/(app)/announcements" | "/(app)/dashboard" | "/(app)/faq" | "/(app)/grades" | "/(app)/lecturers" | "/(app)/organisation" | "/(app)/profile" | "/(app)/settings" | "/(app)/students" | "/(app)/workspaces" | "/(app)/workspaces/[workspace]/activities" | "/(app)/workspaces/[workspace]/analytics" | "/(app)/workspaces/[workspace]/announcements" | "/(app)/workspaces/[workspace]/dashboard" | "/(app)/workspaces/[workspace]/environments" | "/(app)/workspaces/[workspace]/gradecenter" | "/(app)/workspaces/[workspace]/grades" | "/(app)/workspaces/[workspace]/lessons" | "/(app)/workspaces/[workspace]/lessons/video" | "/(app)/workspaces/[workspace]/materials" | "/(app)/workspaces/[workspace]/materials/material" | "/(app)/workspaces/[workspace]/quizzes" | "/(app)/workspaces/[workspace]/quizzes/[quiz]"
type LayoutParams = RouteParams & { workspace?: string; quiz?: string }
type LayoutServerParentData = EnsureDefined<import('../$types.js').LayoutServerData>;
type LayoutParentData = EnsureDefined<import('../$types.js').LayoutData>;

export type LayoutServerLoad<OutputData extends OutputDataShape<LayoutServerParentData> = OutputDataShape<LayoutServerParentData>> = Kit.ServerLoad<LayoutParams, LayoutServerParentData, OutputData, LayoutRouteId>;
export type LayoutServerLoadEvent = Parameters<LayoutServerLoad>[0];
export type LayoutServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../../src/routes/(app)/+layout.server.js').load>>>>>>;
export type LayoutData = Expand<Omit<LayoutParentData, keyof LayoutServerData> & EnsureDefined<LayoutServerData>>;
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;
import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageServerParentData = EnsureDefined<LayoutServerData>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/(app)/admins" | "/(app)/announcements" | "/(app)/dashboard" | "/(app)/faq" | "/(app)/grades" | "/(app)/lecturers" | "/(app)/organisation" | "/(app)/profile" | "/(app)/settings" | "/(app)/students" | "/(app)/workspaces" | "/(app)/workspaces/[workspace]/activities" | "/(app)/workspaces/[workspace]/analytics" | "/(app)/workspaces/[workspace]/announcements" | "/(app)/workspaces/[workspace]/dashboard" | "/(app)/workspaces/[workspace]/environments" | "/(app)/workspaces/[workspace]/environments/sandbox" | "/(app)/workspaces/[workspace]/gradecenter" | "/(app)/workspaces/[workspace]/grades" | "/(app)/workspaces/[workspace]/lessons" | "/(app)/workspaces/[workspace]/lessons/[lesson]" | "/(app)/workspaces/[workspace]/lessons/video" | "/(app)/workspaces/[workspace]/materials" | "/(app)/workspaces/[workspace]/materials/material" | "/(app)/workspaces/[workspace]/quizzes" | "/(app)/workspaces/[workspace]/quizzes/[quiz]" | "/(auth)/signin" | "/(auth)/signout" | "/(auth)/signup" | "/(auth)/signup/successful" | null
type LayoutParams = RouteParams & { workspace?: string; lesson?: string; quiz?: string }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerLoad<OutputData extends Partial<App.PageData> & Record<string, any> | void = Partial<App.PageData> & Record<string, any> | void> = Kit.ServerLoad<RouteParams, PageServerParentData, OutputData, RouteId>;
export type PageServerLoadEvent = Parameters<PageServerLoad>[0];
export type ActionData = unknown;
export type PageServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+page.server.js').load>>>>>>;
export type PageLoad<OutputData extends OutputDataShape<PageParentData> = OutputDataShape<PageParentData>> = Kit.Load<RouteParams, PageServerData, PageParentData, OutputData, RouteId>;
export type PageLoadEvent = Parameters<PageLoad>[0];
export type PageData = Expand<Omit<PageParentData, keyof PageParentData & EnsureDefined<PageServerData>> & OptionalUnion<EnsureDefined<PageParentData & EnsureDefined<PageServerData>>>>;
export type Action<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Action<RouteParams, OutputData, RouteId>
export type Actions<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Actions<RouteParams, OutputData, RouteId>
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;
export type OpeningDay =
    | "EVERYDAY"
    | "CHECK_AVAILABILITY_DAYTIME"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"
    | "HOLIDAY";

export interface OpeningPeriod {
    days: OpeningDay[];
    open?: string;  // "HH:MM"
    close?: string; // "HH:MM"
}

export interface OpeningPattern {
    id: string;
    description: string;
    periods: OpeningPeriod[];
}
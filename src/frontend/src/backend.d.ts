import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cell {
    value: Value;
    name: string;
}
export interface Comment {
    id: bigint;
    createdAt: Timestamp;
    text: string;
    authorName: string;
    foodId: FoodId;
}
export interface CommentInput {
    text: string;
    authorName: string;
    foodId: FoodId;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type FoodId = bigint;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Review {
    id: bigint;
    createdAt: Timestamp;
    text: string;
    reviewerName: string;
    rating: bigint;
    foodId: FoodId;
}
export interface ReviewInput {
    text: string;
    reviewerName: string;
    rating: bigint;
    foodId: FoodId;
}
export interface ReviewStats {
    count: bigint;
    average: number;
    foodId: FoodId;
}
export interface Suggestion {
    id: bigint;
    name?: string;
    createdAt: Timestamp;
    text: string;
    category: SuggestionCategory;
}
export interface SuggestionInput {
    name?: string;
    text: string;
    category: SuggestionCategory;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum SuggestionCategory {
    topic = "topic",
    internationalFood = "internationalFood",
    websiteImprovement = "websiteImprovement",
    filipinoFood = "filipinoFood"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
/**
 * / LASA composition root: owns stable state and wires domain mixins.
 * / No business logic lives here — every endpoint is delegated to a mixin.
 */
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Return the backend API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Average rating and review count for one food.
     */
    getReviewStats(foodId: bigint): Promise<ReviewStats>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List all comments, newest first.
     */
    listComments(): Promise<Array<Comment>>;
    /**
     * / List the caller's explored food ids.
     */
    listExplored(): Promise<Array<bigint>>;
    /**
     * / List the caller's favorite food ids.
     */
    listFavorites(): Promise<Array<bigint>>;
    /**
     * / List all submitted reviews, newest first.
     */
    listReviews(): Promise<Array<Review>>;
    /**
     * / List all submitted suggestions, newest first.
     */
    listSuggestions(): Promise<Array<Suggestion>>;
    /**
     * / Mark a food as explored for the caller; returns the new state.
     */
    markExplored(foodId: bigint): Promise<boolean>;
    schema(): Promise<string>;
    /**
     * / Leave a food-related comment.
     */
    submitComment(input: CommentInput): Promise<Comment>;
    /**
     * / Submit a review with a 1-5 star rating, reviewer name, and review text.
     */
    submitReview(input: ReviewInput): Promise<Review>;
    /**
     * / Submit a food, topic, or website-improvement suggestion.
     */
    submitSuggestion(input: SuggestionInput): Promise<Suggestion>;
    /**
     * / Toggle a food as favorite for the caller; returns the new state.
     */
    toggleFavorite(foodId: bigint): Promise<boolean>;
}

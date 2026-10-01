/// Migration: add LASA community and per-caller stable state.
/// Self-contained — only `mo:core` imports are allowed here.
import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type Review = {
    id : Nat;
    foodId : Nat;
    reviewerName : Text;
    rating : Nat;
    text : Text;
    createdAt : Nat;
  };

  type Comment = {
    id : Nat;
    foodId : Nat;
    authorName : Text;
    text : Text;
    createdAt : Nat;
  };

  type SuggestionCategory = {
    #filipinoFood;
    #internationalFood;
    #topic;
    #websiteImprovement;
  };

  type Suggestion = {
    id : Nat;
    name : ?Text;
    text : Text;
    category : SuggestionCategory;
    createdAt : Nat;
  };

  type Favorite = { owner : Principal; foodId : Nat };
  type PassportEntry = { owner : Principal; foodId : Nat };

  /// Deployed baseline is an empty actor, so the migration domain is empty.
  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    reviews : Map.Map<Nat, Review>;
    nextReviewId : { var value : Nat };
    comments : Map.Map<Nat, Comment>;
    nextCommentId : { var value : Nat };
    suggestions : Map.Map<Nat, Suggestion>;
    nextSuggestionId : { var value : Nat };
    favorites : Map.Map<Principal, Map.Map<Nat, Favorite>>;
    passport : Map.Map<Principal, Map.Map<Nat, PassportEntry>>;
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      reviews = Map.empty();
      nextReviewId = { var value = 0 };
      comments = Map.empty();
      nextCommentId = { var value = 0 };
      suggestions = Map.empty();
      nextSuggestionId = { var value = 0 };
      favorites = Map.empty();
      passport = Map.empty();
    };
  };
};

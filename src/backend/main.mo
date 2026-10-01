/// LASA composition root: owns stable state and wires domain mixins.
/// No business logic lives here — every endpoint is delegated to a mixin.
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

import ReviewTypes "types/reviews";
import CommentTypes "types/comments";
import SuggestionTypes "types/suggestions";
import FavoriteTypes "types/favorites";
import PassportTypes "types/passport";

import ReviewsApi "mixins/reviews-api";
import CommentsApi "mixins/comments-api";
import SuggestionsApi "mixins/suggestions-api";
import FavoritesApi "mixins/favorites-api";
import PassportApi "mixins/passport-api";
import ApiDocMixin "mixins/api-doc";

actor {
  // --- Authorization state (owned by the authorization mixin) ---
  let accessControlState : AccessControl.AccessControlState;

  // --- Shared community data ---
  let reviews : Map.Map<Nat, ReviewTypes.Review>;
  let nextReviewId : { var value : Nat };
  let comments : Map.Map<Nat, CommentTypes.Comment>;
  let nextCommentId : { var value : Nat };
  let suggestions : Map.Map<Nat, SuggestionTypes.Suggestion>;
  let nextSuggestionId : { var value : Nat };

  // --- Per-caller data ---
  let favorites : Map.Map<Principal, Map.Map<Nat, FavoriteTypes.Favorite>>;
  let passport : Map.Map<Principal, Map.Map<Nat, PassportTypes.PassportEntry>>;

  // Sample principal used only to seed OQL schema discovery; the value is ignored.
  transient let anyPrincipal = Principal.fromText("aaaaa-aa");

  // Flatten the per-caller favorites map into one row per (owner, food) pair so
  // OQL can query it. The owner lives in the outer map key, so it is promoted
  // into the row here.
  func favoriteRows() : Iter.Iter<FavoriteTypes.Favorite> {
    let rows = List.empty<FavoriteTypes.Favorite>();
    for ((owner, mine) in favorites.entries()) {
      for (fav in mine.values()) {
        rows.add({ owner; foodId = fav.foodId });
      };
    };
    rows.values();
  };

  // Flatten the per-caller passport map into one row per (owner, food) pair.
  func passportRows() : Iter.Iter<PassportTypes.PassportEntry> {
    let rows = List.empty<PassportTypes.PassportEntry>();
    for ((owner, mine) in passport.entries()) {
      for (entry in mine.values()) {
        rows.add({ owner; foodId = entry.foodId });
      };
    };
    rows.values();
  };

  include MixinAuthorization(accessControlState, null);

  include ReviewsApi(reviews, nextReviewId);
  include CommentsApi(comments, nextCommentId);
  include SuggestionsApi(suggestions, nextSuggestionId);
  include FavoritesApi(favorites);
  include PassportApi(passport);

  include ApiDocMixin();

  include Expose({
    entities = [
      // Community content: world-readable, including logged-out visitors.
      reviews.toEntity("review", "Review", "id")
        .sample({
          id = 0;
          foodId = 0;
          reviewerName = "";
          rating = 0;
          text = "";
          createdAt = 0;
        })
        .public_()
        .build(),
      comments.toEntity("comment", "Comment", "id")
        .sample({
          id = 0;
          foodId = 0;
          authorName = "";
          text = "";
          createdAt = 0;
        })
        .public_()
        .build(),
      // `Suggestion` carries an option (`name`) and a variant (`category`),
      // which the structural `_toRow` derivation cannot handle, so declare
      // each column explicitly and collapse both to `Text` with sentinels.
      OQL.Entity.manual<SuggestionTypes.Suggestion>(
        "suggestion",
        func () : Iter.Iter<SuggestionTypes.Suggestion> = suggestions.values(),
        "Suggestion",
        "id",
      )
        .sample({
          id = 0;
          name = null;
          text = "";
          category = #filipinoFood;
          createdAt = 0;
        })
        .payload("id", func s = s.id)
        .payload(
          "name",
          func s = switch (s.name) { case null ""; case (?n) n },
        )
        .payload("text", func s = s.text)
        .payload(
          "category",
          func s = switch (s.category) {
            case (#filipinoFood) "filipinoFood";
            case (#internationalFood) "internationalFood";
            case (#topic) "topic";
            case (#websiteImprovement) "websiteImprovement";
          },
        )
        .payload("createdAt", func s = s.createdAt)
        .public_()
        .build(),
      // Per-caller data: each signed-in caller reads only their own rows, while
      // the platform controller (and the Data Intelligence agent) reads all.
      OQL.Entity.manual<FavoriteTypes.Favorite>(
        "favorite",
        favoriteRows,
        "Favorite",
        "foodId",
      )
        .sample({ owner = anyPrincipal; foodId = 0 })
        .payload("owner", func f = f.owner)
        .payload("foodId", func f = f.foodId)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      OQL.Entity.manual<PassportTypes.PassportEntry>(
        "passport",
        passportRows,
        "PassportEntry",
        "foodId",
      )
        .sample({ owner = anyPrincipal; foodId = 0 })
        .payload("owner", func p = p.owner)
        .payload("foodId", func p = p.foodId)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
    ];
  });
};

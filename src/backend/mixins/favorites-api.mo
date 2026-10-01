/// Public API for LASA Favorites.
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import FavoritesLib "../lib/favorites";
import Types "../types/favorites";

mixin (
  favorites : Map.Map<Principal, Map.Map<Nat, Types.Favorite>>,
) {
  /// Toggle a food as favorite for the caller; returns the new state.
  public shared ({ caller }) func toggleFavorite(foodId : Nat) : async Bool {
    FavoritesLib.toggleFavorite(favorites, caller, foodId);
  };

  /// List the caller's favorite food ids.
  public query ({ caller }) func listFavorites() : async [Nat] {
    FavoritesLib.listFavorites(favorites, caller);
  };
};

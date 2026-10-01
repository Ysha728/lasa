/// Domain logic for LASA Favorites.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Types "../types/favorites";

module {
  /// Toggle a food as favorite for the caller; returns the new state.
  public func toggleFavorite(
    favorites : Map.Map<Principal, Map.Map<Nat, Types.Favorite>>,
    caller : Principal,
    foodId : Nat,
  ) : Bool {
    // Each caller has their own inner map of favorited foods.
    let mine = switch (favorites.get(caller)) {
      case (?existing) { existing };
      case null {
        let fresh = Map.empty<Nat, Types.Favorite>();
        favorites.add(caller, fresh);
        fresh;
      };
    };

    // If it is already a favorite, remove it; otherwise add it.
    if (mine.containsKey(foodId)) {
      mine.remove(foodId);
      false;
    } else {
      mine.add(foodId, { owner = caller; foodId });
      true;
    };
  };

  /// The caller's favorite food ids.
  public func listFavorites(
    favorites : Map.Map<Principal, Map.Map<Nat, Types.Favorite>>,
    caller : Principal,
  ) : [Nat] {
    switch (favorites.get(caller)) {
      case (?mine) { mine.keys().toArray() };
      case null { [] };
    };
  };
};

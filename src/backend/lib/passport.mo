/// Domain logic for the LASA Flavor Passport.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Types "../types/passport";

module {
  /// Mark a food as explored for the caller; returns the new state.
  public func markExplored(
    passport : Map.Map<Principal, Map.Map<Nat, Types.PassportEntry>>,
    caller : Principal,
    foodId : Nat,
  ) : Bool {
    // Each caller has their own inner map of explored foods.
    let mine = switch (passport.get(caller)) {
      case (?existing) { existing };
      case null {
        let fresh = Map.empty<Nat, Types.PassportEntry>();
        passport.add(caller, fresh);
        fresh;
      };
    };

    // Stamps are permanent: once explored, always explored.
    if (mine.containsKey(foodId)) {
      true;
    } else {
      mine.add(foodId, { owner = caller; foodId });
      true;
    };
  };

  /// The caller's explored food ids.
  public func listExplored(
    passport : Map.Map<Principal, Map.Map<Nat, Types.PassportEntry>>,
    caller : Principal,
  ) : [Nat] {
    switch (passport.get(caller)) {
      case (?mine) { mine.keys().toArray() };
      case null { [] };
    };
  };
};

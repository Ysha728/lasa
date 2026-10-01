/// Public API for the LASA Flavor Passport.
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import PassportLib "../lib/passport";
import Types "../types/passport";

mixin (
  passport : Map.Map<Principal, Map.Map<Nat, Types.PassportEntry>>,
) {
  /// Mark a food as explored for the caller; returns the new state.
  public shared ({ caller }) func markExplored(foodId : Nat) : async Bool {
    PassportLib.markExplored(passport, caller, foodId);
  };

  /// List the caller's explored food ids.
  public query ({ caller }) func listExplored() : async [Nat] {
    PassportLib.listExplored(passport, caller);
  };
};

/// Cross-cutting types shared across LASA domains.
module {
  /// Identifier of a featured food (1..6 in the LASA catalog).
  public type FoodId = Nat;

  /// Wall-clock timestamp in nanoseconds since the Unix epoch.
  public type Timestamp = Nat;
};

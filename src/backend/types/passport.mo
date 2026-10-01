/// Types for the LASA Flavor Passport domain.
import Common "../types/common";

module {
  /// A passport stamp: which caller has explored which food.
  public type PassportEntry = {
    owner : Principal;
    foodId : Common.FoodId;
  };
};

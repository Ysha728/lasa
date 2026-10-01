/// Types for the LASA Favorites domain.
import Common "../types/common";

module {
  /// A favorite record: which caller favorited which food.
  public type Favorite = {
    owner : Principal;
    foodId : Common.FoodId;
  };
};

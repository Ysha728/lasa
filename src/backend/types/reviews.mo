/// Types for the LASA Reviews & Ratings domain.
import Common "../types/common";

module {
  /// A submitted review, as stored and returned to the frontend.
  public type Review = {
    id : Nat;
    foodId : Common.FoodId;
    reviewerName : Text;
    rating : Nat; // 1..5 stars
    text : Text;
    createdAt : Common.Timestamp;
  };

  /// Input accepted when a visitor submits a review.
  public type ReviewInput = {
    foodId : Common.FoodId;
    reviewerName : Text;
    rating : Nat; // 1..5 stars
    text : Text;
  };

  /// Aggregate rating summary for one food.
  public type ReviewStats = {
    foodId : Common.FoodId;
    count : Nat;
    average : Float; // 0.0 when there are no reviews
  };
};

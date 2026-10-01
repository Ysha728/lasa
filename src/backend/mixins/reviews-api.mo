/// Public API for LASA Reviews & Ratings.
import Map "mo:core/Map";
import ReviewsLib "../lib/reviews";
import Types "../types/reviews";

mixin (
  reviews : Map.Map<Nat, Types.Review>,
  nextReviewId : { var value : Nat },
) {
  /// Submit a review with a 1-5 star rating, reviewer name, and review text.
  public shared func submitReview(input : Types.ReviewInput) : async Types.Review {
    ReviewsLib.addReview(reviews, nextReviewId, input);
  };

  /// List all submitted reviews, newest first.
  public query func listReviews() : async [Types.Review] {
    ReviewsLib.listReviews(reviews);
  };

  /// Average rating and review count for one food.
  public query func getReviewStats(foodId : Nat) : async Types.ReviewStats {
    ReviewsLib.statsFor(reviews, foodId);
  };
};

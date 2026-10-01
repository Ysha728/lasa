/// Domain logic for LASA Reviews & Ratings.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/reviews";

module {
  /// Append a review and return it with its assigned id.
  /// Validates that the rating is 1..5 and the review text is not empty.
  public func addReview(
    reviews : Map.Map<Nat, Types.Review>,
    nextId : { var value : Nat },
    input : Types.ReviewInput,
  ) : Types.Review {
    // A rating must be a whole number of stars from 1 to 5.
    if (input.rating < 1 or input.rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    // Reject blank review text (trimmed of surrounding whitespace).
    if (input.text.trim(#predicate(func c = c == ' ')).size() == 0) {
      Runtime.trap("Review text must not be empty");
    };

    // Assign the next id and advance the counter.
    let id = nextId.value;
    nextId.value := id + 1;

    let review : Types.Review = {
      id;
      foodId = input.foodId;
      reviewerName = input.reviewerName;
      rating = input.rating;
      text = input.text;
      createdAt = Int.abs(Time.now());
    };
    reviews.add(id, review);
    review;
  };

  /// All reviews, newest first.
  public func listReviews(reviews : Map.Map<Nat, Types.Review>) : [Types.Review] {
    // Higher ids are newer, so sort descending by id.
    reviews.values().toArray().sort(func(a, b) = Nat.compare(b.id, a.id));
  };

  /// Aggregate rating summary for one food.
  public func statsFor(reviews : Map.Map<Nat, Types.Review>, foodId : Nat) : Types.ReviewStats {
    var count = 0;
    var sum = 0;
    for (review in reviews.values()) {
      if (review.foodId == foodId) {
        count += 1;
        sum += review.rating;
      };
    };
    // Average is 0.0 when there are no reviews for this food.
    let average = if (count == 0) { 0.0 } else { sum.toFloat() / count.toFloat() };
    { foodId; count; average };
  };
};

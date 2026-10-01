/// Types for the LASA Comments domain.
import Common "../types/common";

module {
  /// A submitted comment, as stored and returned to the frontend.
  public type Comment = {
    id : Nat;
    foodId : Common.FoodId;
    authorName : Text;
    text : Text;
    createdAt : Common.Timestamp;
  };

  /// Input accepted when a visitor leaves a comment.
  public type CommentInput = {
    foodId : Common.FoodId;
    authorName : Text;
    text : Text;
  };
};

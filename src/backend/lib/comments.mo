/// Domain logic for LASA Comments.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/comments";

module {
  /// Append a comment and return it with its assigned id.
  /// Validates that the comment text is not empty.
  public func addComment(
    comments : Map.Map<Nat, Types.Comment>,
    nextId : { var value : Nat },
    input : Types.CommentInput,
  ) : Types.Comment {
    // Reject blank comment text (trimmed of surrounding whitespace).
    if (input.text.trim(#predicate(func c = c == ' ')).size() == 0) {
      Runtime.trap("Comment text must not be empty");
    };

    // Assign the next id and advance the counter.
    let id = nextId.value;
    nextId.value := id + 1;

    let comment : Types.Comment = {
      id;
      foodId = input.foodId;
      authorName = input.authorName;
      text = input.text;
      createdAt = Int.abs(Time.now());
    };
    comments.add(id, comment);
    comment;
  };

  /// All comments, newest first.
  public func listComments(comments : Map.Map<Nat, Types.Comment>) : [Types.Comment] {
    // Higher ids are newer, so sort descending by id.
    comments.values().toArray().sort(func(a, b) = Nat.compare(b.id, a.id));
  };
};

/// Public API for LASA Comments.
import Map "mo:core/Map";
import CommentsLib "../lib/comments";
import Types "../types/comments";

mixin (
  comments : Map.Map<Nat, Types.Comment>,
  nextCommentId : { var value : Nat },
) {
  /// Leave a food-related comment.
  public shared func submitComment(input : Types.CommentInput) : async Types.Comment {
    CommentsLib.addComment(comments, nextCommentId, input);
  };

  /// List all comments, newest first.
  public query func listComments() : async [Types.Comment] {
    CommentsLib.listComments(comments);
  };
};

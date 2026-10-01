/// Types for the LASA Suggestions Box domain.
import Common "../types/common";

module {
  /// Category a visitor can pick when suggesting something.
  public type SuggestionCategory = {
    #filipinoFood;
    #internationalFood;
    #topic;
    #websiteImprovement;
  };

  /// A submitted suggestion, as stored and returned to the frontend.
  public type Suggestion = {
    id : Nat;
    name : ?Text; // optional
    text : Text;
    category : SuggestionCategory;
    createdAt : Common.Timestamp;
  };

  /// Input accepted when a visitor submits a suggestion.
  public type SuggestionInput = {
    name : ?Text; // optional
    text : Text;
    category : SuggestionCategory;
  };
};

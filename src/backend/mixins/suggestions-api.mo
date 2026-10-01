/// Public API for the LASA Suggestions Box.
import Map "mo:core/Map";
import SuggestionsLib "../lib/suggestions";
import Types "../types/suggestions";

mixin (
  suggestions : Map.Map<Nat, Types.Suggestion>,
  nextSuggestionId : { var value : Nat },
) {
  /// Submit a food, topic, or website-improvement suggestion.
  public shared func submitSuggestion(input : Types.SuggestionInput) : async Types.Suggestion {
    SuggestionsLib.addSuggestion(suggestions, nextSuggestionId, input);
  };

  /// List all submitted suggestions, newest first.
  public query func listSuggestions() : async [Types.Suggestion] {
    SuggestionsLib.listSuggestions(suggestions);
  };
};

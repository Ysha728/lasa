/// Domain logic for the LASA Suggestions Box.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/suggestions";

module {
  /// Append a suggestion and return it with its assigned id.
  /// Validates that the suggestion text is not empty.
  public func addSuggestion(
    suggestions : Map.Map<Nat, Types.Suggestion>,
    nextId : { var value : Nat },
    input : Types.SuggestionInput,
  ) : Types.Suggestion {
    // Reject blank suggestion text (trimmed of surrounding whitespace).
    if (input.text.trim(#predicate(func c = c == ' ')).size() == 0) {
      Runtime.trap("Suggestion text must not be empty");
    };

    // Assign the next id and advance the counter.
    let id = nextId.value;
    nextId.value := id + 1;

    let suggestion : Types.Suggestion = {
      id;
      name = input.name;
      text = input.text;
      category = input.category;
      createdAt = Int.abs(Time.now());
    };
    suggestions.add(id, suggestion);
    suggestion;
  };

  /// All suggestions, newest first.
  public func listSuggestions(suggestions : Map.Map<Nat, Types.Suggestion>) : [Types.Suggestion] {
    // Higher ids are newer, so sort descending by id.
    suggestions.values().toArray().sort(func(a, b) = Nat.compare(b.id, a.id));
  };
};

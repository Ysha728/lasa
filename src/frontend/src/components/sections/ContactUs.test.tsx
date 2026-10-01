/**
 * ContactUs — contact details plus the self-contained message form.
 *
 * Covers the accepted behavior that the section exposes contact details and a
 * form that validates its fields in the browser and confirms a valid submission
 * locally (there is no backend endpoint for contact messages).
 */
import { ContactUs } from "@/components/sections/ContactUs";
import { renderWithProviders } from "@/test/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("ContactUs", () => {
  it("shows the contact details and the message form", () => {
    renderWithProviders(<ContactUs />);

    expect(
      screen.getByRole("heading", { name: "Say hello to the LASA team" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("contact.email_link")).toHaveAttribute(
      "href",
      "mailto:hello@lasafoodjournal.example",
    );
    expect(screen.getByTestId("contact.form")).toBeInTheDocument();
  });

  it("validates every required field before confirming", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactUs />);

    await user.click(screen.getByTestId("contact.submit_button"));

    expect(await screen.findByTestId("contact.name_error")).toHaveTextContent(
      "Please tell us your name.",
    );
    expect(screen.getByTestId("contact.email_error")).toHaveTextContent(
      "Please add an email so we can reply.",
    );
    expect(screen.getByTestId("contact.message_error")).toHaveTextContent(
      "Please write a short message.",
    );
    expect(
      screen.queryByTestId("contact.success_state"),
    ).not.toBeInTheDocument();
  });

  it("rejects a malformed email address", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactUs />);

    await user.type(screen.getByTestId("contact.name_input"), "Juan D.");
    await user.type(screen.getByTestId("contact.email_input"), "not-an-email");
    await user.type(
      screen.getByTestId("contact.message_textarea"),
      "I love the LASA food journal.",
    );
    await user.click(screen.getByTestId("contact.submit_button"));

    expect(await screen.findByTestId("contact.email_error")).toHaveTextContent(
      "That email address does not look right.",
    );
    expect(
      screen.queryByTestId("contact.success_state"),
    ).not.toBeInTheDocument();
  });

  it("confirms a valid message and clears the draft", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactUs />);

    await user.type(screen.getByTestId("contact.name_input"), "Juan D.");
    await user.type(
      screen.getByTestId("contact.email_input"),
      "juan@example.com",
    );
    await user.type(
      screen.getByTestId("contact.message_textarea"),
      "I love the LASA food journal.",
    );
    await user.click(screen.getByTestId("contact.submit_button"));

    expect(
      await screen.findByTestId("contact.success_state"),
    ).toHaveTextContent("Thanks! Your message has been received.");
    expect(screen.getByTestId("contact.name_input")).toHaveValue("");
    expect(screen.getByTestId("contact.message_textarea")).toHaveValue("");
  });
});

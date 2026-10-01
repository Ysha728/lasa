/**
 * ContactUs — contact details plus a simple, self-contained message form.
 *
 * There is no backend endpoint for contact messages, so the form validates the
 * input in the browser and confirms the submission locally. Nothing is sent
 * anywhere; the success message simply tells the visitor their message was
 * received by the page.
 */
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Send } from "lucide-react";
import { type FormEvent, useState } from "react";

/** Shape of the form fields and their validation errors. */
interface ContactForm {
  name: string;
  email: string;
  message: string;
}

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const EMPTY_FORM: ContactForm = { name: "", email: "", message: "" };

/** A very small email check — good enough for a client-side form. */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactUs() {
  // The form draft is local UI state. It is only cleared after a successful
  // local submission, never by anything else.
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  /** Update one field and clear its error as the visitor types. */
  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  };

  /** Validate every field and return the errors found. */
  const validate = (values: ContactForm): ContactErrors => {
    const next: ContactErrors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.email.trim()) {
      next.email = "Please add an email so we can reply.";
    } else if (!isValidEmail(values.email)) {
      next.email = "That email address does not look right.";
    }
    if (!values.message.trim()) {
      next.message = "Please write a short message.";
    } else if (values.message.trim().length < 10) {
      next.message = "Your message should be at least 10 characters.";
    }
    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setSubmitted(false);
      return;
    }
    // No backend exists for contact messages, so we confirm locally and reset
    // the draft for the next message.
    setSubmitted(true);
    setForm(EMPTY_FORM);
  };

  return (
    <Section id="contact" label="Contact Us" className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading block */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Contact Us
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Say hello to the LASA team
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Questions, feedback, or a dish we should feature? We would love to
            hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Contact details column */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col gap-5 rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Reach us directly
              </h3>

              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href="mailto:hello@lasafoodjournal.example"
                    data-ocid="contact.email_link"
                    className="break-words text-sm text-muted-foreground underline-offset-4 transition-smooth hover:text-primary hover:underline"
                  >
                    hello@lasafoodjournal.example
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Where we are
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A student project, made with love in the Philippines.
                  </p>
                </div>
              </div>

              <p className="mt-auto rounded-2xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
                We are students, so replies may take a little while — but every
                message gets read.
              </p>
            </div>
          </div>

          {/* Contact form column */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              data-ocid="contact.form"
              className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-name">Your name</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Juan Dela Cruz"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    data-ocid="contact.name_input"
                    className="h-11 rounded-xl"
                  />
                  {errors.name ? (
                    <p
                      id="contact-name-error"
                      data-ocid="contact.name_error"
                      className="text-sm text-destructive"
                    >
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-email">Email address</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    data-ocid="contact.email_input"
                    className="h-11 rounded-xl"
                  />
                  {errors.email ? (
                    <p
                      id="contact-email-error"
                      data-ocid="contact.email_error"
                      className="text-sm text-destructive"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Message */}
              <div className="mt-5 flex flex-col gap-2">
                <Label htmlFor="contact-message">Your message</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Tell us what is on your mind…"
                  rows={5}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  data-ocid="contact.message_textarea"
                  className="min-h-32 rounded-xl"
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    data-ocid="contact.message_error"
                    className="text-sm text-destructive"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  size="lg"
                  data-ocid="contact.submit_button"
                  className="w-full rounded-full bg-primary px-8 text-primary-foreground shadow-glow transition-smooth hover:bg-primary/90 sm:w-auto"
                >
                  Send message
                  <Send className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>

                {/* Local confirmation — no backend is involved. */}
                {submitted ? (
                  <output
                    data-ocid="contact.success_state"
                    className="flex items-center gap-2 text-sm font-medium text-success"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Thanks! Your message has been received.
                  </output>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}

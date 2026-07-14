import { sanitizeCampaignHtml, interpolate, buildCampaignEmailHtml } from "./utils";

describe("sanitizeCampaignHtml", () => {
  test("strips script, iframe, and form tags", () => {
    const html = `<p>Hi</p><script>alert(1)</script><iframe src="x"></iframe><form></form>`;
    const result = sanitizeCampaignHtml(html);
    expect(result).not.toMatch(/<script/i);
    expect(result).not.toMatch(/<iframe/i);
    expect(result).not.toMatch(/<form/i);
    expect(result).toContain("<p>Hi</p>");
  });

  test("strips inline event handler attributes", () => {
    const html = `<img src="x.png" onerror="alert(1)" onclick='steal()' />`;
    const result = sanitizeCampaignHtml(html);
    expect(result).not.toMatch(/onerror/i);
    expect(result).not.toMatch(/onclick/i);
  });

  test("strips javascript: and data: URIs", () => {
    const html = `<a href="javascript:alert(1)">click</a><a href="data:text/html,evil">x</a>`;
    const result = sanitizeCampaignHtml(html);
    expect(result).not.toMatch(/javascript:/i);
    expect(result).not.toMatch(/data:text\/html/i);
  });

  test("leaves safe markup untouched", () => {
    const html = `<p>Hello <strong>there</strong></p><a href="https://eaziwage.com">link</a>`;
    expect(sanitizeCampaignHtml(html)).toBe(html);
  });
});

describe("interpolate", () => {
  test("replaces {{full_name}} with the first name", () => {
    expect(interpolate("Hi {{full_name}},", "Jane Doe")).toBe("Hi Jane,");
  });

  test("falls back to 'there' when name is missing", () => {
    expect(interpolate("Hi {{full_name}},", null)).toBe("Hi there,");
    expect(interpolate("Hi {{full_name}},", "")).toBe("Hi there,");
  });

  test("replaces every occurrence", () => {
    expect(interpolate("{{full_name}} and {{full_name}}", "Amina")).toBe("Amina and Amina");
  });
});

describe("buildCampaignEmailHtml", () => {
  test("embeds content, unsubscribe link, and escapes the subject", () => {
    const result = buildCampaignEmailHtml(
      "<p>Body</p>",
      'Weekly <update> & "news"',
      "https://eaziwage.com/unsubscribe?t=abc",
      "https://eaziwage.com"
    );

    expect(result).toContain("<p>Body</p>");
    expect(result).toContain("https://eaziwage.com/unsubscribe?t=abc");
    expect(result).toContain("Weekly &lt;update&gt; &amp; &quot;news&quot;");
    expect(result).not.toContain('Weekly <update>');
  });
});

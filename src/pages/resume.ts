const resumePath = "/assets/Ryan_Vu_Resume.pdf";

export function renderResume(): string {
  return `
    <section class="resume-page" aria-labelledby="resume-title">
      <div class="section-heading boot">
        <div>
          <p class="eyebrow">Resume</p>
          <h1 id="resume-title">Ryan Vu — Resume</h1>
        </div>
      </div>
      <div class="intro-actions">
        <a class="button" href="${resumePath}" target="_blank" rel="noreferrer">Open PDF</a>
        <a class="button button--quiet" href="${resumePath}" download>Download</a>
      </div>
      <object class="resume-embed" data="${resumePath}" type="application/pdf" aria-label="Ryan Vu resume PDF">
        <p>
          The PDF preview is unavailable in this browser.
          <a href="${resumePath}" target="_blank" rel="noreferrer">Open the resume PDF</a>.
        </p>
      </object>
    </section>
  `;
}

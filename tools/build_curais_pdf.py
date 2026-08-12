from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "curais_product_foundation.pdf"

TEAL = colors.HexColor("#0B5D64")
INK = colors.HexColor("#10252B")
MINT = colors.HexColor("#E8F5F2")
RED = colors.HexColor("#B83A3A")

docs = [
    ("The Curais Story", ROOT / "docs" / "CURAIS_BRAND_STORY.md"),
    ("Product Requirements", ROOT / "docs" / "PRD.md"),
    ("Technical Architecture", ROOT / "docs" / "TAD.md"),
    ("Security Assessment", ROOT / "docs" / "SECURITY_ASSESSMENT.md"),
    ("Feature Ticket List", ROOT / "docs" / "FEATURE_TICKETS.md"),
    ("Frontend Specification", ROOT / "docs" / "FRONTEND_SPEC.md"),
]


def clean_inline(text):
    text = escape(text.strip())
    text = text.replace("**", "")
    text = text.replace("`", "")
    return text


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#CFE5E0"))
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFillColor(TEAL)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(18 * mm, 9 * mm, "CURAIS - PRODUCT FOUNDATION")
    canvas.setFillColor(colors.HexColor("#5B6B70"))
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(192 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


def add_markdown(story, path, styles):
    lines = path.read_text().splitlines()
    bullet_buffer = []

    def flush_bullets():
        nonlocal bullet_buffer
        if bullet_buffer:
            story.append(Spacer(1, 2 * mm))
            for bullet in bullet_buffer:
                story.append(Paragraph("• " + clean_inline(bullet), styles["cur_body"]))
                story.append(Spacer(1, 1.3 * mm))
            story.append(Spacer(1, 1.5 * mm))
            bullet_buffer = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush_bullets()
            story.append(Spacer(1, 2 * mm))
            continue
        if stripped.startswith("|"):
            # Preserve compact ticket/metric table rows as readable lines.
            flush_bullets()
            cells = [clean_inline(c) for c in stripped.strip("|").split("|")]
            if all(set(c.replace(" ", "")) <= {"-", ":"} for c in cells):
                continue
            story.append(Paragraph("  <b> | </b>  ".join(cells), styles["cur_table"]))
            story.append(Spacer(1, 1.1 * mm))
            continue
        if stripped.startswith("# "):
            flush_bullets()
            story.append(Paragraph(clean_inline(stripped[2:]), styles["doc_title"]))
            story.append(Spacer(1, 4 * mm))
        elif stripped.startswith("## "):
            flush_bullets()
            story.append(Spacer(1, 3 * mm))
            story.append(Paragraph(clean_inline(stripped[3:]), styles["cur_h2"]))
            story.append(Spacer(1, 2 * mm))
        elif stripped.startswith("### "):
            flush_bullets()
            story.append(Spacer(1, 2 * mm))
            story.append(Paragraph(clean_inline(stripped[4:]), styles["cur_h3"]))
            story.append(Spacer(1, 1.5 * mm))
        elif stripped.startswith("- "):
            bullet_buffer.append(stripped[2:])
        elif stripped[:2].isdigit() and ". " in stripped[:4]:
            flush_bullets()
            story.append(Paragraph(clean_inline(stripped), styles["cur_body"]))
            story.append(Spacer(1, 1.3 * mm))
        else:
            flush_bullets()
            story.append(Paragraph(clean_inline(stripped), styles["cur_body"]))
            story.append(Spacer(1, 1.8 * mm))
    flush_bullets()


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("cover_title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=34, leading=40, textColor=INK, alignment=TA_CENTER, spaceAfter=7 * mm))
    styles.add(ParagraphStyle("cover_subtitle", parent=styles["BodyText"], fontName="Helvetica", fontSize=14, leading=20, textColor=TEAL, alignment=TA_CENTER))
    styles.add(ParagraphStyle("doc_title", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=22, leading=27, textColor=INK, spaceAfter=2 * mm))
    styles.add(ParagraphStyle("cur_h2", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=TEAL))
    styles.add(ParagraphStyle("cur_h3", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK))
    styles.add(ParagraphStyle("cur_body", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=INK))
    styles.add(ParagraphStyle("cur_table", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.4, leading=11.2, textColor=INK, backColor=MINT, borderPadding=4))
    return styles


def make_pdf(output, title, sources, include_cover=False):
    output.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles()
    doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=21 * mm, title=title)
    story = []
    if include_cover:
        story = [Spacer(1, 38 * mm), Paragraph("CURAIS", styles["cover_title"]), Paragraph("Product Foundation", styles["cover_subtitle"]), Spacer(1, 9 * mm), Paragraph("Brand story, product requirements, architecture, security, feature delivery, and frontend direction.", styles["cover_subtitle"]), Spacer(1, 26 * mm), Paragraph("Clear help now. Better care next.", ParagraphStyle("tag", parent=styles["cover_subtitle"], fontName="Helvetica-Bold", textColor=RED)), PageBreak()]
    for index, (_, path) in enumerate(sources):
        add_markdown(story, path, styles)
        if index != len(sources) - 1:
            story.append(PageBreak())
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def main():
    make_pdf(OUTPUT, "Curais Product Foundation", docs, include_cover=True)
    individual_docs = [
        ("PRD", "curais_prd.pdf", ROOT / "docs" / "PRD.md"),
        ("Technical Architecture Document", "curais_technical_architecture.pdf", ROOT / "docs" / "TAD.md"),
        ("Security Assessment", "curais_security_assessment.pdf", ROOT / "docs" / "SECURITY_ASSESSMENT.md"),
        ("Feature Ticket List", "curais_feature_tickets.pdf", ROOT / "docs" / "FEATURE_TICKETS.md"),
        ("Frontend Specification", "curais_frontend_specification.pdf", ROOT / "docs" / "FRONTEND_SPEC.md"),
    ]
    for title, filename, path in individual_docs:
        make_pdf(ROOT / "output" / "pdf" / filename, title, [(title, path)])
    print(OUTPUT)


if __name__ == "__main__":
    main()

$ErrorActionPreference = "Stop"

# ── 1. Fix about-us.html badge ──
$content = Get-Content "about-us.html" -Raw -Encoding UTF8
$content = $content -replace '<div class="about-badge">\s*<span class="badge-icon">👥</span> ABOUT US\s*</div>', '<div class="about-badge"><span class="about-badge-dot"></span> ABOUT US</div>'
Set-Content "about-us.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "✓ about-us.html badge updated"

# ── 2. Fix events.html badge (replace the complex pill with a simple pill) ──
$content = Get-Content "events.html" -Raw -Encoding UTF8
# Use regex to replace the entire events-badge-pill div block
$content = $content -replace '(?s)<div class="events-badge-pill">.*?</div>\s*(?=<h1)', '<div class="events-badge-pill"><span class="events-badge-dot"></span> EVENTS &amp; ACHIEVEMENTS</div>
        '
Set-Content "events.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "✓ events.html badge updated"

Write-Host "✓ All badge HTML updates applied"

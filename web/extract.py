import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make navigation consistent across pages
nav_replacements = [
    (r'href="#hero"', 'href="index.html#hero"'),
    (r'href="#about"', 'href="index.html#about"'),
    (r'href="#services"', 'href="index.html#services"'),
    (r'href="#tours"', 'href="index.html#tours"'),
    (r'href="#visa"', 'href="index.html#visa"'),
    (r'href="#flights"', 'href="index.html#flights"'),
    (r'href="#live-search"', 'href="flight-search.html"'),
    (r'href="#rate-portal"', 'href="agent-portal.html"'),
    (r'href="#hajj-umrah"', 'href="index.html#hajj-umrah"'),
    (r'href="#contact"', 'href="index.html#contact"'),
]

# Quicklinks footer
nav_replacements_footer = [
    (r'href="#hero"', 'href="index.html#hero"'),
    (r'href="#about"', 'href="index.html#about"'),
    (r'href="#services"', 'href="index.html#services"'),
    (r'href="#flights"', 'href="index.html#flights"'),
    (r'href="#contact"', 'href="index.html#contact"'),
]

def apply_nav(content):
    for old, new in nav_replacements:
        content = content.replace(old, new)
    return content

# Split into parts
header_match = re.search(r'(.*?<!-- Hero Section -->)', html, re.DOTALL)
if not header_match:
    print("Header not found")
    exit(1)
header_html = header_match.group(1).replace('<!-- Hero Section -->', '')

live_search_match = re.search(r'(<section id="live-search".*?</section>\s*)', html, re.DOTALL)
live_search_html = live_search_match.group(1) if live_search_match else ''

rate_portal_match = re.search(r'(<section id="rate-portal".*?</section>\s*)', html, re.DOTALL)
rate_portal_html = rate_portal_match.group(1) if rate_portal_match else ''

footer_match = re.search(r'(<!-- Footer -->.*)', html, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else ''

# Update header html with global links
header_html = apply_nav(header_html)
header_html = header_html.replace('href="index.html" class="font-heading"', 'href="index.html" class="font-heading"')

# Update footer html with global links
footer_html = apply_nav(footer_html)

# Create flight-search.html
flight_html = header_html + "<main>\n" + live_search_html + "</main>\n" + footer_html
with open('flight-search.html', 'w', encoding='utf-8') as f:
    f.write(flight_html)

# Create agent-portal.html
agent_html = header_html + "<main>\n" + rate_portal_html + "</main>\n" + footer_html
with open('agent-portal.html', 'w', encoding='utf-8') as f:
    f.write(agent_html)

# Clean up index.html
new_index_html = html.replace(live_search_html, '')
new_index_html = new_index_html.replace(rate_portal_html, '')
new_index_html = apply_nav(new_index_html)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index_html)

print("Extraction complete")

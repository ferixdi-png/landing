---
description: Pre-push safety check to ensure all buttons and interactive elements work correctly in FERIXDI Studio
---

# Button Safety Check (run before every push to ferixdi_studio)

## 1. Section panels have `hidden` class
// turbo
```
Select-String -Path "app/index.html" -Pattern 'class="section-panel' | ForEach-Object { if($_.Line -notmatch '\bhidden\b') { Write-Host "FAIL: Line $($_.LineNumber) missing hidden!" } else { Write-Host "OK: Line $($_.LineNumber)" } }
```

## 2. All btn-* elements have JS handlers
// turbo
```
Select-String -Path "app/index.html" -Pattern 'id="btn-' | ForEach-Object { if($_.Line -match 'id="(btn-[^"]+)"') { $b=$Matches[1]; $found = Select-String -Path "app/main.js" -Pattern $b -SimpleMatch -Quiet; if(!$found) { Write-Host "FAIL: $b has no handler!" } else { Write-Host "OK: $b" } } }
```

## 3. No `position: relative/absolute/fixed` on broad interactive selectors in CSS
// turbo  
```
Select-String -Path "app/styles/main.css" -Pattern "position:\s*(relative|absolute|fixed)" | Where-Object { $_.Line -match '#app\s+(button|a|input|\.btn|\.nav-item|\.char-card|\.generation-mode-card)' } | ForEach-Object { Write-Host "FAIL: Line $($_.LineNumber) - broad position override!" }
```

## 4. Service Worker is NOT being registered
// turbo
```
Select-String -Path "app/index.html" -Pattern "register\('/sw.js'\)" -SimpleMatch -Quiet | ForEach-Object { if($_) { Write-Host "FAIL: SW is being registered! Must stay unregistered." } else { Write-Host "OK: SW not registered" } }
```

## 5. All overlay/modal elements have `hidden` class
// turbo
```
Select-String -Path "app/index.html" -Pattern '(modal|overlay).*fixed.*inset' | Where-Object { $_.Line -notmatch 'hidden' } | ForEach-Object { Write-Host "FAIL: Line $($_.LineNumber) - overlay without hidden!" }
```

## 6. All fixed inset-0 decorative elements have pointer-events:none
Check manually: stars-bg, scanline-active, matrix-rain must all have `pointer-events: none` in CSS.

## 7. Init functions all exist
// turbo
```
$content = [System.IO.File]::ReadAllText("app/main.js"); @('initApp','initNavigation','initGenerationMode','initGenerate','initSettings','initPromoCode') | ForEach-Object { if(!$content.Contains("function $_")) { Write-Host "FAIL: $_ missing!" } else { Write-Host "OK: $_" } }
```

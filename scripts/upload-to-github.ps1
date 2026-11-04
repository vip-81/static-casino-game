param(
  [Parameter(Mandatory = $true)][string]$Token,
  [string]$Owner = 'vip-81',
  [string]$Repo = 'static-casino-game',
  [string]$Branch = 'main',
  [Parameter(Mandatory = $true)][string]$Root
)

$ErrorActionPreference = 'Stop'
$api = "https://api.github.com/repos/$Owner/$Repo/contents"
$utf8 = New-Object System.Text.UTF8Encoding($false)

$files = Get-ChildItem -Path $Root -Recurse -File | Where-Object {
  $_.FullName -notmatch '\\dist\\' -and
  $_.FullName -notmatch '\\dist-gh\\' -and
  $_.FullName -notmatch '\\node_modules\\'
}

# Upload workflow file last so the push event fires only once with everything else in place.
$files = $files | Sort-Object { if ($_.Name -eq 'deploy.yml') { 1 } else { 0 } }

$ok = 0
$failed = @()

foreach ($f in $files) {
  $rel = $f.FullName.Substring($Root.Length + 1).Replace('\', '/')
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $b64 = [Convert]::ToBase64String($bytes)
  $body = @{
    message = "chore: add $rel"
    content = $b64
    branch  = $Branch
  } | ConvertTo-Json -Compress

  $tmp = Join-Path $env:TEMP ("ghbody_" + [Guid]::NewGuid().ToString('N') + ".json")
  [System.IO.File]::WriteAllText($tmp, $body, $utf8)

  $resp = (curl.exe -s -X PUT `
    -H "Authorization: Bearer $Token" `
    -H "Accept: application/vnd.github+json" `
    -H "X-GitHub-Api-Version: 2022-11-28" `
    -H "Content-Type: application/json" `
    --data-binary "@$tmp" `
    "$api/$rel") -join "`n"

  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  $parsed = $resp | ConvertFrom-Json
  if ($parsed.content -and $parsed.content.sha) {
    $ok++
    Write-Output ("OK   $rel")
  } else {
    $failed += $rel
    Write-Output ("FAIL $rel :: " + $parsed.message)
  }
}

Write-Output ("uploaded: $ok / " + $files.Count)
if ($failed.Count -gt 0) {
  Write-Output "failed:"
  $failed | ForEach-Object { Write-Output ("  " + $_) }
}

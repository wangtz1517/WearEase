$ErrorActionPreference = "Stop"

$serviceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $serviceDir ".env"

function Import-DotEnv {
  param(
    [string]$Path
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return
  }

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()

    if (-not $line -or $line.StartsWith("#")) {
      return
    }

    $parts = $line -split "=", 2

    if ($parts.Length -ne 2) {
      return
    }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim()

    if ($name) {
      [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

Set-Location $serviceDir
Import-DotEnv -Path $envFile

if (-not $env:PORT) {
  $env:PORT = "8123"
}

if (-not $env:AI_PROVIDER) {
  $env:AI_PROVIDER = "seedream"
}

if (-not $env:VOLCENGINE_INTAKE_IMAGE_MODEL) {
  if ($env:VOLCENGINE_IMAGE_MODEL) {
    $env:VOLCENGINE_INTAKE_IMAGE_MODEL = $env:VOLCENGINE_IMAGE_MODEL
  } else {
    $env:VOLCENGINE_INTAKE_IMAGE_MODEL = "doubao-seedream-5-0-260128"
  }
}

if ($env:AI_PROVIDER -eq "seedream" -and [string]::IsNullOrWhiteSpace($env:VOLCENGINE_API_KEY)) {
  Write-Host ""
  Write-Host "Missing VOLCENGINE_API_KEY." -ForegroundColor Red
  Write-Host "Create ai-intake-service\\.env based on .env.example, then run this script again."
  Write-Host ""
  exit 1
}

Write-Host ""
Write-Host "AI Intake Service" -ForegroundColor Cyan
Write-Host "Provider : $($env:AI_PROVIDER)"
Write-Host "Port     : $($env:PORT)"
Write-Host "Model    : $($env:VOLCENGINE_INTAKE_IMAGE_MODEL)"
Write-Host ""

node src/server.js

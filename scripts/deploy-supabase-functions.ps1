$ErrorActionPreference = "Stop"

param(
  [string]$ProjectRef = "ipmbtukabmdwyjhqtlju",
  [string]$VolcengineApiKey = $env:VOLCENGINE_API_KEY,
  [string]$IntakeModel = "doubao-seedream-5-0-260128",
  [string]$OutfitModel = "doubao-seedream-5-0-260128",
  [string]$Bucket = "garment-images",
  [switch]$SkipSecrets
)

$repoRoot = Split-Path -Parent $PSScriptRoot

function Require-Command {
  param(
    [string]$Name
  )

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

Require-Command -Name "supabase"

Set-Location $repoRoot

Write-Host ""
Write-Host "Supabase Project : $ProjectRef" -ForegroundColor Cyan
Write-Host "Repo Root        : $repoRoot"
Write-Host ""

supabase link --project-ref $ProjectRef

if (-not $SkipSecrets) {
  if ([string]::IsNullOrWhiteSpace($VolcengineApiKey)) {
    throw "VOLCENGINE_API_KEY is required unless -SkipSecrets is used."
  }

  supabase secrets set `
    AI_PROVIDER=seedream `
    VOLCENGINE_API_KEY=$VolcengineApiKey `
    VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3 `
    VOLCENGINE_INTAKE_IMAGE_MODEL=$IntakeModel `
    VOLCENGINE_OUTFIT_IMAGE_MODEL=$OutfitModel `
    GARMENT_IMAGES_BUCKET=$Bucket
}

supabase functions deploy ai-intake
supabase functions deploy ai-outfit-preview

Write-Host ""
Write-Host "Supabase Edge Functions deployed." -ForegroundColor Green
Write-Host "Functions: ai-intake, ai-outfit-preview"
Write-Host ""

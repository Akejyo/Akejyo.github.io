param([Parameter(Mandatory=$true)][string]$Source)
# Resize/crop only; the supplied artwork is never repainted or modified in place.
Add-Type -AssemblyName System.Drawing
$assetRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../assets'))
$original = [Drawing.Image]::FromFile((Resolve-Path -LiteralPath $Source))
try {
  if ($original.Width -ne 5504 -or $original.Height -ne 3072) { throw 'Expected canonical 5504 x 3072 artwork. Recheck overlay registration for a different composition.' }
  $encoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $quality = New-Object Drawing.Imaging.EncoderParameters(1)
  $quality.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, [long]92)
  foreach ($variant in @(@{Width=960;Mobile=$false},@{Width=1600;Mobile=$false},@{Width=2400;Mobile=$false},@{Width=640;Mobile=$true},@{Width=960;Mobile=$true})) {
    $width = $variant.Width
    $cropWidth = if ($variant.Mobile) { $original.Height * 4 / 5 } else { $original.Width }
    $height = [int][Math]::Round($width * $original.Height / $cropWidth)
    $bitmap = New-Object Drawing.Bitmap($width,$height)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $dest = New-Object Drawing.Rectangle(0,0,$width,$height)
      $graphics.DrawImage($original,$dest,[single](($original.Width-$cropWidth)/2),[single]0,[single]$cropWidth,[single]$original.Height,[Drawing.GraphicsUnit]::Pixel)
      $name = if ($variant.Mobile) { "persona-mobile-$width.jpg" } else { "persona-$width.jpg" }
      $bitmap.Save((Join-Path $assetRoot $name),$encoder,$quality)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
  }
  $quality.Dispose()
} finally { $original.Dispose() }
